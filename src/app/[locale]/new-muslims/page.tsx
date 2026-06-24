import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  faqJsonLd,
  howToJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import NewMuslimsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/new-muslims", locale });
}

const FAQ_NO = [
  {
    question: "Hvordan blir jeg muslim i Norge?",
    answer:
      "Du blir muslim ved å uttale Shahada med oppriktig hjerte: «Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulullah» (Jeg vitner om at det ikke finnes noen gud verdig tilbedelse utenom Allah, og at Muhammad er Allahs sendebud). Du trenger ingen sertifikat, ingen seremoni og ingen tillatelse fra noen — men vi anbefaler å kontakte oss for veiledning og fellesskap.",
  },
  {
    question: "Må jeg endre navn for å bli muslim?",
    answer:
      "Nei. Islam krever ikke at du endrer navnet ditt med mindre det betyr noe som strider mot islamsk tro. De fleste konvertitter beholder navnet sitt.",
  },
  {
    question: "Hva gjør jeg etter at jeg har tatt Shahada?",
    answer:
      "De første stegene er å ta ghusl (rituell vask), lære wudu og de fem daglige bønnene. Vi tilbyr personlig veiledning, gratis Koran og en mentor som hjelper deg gjennom de første ukene.",
  },
  {
    question: "Hvor finner jeg en moské i Oslo eller andre norske byer?",
    answer:
      "Det finnes moskeer i Oslo, Trondheim, Stavanger, Kristiansand, Tromsø og Østfold. Kontakt oss på info@dawahnorway.com så hjelper vi deg å finne nærmeste moské og fellesskap der du bor.",
  },
  {
    question: "Kan jeg få en gratis Koran på norsk?",
    answer:
      "Ja. Vi distribuerer gratis Koraner og islamsk litteratur i hele Norge. Bruk kontaktskjemaet eller send e-post til info@dawahnorway.com.",
  },
];

const FAQ_EN = [
  {
    question: "How do I become a Muslim in Norway?",
    answer:
      "You become a Muslim by sincerely declaring the Shahada: 'Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulullah' (I bear witness that there is no god worthy of worship except Allah, and that Muhammad is the Messenger of Allah). No certificate, ceremony or permission is required — but we recommend reaching out for guidance and community.",
  },
  {
    question: "Do I have to change my name to become a Muslim?",
    answer:
      "No. Islam does not require you to change your name unless it has a meaning that contradicts Islamic belief. Most converts keep their existing name.",
  },
  {
    question: "What do I do after taking the Shahada?",
    answer:
      "The first steps are taking a ritual bath (ghusl), learning ablution (wudu) and the five daily prayers. We offer one-to-one guidance, a free Quran, and a mentor who supports you through the first weeks.",
  },
  {
    question: "Where can I find a mosque in Oslo or other Norwegian cities?",
    answer:
      "There are mosques in Oslo, Trondheim, Stavanger, Kristiansand, Tromsø and Østfold. Contact us at info@dawahnorway.com and we will help you find the nearest mosque and community.",
  },
  {
    question: "Can I get a free Quran in Norwegian?",
    answer:
      "Yes. We distribute free Qurans and Islamic literature across Norway. Use the contact form or email info@dawahnorway.com.",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "newMuslims" });
  const messages = await getMessages({ locale });
  const seo = getSeo(locale, "/new-muslims");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: t("title"), url: `${siteConfig.url}/${locale}/new-muslims` },
  ]);
  const article = articleJsonLd({
    locale,
    path: "/new-muslims",
    headline: seo.title,
    description: seo.description,
    image: `${siteConfig.url}/images/mosque-dome.jpg`,
    wordCount: countWords(messages.newMuslims),
    speakable: ["h1", ".speakable-intro"],
  });
  const faq = faqJsonLd(locale === "no" ? FAQ_NO : FAQ_EN);

  // HowTo for the Shahada + first-week protocol — strongest extraction
  // format for AI answer engines on a "how to become Muslim" query.
  const howTo = howToJsonLd({
    locale,
    name: t("shahadaTitle"),
    description: t("shahadaIntro"),
    image: `${siteConfig.url}/images/mosque-dome.jpg`,
    steps: [
      {
        name: t("shahadaTitle"),
        text: `${t("shahadaTransliteration")} — ${t("shahadaMeaning")}`,
      },
      { name: t("norwayStep1"), text: t("norwayStep1") },
      { name: t("norwayStep2"), text: t("norwayStep2") },
      { name: t("norwayStep3"), text: t("norwayStep3") },
      { name: t("norwayStep4"), text: t("norwayStep4") },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <NewMuslimsPage />
    </>
  );
}
