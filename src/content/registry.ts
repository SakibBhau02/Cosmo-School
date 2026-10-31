import type { FieldSchema, PageSchema } from "./types";
import { globalDefaults } from "./defaults/global";
import { homeDefaults } from "./defaults/home";

const text = (label: string, extra: Partial<FieldSchema> = {}): FieldSchema => ({
  type: "text",
  label,
  ...extra,
});
const area = (label: string, extra: Partial<FieldSchema> = {}): FieldSchema => ({
  type: "textarea",
  label,
  rows: 3,
  ...extra,
});
const loc = (label: string): FieldSchema => ({ type: "localized", label });
const locArea = (label: string): FieldSchema => ({ type: "localized", label, rows: 4 });
const url = (label: string): FieldSchema => ({ type: "url", label });
const bool = (label: string, help?: string): FieldSchema => ({ type: "boolean", label, help });

export const CONTENT_PAGES: PageSchema[] = [
  {
    key: "home",
    label: "Home",
    path: "/",
    group: "pages",
    description: "Hero copy and the admission-offer block at the bottom of the home page.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        description: "The first screen visitors see. Keep the headline short — 3 to 7 words works best.",
        fields: {
          badge: loc("Badge"),
          tagline: loc("Headline"),
          subtitle: locArea("Sub-headline"),
          primaryCtaLabel: loc("Primary button label"),
          primaryCtaHref: text("Primary button link", { placeholder: "/admission" }),
          secondaryCtaLabel: loc("Secondary button label"),
          secondaryCtaHref: text("Secondary button link", { placeholder: "/academics" }),
          videoId: text("YouTube video ID", {
            help: "Only used when the hero mode is set to video.",
          }),
          mode: {
            type: "select",
            label: "Hero mode",
            options: [
              { value: "slider", label: "Image slider" },
              { value: "video", label: "Video background" },
            ],
          },
        },
      },
      {
        id: "offer",
        title: "Admission offer",
        description:
          "The gold offer block above the inquiry form. Turn it off to hide the block without deleting the copy.",
        fields: {
          active: bool("Show this offer block"),
          eyebrow: loc("Eyebrow (small label)"),
          title: locArea("Offer headline"),
          deadline: text("Deadline", {
            placeholder: "15 November 2026",
            help: "Shown as a separate line under the headline. Leave blank to hide.",
          }),
          bullets: { type: "localizedList", label: "Bullet points", itemLabel: "Bullet" },
          helplineLabel: loc("Helpline label"),
          formTitle: loc("Inquiry form title"),
          note: locArea("Fine print"),
        },
      },
      {
        id: "sections",
        title: "Section headings",
        description: "Headings for the home-page sections.",
        fields: {
          galleryTitle: loc("Gallery heading"),
          voicesTitle: loc("Testimonials heading"),
        },
      },
      {
        id: "heroSlides",
        title: "Hero slides",
        description:
          "Images that rotate behind the headline. Each slide can carry its own two buttons.",
        fields: {
          slides: {
            type: "list",
            label: "Slides",
            itemLabel: "Slide",
            fields: {
              src: { type: "image", label: "Image URL" },
              captionEn: text("Caption (English)"),
              captionBn: text("Caption (Bengali)"),
              cta: {
                type: "list",
                label: "Buttons",
                itemLabel: "Button",
                max: 3,
                fields: {
                  labelEn: text("Label (English)"),
                  labelBn: text("Label (Bengali)"),
                  href: text("Link"),
                  variant: {
                    type: "select",
                    label: "Style",
                    options: [
                      { value: "gold", label: "Gold (primary)" },
                      { value: "outline", label: "Outline (secondary)" },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        id: "stats",
        title: "Stat counters",
        description: "The four counters under the hero.",
        fields: {
          items: {
            type: "list",
            label: "Counters",
            itemLabel: "Counter",
            fields: {
              value: { type: "number", label: "Number", min: 0 },
              suffix: text("Suffix", { placeholder: "+" }),
              labelEn: text("Label (English)"),
              labelBn: text("Label (Bengali)"),
            },
          },
        },
      },
      {
        id: "events",
        title: "Upcoming events",
        fields: {
          items: {
            type: "list",
            label: "Events",
            itemLabel: "Event",
            fields: {
              date: text("Date label"),
              titleEn: text("Title (English)"),
              titleBn: text("Title (Bengali)"),
              kind: text("Kind", { placeholder: "Cultural / Exam / Holiday" }),
            },
          },
        },
      },
      {
        id: "testimonials",
        title: "Guardian testimonials",
        description: "Shown in the scrolling marquee near the bottom of the home page.",
        fields: {
          items: {
            type: "list",
            label: "Testimonials",
            itemLabel: "Testimonial",
            fields: {
              name: text("Name"),
              metaEn: text("Relationship (English)"),
              metaBn: text("Relationship (Bengali)"),
              textEn: { type: "textarea", label: "Quote (English)", rows: 3 },
              textBn: { type: "textarea", label: "Quote (Bengali)", rows: 3 },
            },
          },
        },
      },
    ],
  },
  {
    key: "global",
    label: "Site settings",
    path: "/",
    group: "site",
    description:
      "School identity, contact details, social links and every admission banner used across the site.",
    sections: [
      {
        id: "identity",
        title: "Identity",
        fields: {
          name: text("School name"),
          branch: text("Campus / branch name"),
          motto: loc("Motto"),
          curriculum: loc("Curriculum line"),
          since: { type: "number", label: "Established (year)", min: 1900, max: 2100 },
        },
      },
      {
        id: "contact",
        title: "Contact",
        description: "Used in the header strip, footer, contact page and every call button.",
        fields: {
          phone: text("Phone"),
          ipPhone: text("IP phone"),
          email: text("Email"),
          address: area("Address"),
          hours: loc("Office hours"),
        },
      },
      {
        id: "links",
        title: "Links",
        fields: {
          facebook: url("Facebook page"),
          youtube: url("YouTube channel"),
          whatsapp: url("WhatsApp link"),
          mapEmbedUrl: url("Map embed URL"),
        },
      },
      {
        id: "admission",
        title: "Admission banners",
        description:
          "These strings appear in the header, hero badge, footer strip and admission page. Edit once — it updates everywhere.",
        fields: {
          year: { type: "number", label: "Admission year", min: 2000, max: 2100 },
          offerActive: bool("Announce an active admission offer"),
          openLabel: loc("Header badge"),
          applyLabel: loc("Apply button label"),
          badge: loc("Hero badge"),
          stripTitle: loc("Footer strip title"),
          stripBody: loc("Footer strip line"),
          helplineLabel: loc("Helpline label"),
          offerHeadline: locArea("Offer headline"),
          offerDeadline: text("Offer deadline"),
          offerNote: locArea("Offer fine print"),
        },
      },
      {
        id: "seo",
        title: "SEO defaults",
        fields: {
          titleTemplate: text("Page title template", { help: "%s is replaced with the page name." }),
          description: area("Default meta description"),
        },
      },
    ],
  },
];

export const CONTENT_DEFAULTS: Record<string, unknown> = {
  home: homeDefaults,
  global: globalDefaults,
};

export function getPageSchema(key: string): PageSchema | undefined {
  return CONTENT_PAGES.find((p) => p.key === key);
}

export function getPageDefault(key: string): unknown {
  return CONTENT_DEFAULTS[key];
}

export function isContentKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(CONTENT_DEFAULTS, key);
}
