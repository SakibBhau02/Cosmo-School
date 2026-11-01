import { l } from "../merge";

/**
 * Contact page document. Phone, e-mail and address stay in Site settings
 * (the `global` document) so they update everywhere in one place.
 */
export const contactDefaults = {
  hero: {
    eyebrow: l("Contact", "যোগাযোগ"),
    title: l("Contact", "যোগাযোগ"),
  },
  campus: {
    title: l("Banasree Campus", "বনশ্রী ক্যাম্পাস"),
    hoursLabel: l("Office hours", "অফিস সময়"),
  },
  office: {
    title: l("Office hours & helpline", "অফিস সময় ও হেল্পলাইন"),
    helplineLabel: l("Admission helpline", "ভর্তি হেল্পলাইন"),
  },
  map: {
    title: l("Banasree map", "বনশ্রী ম্যাপ"),
    embedUrl: "https://www.google.com/maps?q=Banasree+Main+Road+Rampura+Dhaka&output=embed",
  },
};

export type ContactDoc = typeof contactDefaults;
