import ContactContent from "./content";
import { getGlobalContent, getDocForView } from "@/content/store";
import type { ContactDoc } from "@/content/defaults/contact";

export const metadata = { title: "যোগাযোগ — Cosmo School Banasree" };

export default async function ContactPage() {
  const [doc, global] = await Promise.all([
    getDocForView<ContactDoc>("contact"),
    getGlobalContent(),
  ]);
  return <ContactContent doc={doc} global={global} />;
}
