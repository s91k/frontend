export type NewsletterType = {
  id: String;
  url: String;
  yearPosted: Number;
  monthPosted: String;
};

export type NewsletterArchiveList = {
  newsletters: NewsletterType[];
};

export const newsletterList = {
  2024: [
    {
      id: "3",
      url: "03-2025-newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      yearPosted: 2024,
      monthPosted: "November",
    },
    {
      id: "4",
      url: "03-2025-newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      yearPosted: 2024,
      monthPosted: "October",
    },
    {
      id: "5",
      url: "03-2025-newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      yearPosted: 2024,
      monthPosted: "September",
    },
  ],
  2025: [
    {
      id: "0",
      url: "03-2025-newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      yearPosted: 2025,
      monthPosted: "March",
    },
    {
      id: "1",
      url: "",
      yearPosted: 2025,
      monthPosted: "February",
    },
    {
      id: "2",
      url: "03-2025-newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
      yearPosted: 2025,
      monthPosted: "January",
    },
  ],
};
