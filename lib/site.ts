export const site = {
  name: "Netwitcher",
  legalName: "Netwitcher Digital Agency",
  slogan: "Magic in Every Click",
  claim: "Digital Agency & Content-Studio in Berlin",
  // Kontaktdaten aus der offiziellen Netwitcher-Broschüre
  url: "https://netwitcher.com",
  email: "info@netwitcher.com",
  phone: "+49 176 73247186",
  phoneHref: "tel:+4917673247186",
  whatsappNumber: "4917673247186",
  city: "Berlin",
  country: "Deutschland",
  // TODO: echte Straße + PLZ für Impressum/Schema eintragen
  street: "Musterstraße 1",
  zip: "10115",
  calendlyUrl: "https://calendly.com/netwitcher/erstgespraech",
  instagram: "https://www.instagram.com/netwitcher",
  linkedin: "https://www.linkedin.com/company/netwitcher",
  tiktok: "https://www.tiktok.com/@netwitcher",
} as const;

export const whatsappHref = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${
    text ? `?text=${encodeURIComponent(text)}` : ""
  }`;

export const defaultWhatsappText =
  "Hallo Netwitcher! Ich interessiere mich für Content & Marketing und hätte gern ein kostenloses Erstgespräch.";
