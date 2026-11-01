import { CONTENT_PAGES, CONTENT_DEFAULTS } from "../src/content/registry";
import { coerceToShape, mergeDoc } from "../src/content/merge";
import type { FieldSchema } from "../src/content/types";

type Doc = Record<string, unknown>;
const problems: string[] = [];

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isLoc(v: unknown) {
  return isObj(v) && typeof v.en === "string" && typeof v.bn === "string";
}

function checkField(path: string, field: FieldSchema, value: unknown) {
  switch (field.type) {
    case "text":
    case "textarea":
    case "url":
    case "image":
      if (typeof value !== "string") problems.push(`${path}: expected string, got ${JSON.stringify(value)}`);
      break;
    case "number":
      if (typeof value !== "number") problems.push(`${path}: expected number, got ${JSON.stringify(value)}`);
      break;
    case "boolean":
      if (typeof value !== "boolean") problems.push(`${path}: expected boolean, got ${JSON.stringify(value)}`);
      break;
    case "select":
      if (typeof value !== "string") problems.push(`${path}: expected select string, got ${JSON.stringify(value)}`);
      else if (field.options && !field.options.some((o) => o.value === value))
        problems.push(`${path}: select value "${value}" is not an option`);
      break;
    case "localized":
      if (!isLoc(value)) problems.push(`${path}: expected {en,bn}, got ${JSON.stringify(value)}`);
      break;
    case "localizedList":
      if (!Array.isArray(value) || !value.every(isLoc))
        problems.push(`${path}: expected Localized[]`);
      break;
    case "list": {
      if (!Array.isArray(value) || value.length === 0) {
        problems.push(`${path}: list has no default rows`);
        break;
      }
      value.forEach((row, i) => {
        if (!isObj(row)) {
          problems.push(`${path}[${i}]: expected object`);
          return;
        }
        for (const [key, child] of Object.entries(field.fields ?? {})) {
          checkField(`${path}[${i}].${key}`, child, row[key]);
        }
      });
      break;
    }
    case "json":
      break;
    default:
      problems.push(`${path}: unknown field type ${field.type}`);
  }
}

for (const page of CONTENT_PAGES) {
  const doc = CONTENT_DEFAULTS[page.key] as Doc | undefined;
  if (!doc) {
    problems.push(`${page.key}: no default document`);
    continue;
  }

  // The validation boundary must leave a clean document untouched.
  const copy = JSON.parse(JSON.stringify(doc)) as unknown;
  if (JSON.stringify(coerceToShape(doc, copy)) !== JSON.stringify(doc)) {
    problems.push(`${page.key}: coerceToShape changes a valid default document`);
  }
  if (JSON.stringify(mergeDoc(doc, copy)) !== JSON.stringify(doc)) {
    problems.push(`${page.key}: mergeDoc changes a valid default document`);
  }

  for (const section of page.sections) {
    const value = doc[section.id];
    if (!isObj(value)) {
      problems.push(`${page.key}.${section.id}: section missing from defaults`);
      continue;
    }
    for (const [key, field] of Object.entries(section.fields)) {
      if (!(key in value)) problems.push(`${page.key}.${section.id}.${key}: missing from defaults`);
      checkField(`${page.key}.${section.id}.${key}`, field, value[key]);
    }
  }
}

if (problems.length) {
  console.log(`FOUND ${problems.length} problem(s):`);
  for (const p of problems) console.log(" - " + p);
  process.exit(1);
}
console.log(`OK â€” ${CONTENT_PAGES.length} pages, ${CONTENT_PAGES.reduce((n, p) => n + p.sections.length, 0)} sections validated.`);
