import type { FieldSchema, PageSchema } from "./types";
import { globalDefaults } from "./defaults/global";
import { homeDefaults } from "./defaults/home";
import { aboutDefaults } from "./defaults/about";
import { academicsDefaults } from "./defaults/academics";
import { admissionDefaults } from "./defaults/admission";
import { clubsDefaults } from "./defaults/clubs";
import { contactDefaults } from "./defaults/contact";
import { galleryDefaults } from "./defaults/gallery";
import { leadershipDefaults } from "./defaults/leadership";
import { missionDefaults } from "./defaults/mission";
import { resultsDefaults } from "./defaults/results";
import { teachersDefaults } from "./defaults/teachers";
import { daylongDefaults } from "./defaults/daylong";

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
const locList = (label: string, itemLabel: string): FieldSchema => ({
  type: "localizedList",
  label,
  itemLabel,
});
const url = (label: string): FieldSchema => ({ type: "url", label });
const img = (label: string): FieldSchema => ({ type: "image", label });
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
        id: "levels",
        title: "Levels & age badges",
        description:
          "The four cards under “Our Levels”. The age badge is the small pill on each photo — change an age here and it updates on the home page.",
        fields: {
          eyebrow: loc("Eyebrow (small label)"),
          title: loc("Section heading"),
          items: {
            type: "list",
            label: "Levels",
            itemLabel: "Level",
            fields: {
              titleEn: text("Title (English)"),
              titleBn: text("Title (Bengali)"),
              ageEn: text("Age badge (English)", { placeholder: "Prep-I: 3+ years" }),
              ageBn: text("Age badge (Bengali)", { placeholder: "প্রেপ-১: ৩+ বছর" }),
              descEn: area("Description (English)"),
              descBn: area("Description (Bengali)"),
              image: img("Image"),
              href: text("Link", { placeholder: "/academics" }),
            },
          },
        },
      },
      {
        id: "daylong",
        title: "Day Long School preview",
        description:
          "A preview of the Day Long School page. The name, tagline, age, timing, photo and the three highlights are read live from that page — edit them under Pages → Day-Long School. Leave the title and intro blank to use the Day Long page wording.",
        fields: {
          enabled: bool("Show this section on the home page"),
          eyebrow: loc("Eyebrow (small label)"),
          title: loc("Heading override (optional)"),
          intro: locArea("Intro override (optional)"),
          photo: img("Photo override (optional)"),
          ctaLabel: loc("Main button label"),
          ctaHref: text("Main button link", { placeholder: "/day-long-school" }),
          visitLabel: loc("Visit button label"),
          visitHref: text("Visit button link", { placeholder: "/day-long-school#visit" }),
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
    key: "about",
    label: "About",
    path: "/about",
    group: "pages",
    description: "The About Us page — hero, section navigation, facilities, story, beliefs and working structure.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Page title"),
          intro: locArea("Intro paragraph"),
          image: img("Background image"),
        },
      },
      {
        id: "nav",
        title: "Section navigation",
        description: "The jump links under the hero. The anchor id must match the section it points to.",
        fields: {
          items: {
            type: "list",
            label: "Links",
            itemLabel: "Link",
            fields: {
              id: text("Anchor id", { help: "who, journey, facilities, story, belief or structure" }),
              label: loc("Label"),
            },
          },
        },
      },
      {
        id: "who",
        title: "Who we are",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          body: locArea("Paragraph"),
        },
      },
      {
        id: "journey",
        title: "Journey",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          body: locArea("Paragraph"),
          cards: {
            type: "list",
            label: "Milestone cards",
            itemLabel: "Card",
            fields: { icon: text("Emoji icon"), label: loc("Label") },
          },
        },
      },
      {
        id: "facilities",
        title: "Facilities",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          items: {
            type: "list",
            label: "Facility cards",
            itemLabel: "Facility",
            fields: { icon: text("Emoji icon"), title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "story",
        title: "Story",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          paragraphs: locList("Paragraphs", "Paragraph"),
        },
      },
      {
        id: "belief",
        title: "Belief",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          intro: locArea("Intro paragraph"),
          items: locList("Belief cards", "Belief"),
          closing: locArea("Closing statement"),
        },
      },
      {
        id: "structure",
        title: "Working structure",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          intro: locArea("Intro paragraph"),
          groups: {
            type: "list",
            label: "Structure groups",
            itemLabel: "Group",
            fields: {
              icon: text("Emoji icon"),
              title: loc("Title"),
              items: locList("Bullet points", "Point"),
            },
          },
          approachTitle: loc("Approach heading"),
          approachParagraphs: locList("Approach paragraphs", "Paragraph"),
        },
      },
      {
        id: "cta",
        title: "Buttons",
        fields: {
          primaryLabel: loc("Primary button label"),
          primaryHref: text("Primary button link"),
          secondaryLabel: loc("Secondary button label"),
          secondaryHref: text("Secondary button link"),
        },
      },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    path: "/academics",
    group: "pages",
    description: "Hero, the four learning stages, weekly routine, commitment list and the academic goal.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title"), intro: locArea("Intro paragraph") },
      },
      {
        id: "journey",
        title: "Academic journey",
        description: "One card per learning stage. Leave the highlight box empty to hide it.",
        fields: {
          title: loc("Heading"),
          items: {
            type: "list",
            label: "Stages",
            itemLabel: "Stage",
            fields: {
              image: img("Stage image"),
              age: text("Age / class range"),
              title: loc("Title"),
              desc: locArea("Description"),
              extra: locArea("Highlight box (optional)"),
            },
          },
        },
      },
      {
        id: "routine",
        title: "Weekly routine",
        fields: {
          title: loc("Heading"),
          dayLabel: loc("“Day” column label"),
          timeLabel: loc("“Time” column label"),
          noteLabel: loc("“Notes” column label"),
          items: {
            type: "list",
            label: "Routine rows",
            itemLabel: "Row",
            fields: { day: loc("Day"), time: loc("Time"), note: loc("Notes") },
          },
        },
      },
      {
        id: "commitment",
        title: "Our commitment",
        fields: { title: loc("Heading"), items: locList("Commitment points", "Point") },
      },
      {
        id: "goal",
        title: "Academic goal",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          intro: locArea("Intro paragraph"),
          steps: locList("Goal steps", "Step"),
          closing: locArea("Closing paragraph"),
        },
      },
    ],
  },
  {
    key: "admission",
    label: "Admission",
    path: "/admission",
    group: "pages",
    description: "Hero, the eight admission steps, required documents, age criteria and guardian FAQs.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Page title"),
          intro: locArea("Intro paragraph"),
          applyLabel: loc("Apply button label"),
        },
      },
      {
        id: "process",
        title: "Process heading",
        fields: { title: loc("Heading"), intro: locArea("Intro paragraph") },
      },
      {
        id: "steps",
        title: "Admission steps",
        fields: {
          items: {
            type: "list",
            label: "Steps",
            itemLabel: "Step",
            fields: { title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "documents",
        title: "Required documents",
        fields: { title: loc("Heading"), items: locList("Documents", "Document") },
      },
      {
        id: "age",
        title: "Age criteria",
        fields: {
          title: loc("Heading"),
          items: {
            type: "list",
            label: "Age rows",
            itemLabel: "Class",
            fields: { class: loc("Class"), age: loc("Age") },
          },
          note: locArea("Note under the table"),
        },
      },
      {
        id: "fees",
        title: "Fee structure",
        description: "Shown under the documents and age cards. Amounts are free text — “৳8,000 – 12,000” is fine.",
        fields: {
          title: loc("Heading"),
          admissionHead: loc("One-time costs heading"),
          admissionItems: {
            type: "list",
            label: "One-time costs",
            itemLabel: "Cost",
            fields: { item: loc("Item"), amount: loc("Amount") },
          },
          monthlyHead: loc("Monthly heading"),
          monthlyItems: {
            type: "list",
            label: "Monthly tuition",
            itemLabel: "Level",
            fields: { level: loc("Level"), amount: loc("Amount") },
          },
          note: locArea("Note"),
        },
      },
      {
        id: "faq",
        title: "Guardian FAQs",
        fields: {
          title: loc("Heading"),
          items: {
            type: "list",
            label: "Questions",
            itemLabel: "Question",
            fields: { question: loc("Question"), answer: locArea("Answer") },
          },
        },
      },
      {
        id: "form",
        title: "Inquiry form block",
        fields: {
          title: loc("Heading"),
          intro: locArea("Intro paragraph"),
          helplineLabel: loc("Helpline label"),
          hours: loc("Office hours"),
          daylongLabel: loc("Day-Long School link label"),
        },
      },
    ],
  },
  {
    key: "clubs",
    label: "Clubs",
    path: "/clubs",
    group: "pages",
    description: "Hero copy, the six club cards and the two buttons inside each card.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title"), intro: locArea("Intro paragraph") },
      },
      {
        id: "clubs",
        title: "Clubs",
        description: "Keep the slug stable — it is used as the section anchor on the page.",
        fields: {
          items: {
            type: "list",
            label: "Club cards",
            itemLabel: "Club",
            fields: {
              slug: text("Slug"),
              icon: text("Emoji icon"),
              name: loc("Name"),
              desc: locArea("Description"),
            },
          },
        },
      },
      {
        id: "cta",
        title: "Card buttons & labels",
        fields: {
          joinLabel: loc("Join button label"),
          joinHref: text("Join button link"),
          moreLabel: loc("Secondary button label"),
          moreHref: text("Secondary button link"),
          clubLabel: loc("“Club N” label"),
        },
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    group: "pages",
    description:
      "Contact page headings and map. Phone, e-mail, address and social links come from Site settings.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title") },
      },
      {
        id: "campus",
        title: "Campus card",
        fields: { title: loc("Campus title"), hoursLabel: loc("Hours label") },
      },
      {
        id: "office",
        title: "Office card",
        fields: {
          title: loc("Heading"),
          helplineLabel: loc("Helpline label"),
        },
      },
      {
        id: "map",
        title: "Map",
        fields: { title: loc("Map title (screen readers)"), embedUrl: url("Google Maps embed URL") },
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery page text",
    path: "/gallery",
    group: "pages",
    description:
      "Headings and footnote for the /gallery page. Albums and photos are managed in Gallery (sidebar → Content → Gallery), not here.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Page title"),
          intro: locArea("Intro paragraph"),
        },
      },
      { id: "note", title: "Footnote", fields: { text: locArea("Footnote") } },
    ],
  },
  {
    key: "leadership",
    label: "Leadership",
    path: "/leadership",
    group: "pages",
    description: "Chairman, management and principal messages, plus the faculty section headings.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title"), intro: locArea("Intro paragraph") },
      },
      {
        id: "leaders",
        title: "Leader messages",
        description: "Photos live in public/leaders — use the Library button to pick a team photo instead.",
        fields: {
          items: {
            type: "list",
            label: "Leaders",
            itemLabel: "Leader",
            fields: {
              id: text("Anchor id", { help: "chairman, president or principal" }),
              photo: img("Photo"),
              name: loc("Name"),
              title: loc("Role / title"),
              eyebrow: loc("Eyebrow"),
              body: locList("Paragraphs", "Paragraph"),
            },
          },
        },
      },
      {
        id: "faculty",
        title: "Faculty section",
        description: "Teacher cards themselves are edited on the Teachers page.",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          ctaLabel: loc("Button label"),
          ctaHref: text("Button link"),
        },
      },
    ],
  },
  {
    key: "mission",
    label: "Mission & Vision",
    path: "/mission-vision",
    group: "pages",
    description: "Hero, the principal's message, mission points and the admission button.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title"), tagline: loc("Tagline") },
      },
      {
        id: "principal",
        title: "Principal's message",
        fields: { heading: loc("Heading"), body: locArea("Message"), byline: loc("Byline") },
      },
      { id: "mission", title: "Mission points", fields: { items: locList("Points", "Point") } },
      {
        id: "cta",
        title: "Button",
        fields: { label: loc("Button label"), href: text("Button link") },
      },
    ],
  },
  {
    key: "results",
    label: "Results",
    path: "/results",
    group: "pages",
    description: "Headline numbers and the exam result table. “—” works as a placeholder value.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title") },
      },
      {
        id: "labels",
        title: "Labels",
        fields: {
          total: loc("Total candidates label"),
          aPlus: loc("GPA-5 label"),
          golden: loc("Golden A+ label"),
          passRate: loc("Pass rate label"),
          exam: loc("“Exam” column"),
          totalColumn: loc("“Total” column"),
          passedColumn: loc("“Passed” column"),
          aPlusColumn: loc("“A+” column"),
          rateColumn: loc("“Rate/Status” column"),
        },
      },
      {
        id: "summary",
        title: "Headline numbers",
        description: "Used by the four stat cards at the top of the page.",
        fields: {
          total: { type: "number", label: "Candidates", min: 0 },
          passed: { type: "number", label: "Passed", min: 0 },
          aPlus: { type: "number", label: "GPA-5", min: 0 },
          golden: { type: "number", label: "Golden A+", min: 0 },
          gradeA: { type: "number", label: "Grade A", min: 0 },
          successRate: { type: "number", label: "Pass rate (%)", min: 0, max: 100 },
        },
      },
      {
        id: "rows",
        title: "Result table",
        fields: {
          items: {
            type: "list",
            label: "Rows",
            itemLabel: "Row",
            fields: {
              exam: loc("Exam"),
              total: text("Total"),
              passed: text("Passed"),
              aPlus: text("A+"),
              rate: loc("Rate / status"),
            },
          },
        },
      },
    ],
  },
  {
    key: "teachers",
    label: "Teachers",
    path: "/teachers",
    group: "pages",
    description: "Faculty list used on both the Teachers page and the Leadership page.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: { eyebrow: loc("Eyebrow"), title: loc("Page title"), intro: locArea("Intro paragraph") },
      },
      {
        id: "teachers",
        title: "Teachers",
        fields: {
          items: {
            type: "list",
            label: "Teacher cards",
            itemLabel: "Teacher",
            fields: {
              photo: img("Photo (optional)"),
              name: loc("Name"),
              role: loc("Role"),
              subject: loc("Subject"),
              experience: loc("Experience"),
            },
          },
        },
      },
      { id: "note", title: "Footnote", fields: { text: locArea("Footnote") } },
    ],
  },
  {
    key: "daylong",
    label: "Day-Long School",
    path: "/day-long-school",
    group: "pages",
    description:
      "The whole Day-Long School page — hero, worries, routine, photos, staff, why-Cosmo list, features and the visit form.",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: {
          badgeAge: loc("Badge — age"),
          name: loc("Programme name"),
          tagline: loc("Tagline"),
          time: loc("Opening hours"),
          seats: loc("Seats badge"),
          visitLabel: loc("Visit button label"),
        },
      },
      {
        id: "pains",
        title: "Parent worries",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          items: {
            type: "list",
            label: "Worry cards",
            itemLabel: "Card",
            fields: { icon: text("Emoji icon"), title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "routine",
        title: "A day at Cosmo",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          intro: locArea("Intro paragraph"),
          items: {
            type: "list",
            label: "Routine rows",
            itemLabel: "Time slot",
            fields: { time: loc("Time"), title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "special",
        title: "Special features",
        fields: {
          items: {
            type: "list",
            label: "Cards",
            itemLabel: "Card",
            fields: { kicker: loc("Kicker"), title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "photos",
        title: "Photo strip",
        fields: {
          title: loc("Heading"),
          note: locArea("Note"),
          items: {
            type: "list",
            label: "Photos",
            itemLabel: "Photo",
            fields: { image: img("Image"), caption: loc("Caption") },
          },
        },
      },
      {
        id: "staff",
        title: "Staff spotlight",
        fields: {
          initial: loc("Initial / monogram"),
          name: loc("Name"),
          role: loc("Role line"),
          eyebrow: loc("Eyebrow"),
          quote: locArea("Quote"),
          chips: locList("Credential chips", "Chip"),
        },
      },
      {
        id: "quote",
        title: "Guardian quote",
        fields: { text: locArea("Quote"), by: loc("Attribution") },
      },
      {
        id: "why",
        title: "Why working parents choose Cosmo",
        description: "The first six entries show by default; the rest expand behind “See more”.",
        fields: {
          eyebrow: loc("Eyebrow"),
          title: loc("Heading"),
          brand: loc("Brand line"),
          tagline: loc("Sub-heading"),
          intro: locArea("Intro paragraph"),
          items: {
            type: "list",
            label: "Reasons",
            itemLabel: "Reason",
            fields: { title: loc("Title"), desc: locArea("Description") },
          },
        },
      },
      {
        id: "promise",
        title: "The Cosmo Promise",
        fields: { kicker: loc("Kicker"), quote: locArea("Quote"), desc: locArea("Description") },
      },
      {
        id: "features",
        title: "Features",
        description: "The first three show by default; the rest expand behind “See more”.",
        fields: {
          title: loc("Heading"),
          tagline: loc("Sub-heading"),
          items: {
            type: "list",
            label: "Feature cards",
            itemLabel: "Feature",
            fields: { icon: text("Emoji icon"), title: loc("Title"), desc: locArea("Description") },
          },
          closingBrand: loc("Closing brand line"),
          closingText: locArea("Closing sentence"),
        },
      },
      {
        id: "visit",
        title: "Campus visit",
        fields: {
          title: loc("Heading"),
          bullets: locList("Bullet points", "Point"),
          callLabel: loc("Call label"),
        },
      },
      {
        id: "visitForm",
        title: "Visit request form",
        fields: {
          title: loc("Form heading"),
          nameLabel: loc("Name field label"),
          phoneLabel: loc("Phone field label"),
          ageLabel: loc("Child age field label"),
          dayLabel: loc("Preferred day label"),
          submitLabel: loc("Submit button label"),
          note: loc("Note under the button"),
          doneTitle: loc("Success title"),
          doneDesc: locArea("Success message"),
        },
      },
      {
        id: "subnav",
        title: "Sticky sub-navigation",
        fields: { routine: loc("Routine link"), faq: loc("FAQ link"), visit: loc("Visit link") },
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
  about: aboutDefaults,
  academics: academicsDefaults,
  admission: admissionDefaults,
  clubs: clubsDefaults,
  contact: contactDefaults,
  gallery: galleryDefaults,
  leadership: leadershipDefaults,
  mission: missionDefaults,
  results: resultsDefaults,
  teachers: teachersDefaults,
  daylong: daylongDefaults,
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
