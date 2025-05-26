export type NewsletterType = {
  id: String;
  url: String;
  yearPosted: Number;
  monthPosted: String;
  category: String;
};

export type NewsletterArchiveList = {
  newsletters: NewsletterType[];
};

export const newsletterSections = {
  2025: [
    {
      id: "March",
      category: 2025,
      url: "newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
    },
    {
      id: "February",
      url: "newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      category: "2025",
    },
    {
      id: "January",
      category: "2025",
      url: "newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
    },
  ],
  2024: [],
  2023: [],
  2022: [],
};
