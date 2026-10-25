import AdmissionContent from "./content";
import { faqs as seedFaqs } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "ভর্তি — Cosmo School Banasree" };

export default async function AdmissionPage() {
  const site = await getSiteContent().catch(() => null);
  const faqs = site?.faqs?.length ? site.faqs : seedFaqs;

  return <AdmissionContent faqs={faqs} />;
}
