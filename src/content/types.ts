/**
 * Content model shared by the CMS, the API and the public pages.
 *
 * Every editable string is stored as a `Localized` pair so the English copy
 * is always the primary value and the Bengali copy is kept as a backup for
 * the language toggle. English is the site default.
 */

export type Localized = {
  en: string;
  bn: string;
};

export type FieldType =
  | "text"
  | "textarea"
  | "localized"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "imageList"
  | "url"
  | "color"
  | "strings"
  | "localizedList"
  | "list"
  | "object"
  | "json";

export type SelectOption = { value: string; label: string };

export type FieldSchema = {
  type: FieldType;
  label: string;
  help?: string;
  placeholder?: string;
  rows?: number;
  min?: number;
  max?: number;
  options?: SelectOption[];
  /** `list` only: one schema per row. */
  fields?: Record<string, FieldSchema>;
  /** `list` only: label of the add button / row heading. */
  itemLabel?: string;
  /** `json` only: pretty-printed rows allowed. */
  readOnly?: boolean;
};

export type SectionSchema = {
  id: string;
  title: string;
  description?: string;
  fields: Record<string, FieldSchema>;
};

export type PageGroup = "site" | "pages" | "system";

export type PageSchema = {
  /** Stable content document key, e.g. "home". */
  key: string;
  /** Sidebar label. */
  label: string;
  /** Public URL this document renders, for quick "view page" links. */
  path: string;
  group: PageGroup;
  description: string;
  sections: SectionSchema[];
};

export type ContentStatus = "published" | "draft" | "default";

export type ContentSummary = {
  key: string;
  label: string;
  path: string;
  group: PageGroup;
  status: ContentStatus;
  hasDraft: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

export type ContentRecord = {
  key: string;
  draft: Record<string, unknown>;
  published: Record<string, unknown>;
  hasDraft: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};
