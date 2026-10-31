import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// ── CMS master tables (Phase 1). Bilingual docs live in *Bn/*En JSONB columns;
// per-page editors (Phase 3) read/write these. WP + JSON files stay read-only
// fallback until the Phase-4 cutover.

export const pages = pgTable("pages", {
  slug: text("slug").primaryKey(), // home, about, academics, ...
  title: text("title").notNull(),
  status: text("status").notNull().default("published"), // draft | published
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug")
    .notNull()
    .references(() => pages.slug, { onDelete: "cascade" }),
  key: text("key").notNull(), // hero, fees, faq, ...
  sort: integer("sort").notNull().default(0),
  contentBn: jsonb("content_bn"),
  contentEn: jsonb("content_en"),
});

export const listItems = pgTable("list_items", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull().default(0),
  icon: text("icon"),
  dataBn: jsonb("data_bn"),
  dataEn: jsonb("data_en"),
});

export const notices = pgTable("notices", {
  slug: text("slug").primaryKey(),
  date: text("date").notNull().default(""),
  tag: text("tag").notNull().default("নোটিশ"),
  tagEn: text("tag_en").notNull().default(""),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull().default(""),
  bodyBn: text("body_bn").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  status: text("status").notNull().default("published"), // draft | published
  publishedAt: timestamp("published_at").defaultNow(),
});

export const teachers = pgTable("teachers", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull().default(""),
  roleBn: text("role_bn").notNull().default(""),
  subject: text("subject").notNull().default(""),
  exp: text("exp").notNull().default(""),
  photoId: integer("photo_id").references(() => media.id),
  sort: integer("sort").notNull().default(0),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().default(""),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull().default(""),
  kind: text("kind").notNull().default(""),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  meta: text("meta").notNull().default(""),
  text: text("text").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filePath: text("file_path").notNull(), // /uploads/xxx.webp or remote URL (seeded)
  url: text("url").notNull(),
  width: integer("width"),
  height: integer("height"),
  size: integer("size"),
  altBn: text("alt_bn").notNull().default(""),
  altEn: text("alt_en").notNull().default(""),
  uploadedBy: text("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
  status: text("status").notNull().default("new"), // new | contacted | done
  notes: text("notes").notNull().default(""),
  handledBy: text("handled_by").notNull().default(""),
  at: timestamp("at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  role: text("role").notNull().default("editor"), // superadmin | editor | viewer
  lastLoginAt: timestamp("last_login_at"),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  who: text("who"),
  action: text("action").notNull(), // create | update | delete | upload
  tableName: text("table_name").notNull(),
  rowId: text("row_id"),
  before: jsonb("before"),
  after: jsonb("after"),
  at: timestamp("at").defaultNow(),
});

// Editable site documents (hero, fees, daylong, testimonials, ...), one JSONB
// doc per SiteContent key. In production /admin writes here instead of the repo
// filesystem, which is read-only on Vercel. Phase 4 folds these into
// pages/sections; until then this is the writable master copy.
export const siteDocs = pgTable("site_docs", {
  key: text("key").primaryKey(),
  doc: jsonb("doc").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Page content CMS (admin panel). One row per editable document (home,
// global, about, ...). `draft` is what the editor saves, `published` is what
// the public site reads, so a half-finished edit never reaches visitors.
export const contentDocs = pgTable("content_docs", {
  key: text("key").primaryKey(),
  draft: jsonb("draft").notNull(),
  published: jsonb("published"),
  updatedBy: text("updated_by").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  publishedBy: text("published_by").notNull().default(""),
});

// Every publish keeps a snapshot so an editor can be rolled back.
export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  version: integer("version").notNull(),
  doc: jsonb("doc").notNull(),
  savedBy: text("saved_by").notNull().default(""),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

// Server-side admin sessions. The cookie carries a random token; only its
// SHA-256 hash is stored, so a database leak cannot be replayed as a login.
export const sessions = pgTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent").notNull().default(""),
});
