// Maps the English caption stored in `siteConfig.gallery` to a translation
// key in the `gallery` namespace, so visible captions, image alt text, AND
// the ImageGallery JSON-LD all become locale-aware. The English caption in
// the config stays as the fallback (and is used for filenames/sitemap).
// Shared between the gallery client (UI/alt) and server (JSON-LD).
export const CAPTION_KEY: Record<string, string> = {
  "Dawah Stand": "captionDawahStand",
  "Street Outreach": "captionStreetOutreach",
  "Community Event": "captionCommunityEvent",
  "Quran Distribution": "captionQuranDistribution",
  "Team Gathering": "captionTeamGathering",
  "Public Lecture": "captionPublicLecture",
  "Street Dawah": "captionStreetDawah",
  "Community Discussion": "captionCommunityDiscussion",
  "Lecture Session": "captionLectureSession",
  "Public Engagement": "captionPublicEngagement",
  "Outreach Booth": "captionOutreachBooth",
  Event: "captionEvent",
  "Community Gathering": "captionCommunityGathering",
  "Islamic Outreach Booth": "captionIslamicOutreachBooth",
  "Information Booth": "captionInformationBooth",
  "Evening Discussion": "captionEveningDiscussion",
  "Street Quran Distribution": "captionStreetQuranDistribution",
};
