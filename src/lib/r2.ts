import crypto from "node:crypto";

// Minimal Cloudflare R2 (S3-compatible) client.
//
// Hand-rolled AWS SigV4 on purpose: the only operations this app needs are
// PUT / DELETE / HEAD on a single bucket, and the official SDK would add
// ~3 MB of deps (plus a sharp/aws-crt tracing headache on Vercel) for that.
//
// Env:
//   R2_ACCOUNT_ID          Cloudflare account id (or use R2_ENDPOINT)
//   R2_ACCESS_KEY_ID       token Access Key ID
//   R2_SECRET_ACCESS_KEY   token Secret Access Key
//   R2_BUCKET              bucket name
//   R2_PUBLIC_BASE_URL     https://cdn.example.com  (custom domain / r2.dev)
//   R2_ENDPOINT            optional full endpoint override

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
  endpoint: string;
};

export function r2Config(): R2Config | null {
  const accountId = (process.env.R2_ACCOUNT_ID ?? "").trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID ?? "").trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY ?? "").trim();
  const bucket = (process.env.R2_BUCKET ?? "").trim();
  const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const explicitEndpoint = (process.env.R2_ENDPOINT ?? "").trim().replace(/\/+$/, "");

  if (!accessKeyId || !secretAccessKey || !bucket) return null;
  const endpoint = explicitEndpoint || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
  if (!endpoint) return null;

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl, endpoint };
}

export function r2PublicUrl(cfg: R2Config, key: string): string {
  const clean = key.replace(/^\/+/, "");
  if (cfg.publicBaseUrl) return `${cfg.publicBaseUrl}/${clean}`;
  // No custom domain configured: the bucket is private and this URL will 403.
  // Kept so uploads still record a stable path instead of throwing.
  return `${cfg.endpoint}/${cfg.bucket}/${clean}`;
}

const SERVICE = "s3";
const REGION = "auto";

function sha256Hex(data: string | Uint8Array): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function encodeSegment(segment: string): string {
  return encodeURIComponent(segment).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

/** S3 canonical URI: encode each segment, keep the `/` separators. */
function canonicalPath(bucket: string, key: string): string {
  const parts = [bucket, ...key.split("/")].filter((p, i) => p !== "" || i === 0);
  return "/" + parts.map(encodeSegment).join("/");
}

type SignInput = {
  method: "PUT" | "GET" | "HEAD" | "DELETE";
  /** Object key, or "" for bucket-level operations. */
  key: string;
  body?: Buffer;
  contentType?: string;
  cacheControl?: string;
  extraHeaders?: Record<string, string>;
};

type SigV4Input = {
  method: string;
  /** Canonical URI, already percent-encoded (e.g. `/bucket/a/b.webp`). */
  path: string;
  query?: string;
  /** Lower-case header names → values. `host` must be included. */
  headers: Record<string, string>;
  payloadHash: string;
  /** `YYYYMMDDTHHMMSSZ`. */
  amzDate: string;
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  service?: string;
};

/**
 * Pure SigV4 signer. Exported so `scripts/sigv4-selftest.mjs` can check it
 * against AWS's published test vector without touching the network.
 */
export function signV4(input: SigV4Input): { authorization: string; signature: string; stringToSign: string } {
  const region = input.region ?? REGION;
  const service = input.service ?? SERVICE;
  const date = input.amzDate.slice(0, 8);

  const signedHeaders = Object.keys(input.headers).map((h) => h.toLowerCase()).sort();
  const canonicalHeaders = signedHeaders.map((h) => `${h}:${input.headers[h].trim()}\n`).join("");

  const canonicalRequest = [
    input.method.toUpperCase(),
    input.path,
    input.query ?? "",
    canonicalHeaders,
    signedHeaders.join(";"),
    input.payloadHash,
  ].join("\n");

  const scope = `${date}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    input.amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${input.secretAccessKey}`, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");

  return {
    signature,
    stringToSign,
    authorization:
      `AWS4-HMAC-SHA256 Credential=${input.accessKeyId}/${scope}, ` +
      `SignedHeaders=${signedHeaders.join(";")}, Signature=${signature}`,
  };
}

function signedRequest(cfg: R2Config, input: SignInput) {
  const payload = input.body ?? Buffer.alloc(0);
  const payloadHash = sha256Hex(payload);

  // 20240101T000000Z / 20240101
  const stamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");

  const path = input.key ? canonicalPath(cfg.bucket, input.key) : "/" + encodeSegment(cfg.bucket);
  const url = new URL(cfg.endpoint + path);

  // Everything is stored lower-cased so the canonical form and the wire form
  // agree byte-for-byte (fetch sends header names as typed).
  const headers: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": stamp,
  };
  if (input.contentType) headers["content-type"] = input.contentType;
  if (input.cacheControl) headers["cache-control"] = input.cacheControl;
  for (const [k, v] of Object.entries(input.extraHeaders ?? {})) {
    headers[k.toLowerCase()] = v;
  }

  const { authorization } = signV4({
    method: input.method,
    path,
    headers,
    payloadHash,
    amzDate: stamp,
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
  });

  const outHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (k === "host") continue; // fetch sets it from the URL
    outHeaders[k] = v;
  }
  outHeaders.Authorization = authorization;

  return { url: url.toString(), headers: outHeaders, body: payload };
}

async function assertOk(res: Response, what: string): Promise<void> {
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw new Error(`R2 ${what} failed: ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 300)}` : ""}`);
}

export async function r2Put(
  cfg: R2Config,
  key: string,
  body: Buffer,
  opts?: { contentType?: string; cacheControl?: string }
): Promise<void> {
  const req = signedRequest(cfg, {
    method: "PUT",
    key,
    body,
    contentType: opts?.contentType ?? "application/octet-stream",
    cacheControl: opts?.cacheControl ?? "public, max-age=31536000, immutable",
  });
  const res = await fetch(req.url, {
    method: "PUT",
    headers: req.headers,
    body: new Uint8Array(body),
  });
  await assertOk(res, `PUT ${key}`);
}

export async function r2Delete(cfg: R2Config, key: string): Promise<void> {
  const req = signedRequest(cfg, { method: "DELETE", key });
  const res = await fetch(req.url, { method: "DELETE", headers: req.headers });
  // S3 DELETE is idempotent; a missing key still returns 204.
  await assertOk(res, `DELETE ${key}`);
}

export async function r2Head(cfg: R2Config, key = ""): Promise<{ ok: true; size?: number } | { ok: false; status: number }> {
  const req = signedRequest(cfg, { method: "HEAD", key });
  const res = await fetch(req.url, { method: "HEAD", headers: req.headers });
  if (!res.ok) return { ok: false, status: res.status };
  const len = res.headers.get("content-length");
  return { ok: true, size: len ? Number(len) : undefined };
}
