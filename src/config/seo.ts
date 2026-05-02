type Locale = "en" | "no";

export type SeoEntry = {
  title: string;
  description: string;
  keywords: string[];
};

type Routes =
  | "/"
  | "/about-us"
  | "/about-us/our-mission"
  | "/about-us/our-vision"
  | "/contact-us"
  | "/donate"
  | "/donation-agreement"
  | "/gallery"
  | "/new-muslims"
  | "/privacy-policy"
  | "/terms"
  | "/who-is-muhammad"
  | "/why-islam";

const COMMON_NO_KEYWORDS = [
  "islam norge",
  "dawah norge",
  "muslim norge",
  "lære om islam",
  "ny muslim",
  "konvertere til islam",
  "bli muslim",
  "gratis koran",
  "moské oslo",
];

const COMMON_EN_KEYWORDS = [
  "Dawah Norway",
  "Islam Norway",
  "Islamic education Norway",
  "convert to Islam",
  "new Muslim Norway",
  "free Quran Norway",
  "Muslim community Norway",
  "Islamic outreach Oslo",
];

export const seo: Record<Locale, Record<Routes, SeoEntry>> = {
  en: {
    "/": {
      title: "Dawah Norway — Learn About Islam in Norway",
      description:
        "An invitation to Islam in Norway. We educate communities, distribute free Qurans, and support new Muslims in Oslo, Trondheim, Stavanger and across Norway since 2021.",
      keywords: [
        ...COMMON_EN_KEYWORDS,
        "what is Islam",
        "becoming Muslim Norway",
        "Shahada Norway",
      ],
    },
    "/why-islam": {
      title: "Why Islam? — A Clear Path to God's Message",
      description:
        "Discover why millions embrace Islam: a direct relationship with the Creator, a clear understanding of God, evidence-based faith, justice, and a balanced way of life.",
      keywords: [
        "why Islam",
        "what is Islam",
        "Islam beliefs",
        "evidence for Islam",
        "Islam Norway",
        "purpose of life Islam",
      ],
    },
    "/who-is-muhammad": {
      title: "Who is Muhammad ﷺ? — The Final Messenger of God",
      description:
        "Muslims regard Muhammad ﷺ as the final prophet in a chain that includes Adam, Noah, Abraham, Moses and Jesus. Learn about his character, mercy and example.",
      keywords: [
        "Muhammad",
        "Prophet Muhammad",
        "who is Muhammad",
        "life of Muhammad",
        "seerah",
        "Islam prophet",
      ],
    },
    "/new-muslims": {
      title: "New Muslim Guide — Resources, Shahada & Support in Norway",
      description:
        "Welcome to Islam. A complete guide for new Muslims in Norway: how to take the Shahada, learn the prayer, find mentors, free Qurans and community support.",
      keywords: [
        "new Muslim",
        "convert to Islam",
        "Shahada",
        "how to become Muslim",
        "new Muslim Norway",
        "Islamic learning Norway",
      ],
    },
    "/about-us": {
      title: "About Dawah Norway — Sharing Islam Since 2021",
      description:
        "Dawah Norway is a Norwegian non-profit founded in 2021. We invite people to Islam through dawah stands, classes and outreach in six cities across Norway.",
      keywords: [
        "Dawah Norway",
        "Islamic organisation Norway",
        "non-profit Islam Norway",
        "Muslim outreach Oslo",
      ],
    },
    "/about-us/our-mission": {
      title: "Our Mission — Educating Norway About Islam",
      description:
        "Our mission is to educate Muslim and non-Muslim communities about Islam through outreach, distribution of authentic Islamic resources, and community programmes across Norway.",
      keywords: [
        "Dawah Norway mission",
        "Islamic outreach Norway",
        "Muslim non-profit Norway",
      ],
    },
    "/about-us/our-vision": {
      title: "Our Vision — A Norway Where Islam is Understood",
      description:
        "We envision a Norway where everyone has access to authentic Islamic knowledge and where communities are united by shared understanding and mutual respect.",
      keywords: [
        "Dawah Norway vision",
        "Islam in Norway",
        "Muslim community Norway",
      ],
    },
    "/contact-us": {
      title: "Contact Dawah Norway — Get in Touch",
      description:
        "Questions about Islam? Want to volunteer, request a free Quran, or speak to a mentor? Contact Dawah Norway by email, phone, or via the form.",
      keywords: [
        "contact Dawah Norway",
        "Islam questions Norway",
        "free Quran request",
        "Muslim mentor Norway",
      ],
    },
    "/donate": {
      title: "Donate to Dawah Norway — Support Islam in Norway",
      description:
        "Your donation funds dawah stands, free Qurans and Islamic literature, and support for new Muslims across Norway. Donate via Vipps, card or PayPal.",
      keywords: [
        "donate Dawah Norway",
        "Islamic charity Norway",
        "Muslim charity Norway",
        "Vipps donasjon islam",
        "free Quran donation",
      ],
    },
    "/donation-agreement": {
      title: "Recurring Donation Agreement — Vipps Terms",
      description:
        "Terms and conditions for recurring donations to Dawah Norway via Vipps, including amount, cancellation, refund policy and data handling.",
      keywords: ["Vipps donation terms", "Dawah Norway recurring donation"],
    },
    "/gallery": {
      title: "Gallery — Dawah Stands & Community Moments in Norway",
      description:
        "Photos from our dawah stands, Quran distribution events, lectures and community gatherings across Oslo, Trondheim, Stavanger and other Norwegian cities.",
      keywords: [
        "Dawah Norway gallery",
        "Islamic events Norway",
        "dawah stand Oslo",
        "Quran distribution Norway",
      ],
    },
    "/privacy-policy": {
      title: "Privacy Policy — Dawah Norway",
      description:
        "How Dawah Norway collects, uses and protects your data. GDPR-compliant policy covering contact form, donations, cookies and your rights.",
      keywords: ["Dawah Norway privacy policy", "GDPR Islam Norway"],
    },
    "/terms": {
      title: "Terms of Use — Dawah Norway",
      description:
        "Terms and conditions for using the Dawah Norway website, including acceptable use, donations and content disclaimers.",
      keywords: ["Dawah Norway terms"],
    },
  },
  no: {
    "/": {
      title: "Dawah Norge — Lær om Islam i Norge",
      description:
        "En invitasjon til Islam i Norge. Vi utdanner samfunn, distribuerer gratis Koraner og støtter nye muslimer i Oslo, Trondheim, Stavanger og hele Norge siden 2021.",
      keywords: [
        ...COMMON_NO_KEYWORDS,
        "hva er islam",
        "shahada norsk",
        "islam i norge",
      ],
    },
    "/why-islam": {
      title: "Hvorfor Islam? — En klar vei til Guds budskap",
      description:
        "Oppdag hvorfor millioner omfavner Islam: et nært forhold til Skaperen, en klar gudsforståelse, bevisbasert tro, rettferdighet og en balansert livsstil.",
      keywords: [
        "hvorfor islam",
        "hva er islam",
        "islams budskap",
        "bevis for islam",
        "islam norge",
        "livets mening islam",
      ],
    },
    "/who-is-muhammad": {
      title: "Hvem er Muhammad ﷺ? — Guds siste sendebud",
      description:
        "Muslimer anser Muhammad ﷺ som den siste profeten i en rekke som inkluderer Adam, Noah, Abraham, Moses og Jesus. Lær om hans karakter, barmhjertighet og eksempel.",
      keywords: [
        "muhammad",
        "profeten muhammad",
        "hvem er muhammad",
        "muhammads liv",
        "seerah norsk",
        "islams profet",
      ],
    },
    "/new-muslims": {
      title: "Ny Muslim — Veiledning, Shahada og støtte i Norge",
      description:
        "Velkommen til Islam. En komplett guide for nye muslimer i Norge: hvordan ta Shahada, lære bønnen, finne mentorer, få gratis Koran og fellesskapsstøtte.",
      keywords: [
        "ny muslim",
        "konvertere til islam",
        "shahada",
        "bli muslim",
        "ny i islam norge",
        "lære islam norge",
      ],
    },
    "/about-us": {
      title: "Om Dawah Norge — Deling av Islam siden 2021",
      description:
        "Dawah Norge er en norsk ideell organisasjon grunnlagt i 2021. Vi inviterer folk til Islam gjennom dawah-stands, kurs og oppsøkende arbeid i seks norske byer.",
      keywords: [
        "dawah norge",
        "islamsk organisasjon norge",
        "ideell muslimsk organisasjon",
        "muslimsk oppsøkende arbeid oslo",
      ],
    },
    "/about-us/our-mission": {
      title: "Vårt Oppdrag — Utdanne Norge om Islam",
      description:
        "Vårt oppdrag er å utdanne både muslimske og ikke-muslimske samfunn om Islam gjennom oppsøkende arbeid, autentiske islamske ressurser og samfunnsprogrammer i hele Norge.",
      keywords: [
        "dawah norge oppdrag",
        "islamsk oppsøkende arbeid norge",
        "muslimsk ideell organisasjon norge",
      ],
    },
    "/about-us/our-vision": {
      title: "Vår Visjon — Et Norge som forstår Islam",
      description:
        "Vi ser for oss et Norge der alle har tilgang til autentisk islamsk kunnskap og der samfunn er forent av delt forståelse og gjensidig respekt.",
      keywords: [
        "dawah norge visjon",
        "islam i norge",
        "muslimsk fellesskap norge",
      ],
    },
    "/contact-us": {
      title: "Kontakt Dawah Norge — Ta Kontakt",
      description:
        "Spørsmål om Islam? Vil du være frivillig, be om en gratis Koran, eller snakke med en mentor? Kontakt Dawah Norge på e-post, telefon eller via skjemaet.",
      keywords: [
        "kontakt dawah norge",
        "spørsmål om islam",
        "gratis koran norge",
        "muslimsk mentor norge",
      ],
    },
    "/donate": {
      title: "Doner til Dawah Norge — Støtt Islam i Norge",
      description:
        "Din donasjon finansierer dawah-stands, gratis Koraner og islamsk litteratur, samt støtte til nye muslimer i hele Norge. Doner med Vipps, kort eller PayPal.",
      keywords: [
        "doner dawah norge",
        "islamsk veldedighet norge",
        "muslimsk veldedighet norge",
        "vipps donasjon islam",
        "doner gratis koran",
      ],
    },
    "/donation-agreement": {
      title: "Vilkår for fast donasjon — Vipps-avtale",
      description:
        "Vilkår for faste donasjoner til Dawah Norge via Vipps, inkludert beløp, oppsigelse, refusjon og behandling av personopplysninger.",
      keywords: ["vipps fast donasjon vilkår", "dawah norge fast donasjon"],
    },
    "/gallery": {
      title: "Galleri — Dawah-stands og fellesskapsøyeblikk i Norge",
      description:
        "Bilder fra våre dawah-stands, Koran-distribusjoner, foredrag og fellesskapsarrangementer i Oslo, Trondheim, Stavanger og andre norske byer.",
      keywords: [
        "dawah norge galleri",
        "islamske arrangementer norge",
        "dawah stand oslo",
        "koran distribusjon norge",
      ],
    },
    "/privacy-policy": {
      title: "Personvernerklæring — Dawah Norge",
      description:
        "Hvordan Dawah Norge samler inn, bruker og beskytter dine data. GDPR-kompatibel erklæring som dekker kontaktskjema, donasjoner, informasjonskapsler og dine rettigheter.",
      keywords: ["dawah norge personvern", "gdpr islam norge"],
    },
    "/terms": {
      title: "Vilkår for Bruk — Dawah Norge",
      description:
        "Vilkår og betingelser for bruk av Dawah Norge-nettstedet, inkludert akseptabel bruk, donasjoner og innholdsforbehold.",
      keywords: ["dawah norge vilkår"],
    },
  },
};

export function getSeo(locale: string, route: string): SeoEntry {
  const localeKey = (locale === "no" ? "no" : "en") as Locale;
  const entry = seo[localeKey][route as Routes];
  return entry ?? seo[localeKey]["/"];
}
