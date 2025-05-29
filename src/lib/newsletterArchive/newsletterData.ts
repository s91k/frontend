export type NewsletterType = {
  id: String;
  url: String;
  yearPosted: String;
  monthPosted: String;
};

export type NewsletterArchiveList = {
  newsletters: NewsletterType[];
};

export const newsletterList = [
  {
    url: "newsletters/05-2025-Ny data om kommunerna + Almedalen calling.pdf",
    yearPosted: "2025",
    monthPosted: "May",
  },
  {
    url: "newsletters/03-2025-Storbolagens ökade utsläpp, en Brysselresa och AI-röster från framtiden.pdf",
    yearPosted: "2025",
    monthPosted: "March",
  },
  {
    url: "newsletters/12-2024-Ökade utsläpp i statliga bolag + vår julklapp.pdf",
    yearPosted: "2024",
    monthPosted: "December",
  },
  {
    url: "newsletters/11-2024-Därför finns vi nu på Wikipedia (+ storbolagslista och AI-podd!).pdf",
    yearPosted: "2024",
    monthPosted: "November",
  },
  {
    url: "newsletters/07-2024-AI-genererad utsläppsdata och rapport om storbolagens klimatredovisning.pdf",
    yearPosted: "2024",
    monthPosted: "July",
  },
  {
    url: "newsletters/06-2024-Färsk utsläppsdata om kommunerna + Klimatkollen i Almedalen.pdf",
    yearPosted: "2024",
    monthPosted: "June",
  },
  {
    url: "newsletters/05-2024-Nu släpper vi data om storbolagens utsläpp.pdf",
    yearPosted: "2024",
    monthPosted: "May",
  },
  {
    url: "newsletters/03-2024-Endast 122 kommuner ställer klimatkrav vid upphandling.pdf",
    yearPosted: "2024",
    monthPosted: "March",
  },
  {
    url: "newsletters/01-2024-Bara 74 kommuner klarar EU_s rekommendation om laddinfrastruktur.pdf",
    yearPosted: "2024",
    monthPosted: "January",
  },
];
