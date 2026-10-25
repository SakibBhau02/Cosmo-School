// Offline correctness check for the hand-rolled SigV4 signer used to talk to
// Cloudflare R2. Uses AWS's published test vector ("Example: GET Object") so a
// signature regression fails here instead of silently breaking uploads in prod.
//
//   npm run check:sigv4
//
// Requires Node 22.18+ (TypeScript type stripping, unflagged).
import { signV4 } from "../src/lib/r2.ts";

const EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const EXPECTED = "f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41";

const result = signV4({
  method: "GET",
  path: "/test.txt",
  headers: {
    host: "examplebucket.s3.amazonaws.com",
    range: "bytes=0-9",
    "x-amz-content-sha256": EMPTY_SHA256,
    "x-amz-date": "20130524T000000Z",
  },
  payloadHash: EMPTY_SHA256,
  amzDate: "20130524T000000Z",
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
  service: "s3",
});

const ok = result.signature === EXPECTED;
console.log(`AWS test vector  expected ${EXPECTED}`);
console.log(`                 actual   ${result.signature}`);
console.log(ok ? "\nPASS — SigV4 signer matches AWS" : "\nFAIL — signature mismatch");

if (!ok) {
  console.log("\nstringToSign:\n" + result.stringToSign);
  process.exit(1);
}
