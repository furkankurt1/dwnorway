export const siteConfig = {
  name: "Dawah Norway",
  url: "https://dawahnorway.com",
  email: "info@dawahnorway.no",
  emailAlt: "info@dawahnorway.com",
  contactEmail: "contact@dawahnorway.com",
  phone: "+47 489 20 006",
  address: "Østre Aker vei 101, 0596 Oslo, Norway",

  social: {
    facebook: "https://www.facebook.com/DawahNorge21",
    instagram: "https://www.instagram.com/dawah_norge/",
    youtube: "https://www.youtube.com/@dawahnorway",
    tiktok: "https://www.tiktok.com/@dawahnorway",
  },

  team: [
    {
      name: "Yousuf Dawah",
      role: "Founder & Da'i",
    },
    {
      name: "Tamim Rasheedi",
      role: "Imam & Da'i",
      image: "/images/team/tamim.webp",
      imagePosition: "center 35%",
    },
    {
      name: "Nafies Dawah",
      role: "Founder & Da'i",
      image: "/images/team/nafies.webp",
      imagePosition: "top",
    },
    {
      name: "Furkan Kurt",
      role: "IT Consultant & Da'i",
    },
  ],

  stats: {
    converts: 1000,
    qurans: 50000,
    literature: 80000,
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
      role: "Community Member",
      quote:
        "Finding this community has been a turning point in my spiritual journey. The support and knowledge I've received here have been invaluable.",
    },
    {
      name: "Fatima Ali",
      role: "Student",
      quote:
        "The workshops and classes have deepened my understanding of Islam in ways I never thought possible. I am continually impressed by the dedication and warmth of the instructors.",
    },
    {
      name: "Hashim Masud",
      role: "New Member",
      quote:
        "As a new member of the Muslim community, the transition was made smoother thanks to the comprehensive guidance and open arms I found here.",
    },
    {
      name: "Maqsood Ali",
      role: "Community Member",
      quote:
        "I was always curious about Islam, and the open dialogues and discussions I've had with members have been eye-opening. The respect and patience they exhibit are remarkable.",
    },
    {
      name: "Muhammad Masood",
      role: "Community Member",
      quote:
        "The youth programs are second to none. It's heartwarming to see young minds engaging with their faith and culture so passionately, all thanks to the nurturing environment provided here.",
    },
  ],

  pillars: [
    { key: "shahadah", name: "Shahadah", meaning: "Faith" },
    { key: "salah", name: "Salah", meaning: "Prayer" },
    { key: "sawm", name: "Sawm", meaning: "Fasting" },
    { key: "zakat", name: "Zakat", meaning: "Almsgiving" },
    { key: "hajj", name: "Hajj", meaning: "Pilgrimage" },
  ],

  gallery: [
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
    freeBooks: "/contact-us",
    prayerMat: "/contact-us",
  } as Record<string, string>,
};
