import AdmissionContent from "./content";
import { getGlobalContent, getPublishedDoc } from "@/content/store";
import type { AdmissionDoc } from "@/content/defaults/admission";

export const metadata = { title: "ভর্তি — Cosmo School Banasree" };

export default async function AdmissionPage() {
  const [doc, global] = await Promise.all([
    getPublishedDoc<AdmissionDoc>("admission"),
    getGlobalContent(),
  ]);

  return <AdmissionContent doc={doc} contact={global.contact} />;
}
