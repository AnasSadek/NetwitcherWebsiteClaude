export const site = {
  name: "Netwitcher",
  legalName: "Netwitcher UG (haftungsbeschränkt)",
  slogan: "Magic in Every Click",
  claim: "Digital Agency & Content-Studio in Berlin",
  // Verifizierte Unternehmensdaten (Impressum/Handelsregister)
  url: "https://netwitcher.com",
  email: "info@netwitcher.com",
  phone: "017673247186",
  phoneHref: "tel:017673247186",
  whatsappNumber: "4917673247186",
  city: "Berlin",
  country: "Deutschland",
  street: "Kochhannstraße 6",
  zip: "10249",
  hrb: "HRB 256419 B",
  registerCourt: "Amtsgericht Charlottenburg",
  representative: "Mhd Anas Sadek",
  vatId: "DE364219286",
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
