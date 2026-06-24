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
  | "/about-us/our-team"
  | "/contact-us"
  | "/donate"
  | "/donation-agreement"
  | "/five-pillars"
  | "/free-quran"
  | "/gallery"
  | "/new-muslims"
  | "/privacy-policy"
  | "/support-dawah"
  | "/terms"
  | "/what-is-islam"
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
        "An invitation to Islam in Norway — we educate communities, distribute free Qurans and support new Muslims in Oslo, Trondheim and across Norway since 2021.",
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
        "Discover why millions embrace Islam: a direct relationship with the Creator, a clear understanding of God, evidence-based faith and a balanced way of life.",
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
      title: "Who is Muhammad ﷺ? — Islam's Final Prophet",
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
      title: "Become a Muslim in Norway — New Muslim Guide",
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
      title: "About Us — Sharing Islam in Norway Since 2021",
      description:
        "Dawah Norway is a Norwegian non-profit founded in 2021. We invite people to Islam through dawah stands, classes and outreach in six cities across Norway.",
      keywords: [
        "Dawah Norway",
        "Islamic organization Norway",
        "non-profit Islam Norway",
        "Muslim outreach Oslo",
      ],
    },
    "/about-us/our-mission": {
      title: "Our Mission — Educating Norway About Islam",
      description:
        "Our mission: to educate Muslim and non-Muslim communities about Islam through outreach, authentic Islamic resources and community programs across Norway.",
      keywords: [
        "Dawah Norway mission",
        "Islamic outreach Norway",
        "Muslim non-profit Norway",
      ],
    },
    "/about-us/our-vision": {
      title: "Our Vision — A Norway That Understands Islam",
      description:
        "We envision a Norway where everyone has access to authentic Islamic knowledge and where communities are united by shared understanding and mutual respect.",
      keywords: [
        "Dawah Norway vision",
        "Islam in Norway",
        "Muslim community Norway",
      ],
    },
    "/contact-us": {
      title: "Contact Us — Ask About Islam or a Free Quran",
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
      title: "Donate — Support Islam's Message in Norway",
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
    "/free-quran": {
      title: "Free Quran in Norway — Order Your Copy",
      description:
        "Order a free copy of the Quran anywhere in Norway. The Holy Quran is a guidance for all mankind — available in Norwegian, English, and Arabic at no cost.",
      keywords: [
        "free Quran Norway",
        "order Quran Norway",
        "Quran in Norwegian",
        "gratiskoran",
        "Islamic book Norway",
        "Quran distribution Norway",
        "free Islamic book",
      ],
    },
    "/support-dawah": {
      title: "Support Our Dawah — Spread Islam in Norway",
      description:
        "Help us spread Islam across Norway. Over 2,000 people have accepted Islam through our work. Support Dawah Norway through donations or volunteering.",
      keywords: [
        "support Dawah Norway",
        "donate Islam Norway",
        "Islamic charity Norway",
        "volunteer Islam Norway",
        "support dawah",
        "sadaqah Norway",
      ],
    },
    "/about-us/our-team": {
      title: "Our Team — Volunteers Sharing Islam in Norway",
      description:
        "Meet the dedicated volunteers of Dawah Norway — active every Saturday in Oslo, Østfold, Vestfold, Rogaland, Trøndelag and Troms sharing the message of Islam.",
      keywords: [
        "Dawah Norway team",
        "Islamic volunteers Norway",
        "dawah volunteers Oslo",
        "Muslim outreach team Norway",
      ],
    },
    "/gallery": {
      title: "Gallery — Dawah Stands & Quran Distribution",
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
      title: "Privacy Policy",
      description:
        "How Dawah Norway collects, uses and protects your data. GDPR-compliant policy covering contact form, donations, cookies and your rights.",
      keywords: ["Dawah Norway privacy policy", "GDPR Islam Norway"],
    },
    "/terms": {
      title: "Terms of Use",
      description:
        "Terms and conditions for using the Dawah Norway website, including acceptable use, donations and content disclaimers.",
      keywords: ["Dawah Norway terms"],
    },
    "/what-is-islam": {
      title: "What is Islam? — Meaning, Beliefs, Practices",
      description:
        "A clear introduction to Islam: what the word means, belief in one God, the Quran, the Prophet Muhammad ﷺ, the Five Pillars, and Islam in Norway.",
      keywords: [
        "what is Islam",
        "hva er islam",
        "meaning of Islam",
        "Islam beliefs",
        "Islam explained",
        "Muslim faith",
        "Islam Norway",
      ],
    },
    "/five-pillars": {
      title: "The Five Pillars of Islam — Explained",
      description:
        "The five pillars of Islam explained: Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting in Ramadan) and Hajj (pilgrimage to Mecca).",
      keywords: [
        "five pillars of Islam",
        "pillars of Islam",
        "Shahada",
        "Salah",
        "Zakat",
        "Sawm",
        "Hajj",
      ],
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
        "Muslimer anser Muhammad ﷺ som den siste profeten i rekken Adam, Abraham, Moses og Jesus. Lær om hans karakter, barmhjertighet og eksempel.",
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
      // Trimmed from "Ny Muslim — Veiledning, Shahada og støtte i Norge"
      // (66 chars including the brand suffix → SERP truncation). 49 chars
      // body keeps the | Dawah Norge suffix under the 60-char threshold.
      title: "Bli Muslim i Norge — Shahada og veiledning",
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
      title: "Om Oss — Deling av Islam i Norge siden 2021",
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
        "Vårt oppdrag: å utdanne muslimske og ikke-muslimske samfunn om Islam gjennom oppsøkende arbeid, autentiske ressurser og samfunnsprogrammer i Norge.",
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
      title: "Kontakt Oss — Spørsmål om Islam og Koran",
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
      title: "Doner — Støtt spredningen av Islam i Norge",
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
    "/free-quran": {
      title: "Gratis Koran i Norge — Bestill din kopi",
      description:
        "Bestill en gratis Koran hvor som helst i Norge — tilgjengelig på norsk, engelsk og arabisk, helt uten kostnad. En veiledning for hele menneskeheten.",
      keywords: [
        "gratis koran norge",
        "bestill koran norge",
        "koran på norsk",
        "gratiskoran",
        "islamsk bok norge",
        "koran distribusjon norge",
        "gratis islamsk bok",
      ],
    },
    "/support-dawah": {
      title: "Støtt Vår Dawah — Spre Islam i Norge",
      description:
        "Hjelp oss å spre Islam i hele Norge. Over 2 000 mennesker har akseptert Islam gjennom vårt arbeid. Støtt Dawah Norge gjennom donasjoner eller frivillighet.",
      keywords: [
        "støtt dawah norge",
        "doner islam norge",
        "islamsk veldedighet norge",
        "frivillig islam norge",
        "støtt dawah",
        "sadaqah norge",
      ],
    },
    "/about-us/our-team": {
      title: "Vårt Team — Frivillige for Islam i Norge",
      description:
        "Møt de engasjerte frivillige i Dawah Norge — aktive hver lørdag i Oslo, Østfold, Vestfold, Rogaland, Trøndelag og Troms med Islams budskap.",
      keywords: [
        "dawah norge team",
        "islamske frivillige norge",
        "dawah frivillige oslo",
        "muslimsk oppsøkende team norge",
      ],
    },
    "/gallery": {
      title: "Galleri — Dawah-stands og Koran-distribusjon",
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
      title: "Personvernerklæring",
      description:
        "Hvordan Dawah Norge samler inn, bruker og beskytter dine data. GDPR-erklæring som dekker kontaktskjema, donasjoner, informasjonskapsler og rettigheter.",
      keywords: ["dawah norge personvern", "gdpr islam norge"],
    },
    "/terms": {
      title: "Vilkår for Bruk",
      description:
        "Vilkår og betingelser for bruk av Dawah Norge-nettstedet, inkludert akseptabel bruk, donasjoner og innholdsforbehold.",
      keywords: ["dawah norge vilkår"],
    },
    "/what-is-islam": {
      title: "Hva er Islam? — Betydning, tro og praksis",
      description:
        "En klar innføring i Islam: hva ordet betyr, troen på én Gud, Koranen, profeten Muhammad ﷺ, de fem søylene, og Islam i Norge.",
      keywords: [
        "hva er islam",
        "islam betydning",
        "islam tro",
        "islam forklart",
        "islam i norge",
        "muslimsk tro",
        "koranen",
      ],
    },
    "/five-pillars": {
      title: "Islams fem søyler — Forklart",
      description:
        "Islams fem søyler forklart: Shahada (tro), Salah (bønn), Zakat (veldedighet), Sawm (faste i ramadan) og Hajj (pilegrimsreise til Mekka).",
      keywords: [
        "islams fem søyler",
        "islams søyler",
        "shahada",
        "salah",
        "zakat",
        "sawm",
        "hajj",
      ],
    },
  },
};

export function getSeo(locale: string, route: string): SeoEntry {
  const localeKey = (locale === "no" ? "no" : "en") as Locale;
  const entry = seo[localeKey][route as Routes];
  return entry ?? seo[localeKey]["/"];
}
