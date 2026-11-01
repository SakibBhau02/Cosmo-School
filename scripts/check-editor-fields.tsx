import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Field from "../src/app/admin/_components/Field";
import { CONTENT_PAGES, CONTENT_DEFAULTS } from "../src/content/registry";
import type { FieldSchema } from "../src/content/types";

type Doc = Record<string, unknown>;
let rendered = 0;
const errors: string[] = [];

function walk(path: string, field: FieldSchema, value: unknown) {
  try {
    renderToStaticMarkup(
      React.createElement(Field, { field, value, onChange: () => {}, disabled: false }),
    );
    rendered += 1;
  } catch (error) {
    errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const page of CONTENT_PAGES) {
  const doc = CONTENT_DEFAULTS[page.key] as Doc;
  for (const section of page.sections) {
    const sectionValue = doc[section.id] as Doc;
    for (const [key, field] of Object.entries(section.fields)) {
      walk(`${page.key}.${section.id}.${key}`, field, sectionValue[key]);
    }
  }
}

if (errors.length) {
  console.log(`FOUND ${errors.length} render error(s):`);
  for (const error of errors) console.log(" - " + error);
  process.exit(1);
}
console.log(`OK — rendered ${rendered} editor fields without errors.`);
