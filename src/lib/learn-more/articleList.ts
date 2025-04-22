export type ArticleMeta = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  link?: string;
  nextArticle?: string[];
};

export const articleMetaData: ArticleMeta[] = [
  {
    id: "reporting",
    title: "Understanding Climate Reporting",
    excerpt:
      "Learn about the importance of climate reporting, its impact on businesses and communities, and how it drives climate action.",
    image: "/images/blogImages/matthias-heyde-co2-unsplash.jpg",
  },
  {
    id: "why-reporting-matters",
    title: "Importance of Data Reporting and Transparency",
    excerpt:
      "Understand the impact of data collection and transparency on taking effective climate action.",
    image: "/images/blogImages/matthias-heyde-co2-unsplash.jpg",
  },
];
