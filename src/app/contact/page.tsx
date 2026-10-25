import ContactContent from "./content";
import { branch } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "যোগাযোগ — Cosmo School Banasree" };

export default async function ContactPage() {
  const site = await getSiteContent().catch(() => null);
  const c = site?.contact?.phone ? site.contact : null;
  const address = c?.address || branch.address;
  const phone = c?.phone || branch.phone;
  const ipPhone = c?.ipPhone || branch.ipPhone;
  const email = c?.email || branch.email;
  const hoursBn = c?.hoursBn || "অফিস: সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)";
  return <ContactContent address={address} phone={phone} ipPhone={ipPhone} email={email} hoursBn={hoursBn} />;
}
