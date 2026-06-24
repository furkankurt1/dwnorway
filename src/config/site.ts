export const siteConfig = {
  name: "Dawah Norway",
  url: "https://www.dawahnorway.com",
  email: "info@dawahnorway.com",
  emailAlt: "info@dawahnorway.com",
  contactEmail: "info@dawahnorway.com",
  phone: "+47 489 20 006",
  address: "Østre Aker vei 101, 0596 Oslo, Norway",
  // Brønnøysundregistrene org. number — locale-blind, label is translated.
  orgNumber: "931 087 509",
  // Approximate coordinates for the 0596 Oslo (Økern/Risløkka) postal area.
  // Supplementary to the postal address in JSON-LD; Google geocodes the
  // address itself. hasMap points crawlers at the canonical map listing.
  geo: { latitude: 59.9407, longitude: 10.8225 },

  social: {
    facebook: "https://www.facebook.com/DawahNorge21",
    instagram: "https://www.instagram.com/dawah_norge/",
    youtube: "https://www.youtube.com/@dawahnorway",
    tiktok: "https://www.tiktok.com/@dawahnorway",
  },

  tiktokVideos: [
    "7628679625706687766",
    "7601959562043755778",
    "7599403405672516886",
    "7596742797034622230",
    "7508820017094429974",
  ],

  team: [
    {
      name: "Yousuf Dawah",
      roleKey: "founder",
    },
    {
      name: "Tamim Rasheedi",
      roleKey: "imam",
      image: "/images/team/tamim.webp",
      imagePosition: "center 35%",
    },
    {
      name: "Nafies Dawah",
      roleKey: "founder",
      image: "/images/team/nafies.webp",
      imagePosition: "top",
    },
    {
      name: "Furkan Kurt",
      roleKey: "itConsultant",
    },
  ],

  stats: {
    converts: 2000,
    qurans: 100000,
    literature: 200000,
    cities: 20,
    teams: 5,
  },

  cities: [
    "Oslo",
    "Østfold",
    "Kristiansand",
    "Stavanger",
    "Trondheim",
    "Tromsø",
  ],

  testimonials: [
    {
      name: "Farhan Ahmed",
      key: "farhan",
    },
    {
      name: "Fatima Ali",
      key: "fatima",
    },
    {
      name: "Hashim Masud",
      key: "hashim",
    },
    {
      name: "Maqsood Ali",
      key: "maqsood",
    },
    {
      name: "Muhammad Masood",
      key: "muhammad",
    },
  ],

  pillars: [
    { key: "shahadah", name: "Shahadah", meaning: "Faith" },
    { key: "salah", name: "Salah", meaning: "Prayer" },
    { key: "sawm", name: "Sawm", meaning: "Fasting" },
    { key: "zakat", name: "Zakat", meaning: "Almsgiving" },
    { key: "hajj", name: "Hajj", meaning: "Pilgrimage" },
  ],

  // Source files were originally Facebook auto-named (`/dwn/471192731_…_n.jpg`),
  // which gives Google Images zero context. Renamed to NO-keyword filenames
  // under `/dawah-norge/` for image-search ranking. Old `/dwn/*` files are
  // kept on disk as a 404-prevention safety net for any external links.
  homeGallery: [
    "/dawah-norge/dawah-stand-norge-01.jpg",
    "/dawah-norge/islamsk-foredrag-norge-05.jpg",
    "/dawah-norge/dawah-stand-norge-09.jpg",
    "/dawah-norge/islam-i-norge-arrangement-16.jpg",
    "/dawah-norge/gateoppsokende-arbeid-oslo-22.jpg",
    "/dawah-norge/fellesskap-arrangement-norge-27.jpg",
  ],

  // Hero parallax slideshow — restricted to dawah-stand "tent" shots so the
  // background visually reinforces the on-the-ground outreach scene at a
  // glance. Glimpses + side cards still use the full homeGallery for variety.
  heroSlideshow: [
    "/dawah-norge/dawah-stand-norge-01.jpg",
    "/dawah-norge/dawah-stand-norge-09.jpg",
    "/dawah-norge/dawah-stand-norge-17.jpg",
    "/dawah-norge/dawah-stand-norge-25.jpg",
    "/dawah-norge/dawah-stand-norge-33.jpg",
  ],

  gallery: [
    ...[
      "dawah-stand-norge-01.jpg",
      "koranfordeling-oslo-02.jpg",
      "fellesskap-arrangement-norge-03.jpg",
      "gratis-koran-distribusjon-04.jpg",
      "islamsk-foredrag-norge-05.jpg",
      "gateoppsokende-arbeid-oslo-06.jpg",
      "dawah-team-norge-07.jpg",
      "islam-i-norge-arrangement-08.jpg",
      "dawah-stand-norge-09.jpg",
      "koranfordeling-oslo-10.jpg",
      "fellesskap-arrangement-norge-11.jpg",
      "gratis-koran-distribusjon-12.jpg",
      "islamsk-foredrag-norge-13.jpg",
      "gateoppsokende-arbeid-oslo-14.jpg",
      "dawah-team-norge-15.jpg",
      "islam-i-norge-arrangement-16.jpg",
      "dawah-stand-norge-17.jpg",
      "koranfordeling-oslo-18.jpg",
      "fellesskap-arrangement-norge-19.jpg",
      "gratis-koran-distribusjon-20.jpg",
      "islamsk-foredrag-norge-21.jpg",
      "gateoppsokende-arbeid-oslo-22.jpg",
      "dawah-team-norge-23.jpg",
      "islam-i-norge-arrangement-24.jpg",
      "dawah-stand-norge-25.jpg",
      "koranfordeling-oslo-26.jpg",
      "fellesskap-arrangement-norge-27.jpg",
      "gratis-koran-distribusjon-28.jpg",
      "islamsk-foredrag-norge-29.jpg",
      "gateoppsokende-arbeid-oslo-30.jpg",
      "dawah-team-norge-31.jpg",
      "islam-i-norge-arrangement-32.jpg",
      "dawah-stand-norge-33.jpg",
      "koranfordeling-oslo-34.jpg",
      "fellesskap-arrangement-norge-35.jpg",
      "gratis-koran-distribusjon-36.jpg",
      "islamsk-foredrag-norge-37.jpg",
      "gateoppsokende-arbeid-oslo-38.jpg",
    ].map((file, i) => {
      const themes = [
        "Dawah Stand",
        "Street Outreach",
        "Community Event",
        "Quran Distribution",
        "Team Gathering",
        "Public Lecture",
      ];
      return { src: `/dawah-norge/${file}`, caption: themes[i % themes.length] };
    }),
    { src: "/images/gallery/g01-street-dawah.webp", caption: "Street Dawah" },
    { src: "/images/gallery/g02-community-discussion.webp", caption: "Community Discussion" },
    { src: "/images/gallery/g03-lecture-session.webp", caption: "Lecture Session" },
    { src: "/images/gallery/g04-public-engagement.webp", caption: "Public Engagement" },
    { src: "/images/gallery/g05-outreach-booth.webp", caption: "Outreach Booth" },
    { src: "/images/gallery/g06.webp", caption: "Event" },
    { src: "/images/gallery/g07.webp", caption: "Event" },
    { src: "/images/gallery/g08.webp", caption: "Event" },
    { src: "/images/gallery/g09-community-gathering.jpg", caption: "Community Gathering" },
    { src: "/images/gallery/g10.jpeg", caption: "Event" },
    { src: "/images/gallery/g11.jpeg", caption: "Event" },
    { src: "/images/gallery/g12.jpeg", caption: "Event" },
    { src: "/images/gallery/g13.jpeg", caption: "Event" },
    { src: "/images/gallery/g14.jpeg", caption: "Event" },
    { src: "/images/gallery/g15-islamic-booth.webp", caption: "Islamic Outreach Booth" },
    { src: "/images/gallery/g16-information-booth.webp", caption: "Information Booth" },
    { src: "/images/gallery/g17.webp", caption: "Community Event" },
    { src: "/images/gallery/g18-evening-discussion.webp", caption: "Evening Discussion" },
    { src: "/images/gallery/g19-team-gathering.webp", caption: "Team Gathering" },
    { src: "/images/gallery/g20-street-quran-distribution.webp", caption: "Street Quran Distribution" },
  ],

  fylkeTeams: [
    {
      key: "oslo",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
    {
      key: "ostfold",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
    {
      key: "vestfold",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
    {
      key: "rogaland",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
    {
      key: "trondelag",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
    {
      key: "troms",
      members: [
        { name: "PLACEHOLDER", role: "Da'i & Volunteer", image: null as string | null, contact: null as string | null },
      ],
    },
  ],

  newMuslimResources: {
    becomeMuslim: "/new-muslims#become-muslim",
    course: "https://newmuslimacademy.org/",
    guide: "https://www.islam-guide.com/",
    academy: "https://newmuslimacademy.org/",
    purpose: "https://www.islamreligion.com/articles/10818/purpose-of-life/",
    ghusal: "https://islamqa.info/en/answers/83165/",
    wudu: "https://www.youtube.com/results?search_query=how+to+perform+wudu",
    prayer: "https://www.youtube.com/results?search_query=how+to+pray+in+islam",
    prayerTutorial: "https://www.youtube.com/results?search_query=islamic+prayer+tutorial",
    quran: "https://quran.com/",
    seerah: "https://seerah.com/",
    foundations: "https://islamhouse.com/en/",
    mentors: "/contact-us",
    // Free Quran & literature has a dedicated page — keep the conversion
    // intent on-site instead of dead-ending at the contact form.
    freeBooks: "/free-quran",
    prayerMat: "/free-quran",
  } as Record<string, string>,
};
