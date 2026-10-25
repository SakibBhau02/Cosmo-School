CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"who" text,
	"action" text NOT NULL,
	"table_name" text NOT NULL,
	"row_id" text,
	"before" jsonb,
	"after" jsonb,
	"at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"title_bn" text NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"kind" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"icon" text,
	"data_bn" jsonb,
	"data_en" jsonb
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_path" text NOT NULL,
	"url" text NOT NULL,
	"width" integer,
	"height" integer,
	"size" integer,
	"alt_bn" text DEFAULT '' NOT NULL,
	"alt_en" text DEFAULT '' NOT NULL,
	"uploaded_by" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"slug" text PRIMARY KEY NOT NULL,
	"date" text DEFAULT '' NOT NULL,
	"tag" text DEFAULT 'নোটিশ' NOT NULL,
	"title_bn" text NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"body_bn" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"published_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"updated_by" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_slug" text NOT NULL,
	"key" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"content_bn" jsonb,
	"content_en" jsonb
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"role_bn" text DEFAULT '' NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"exp" text DEFAULT '' NOT NULL,
	"photo_id" integer,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"meta" text DEFAULT '' NOT NULL,
	"text" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'editor' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_page_slug_pages_slug_fk" FOREIGN KEY ("page_slug") REFERENCES "public"."pages"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;