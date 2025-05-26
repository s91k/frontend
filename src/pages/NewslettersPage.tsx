import { useTranslation } from "react-i18next";
import { articleMetaData } from "@/lib/learn-more/articleList";
import { PageHeader } from "@/components/layout/PageHeader";
import { newsletterList } from "@/lib/newletterArchive/newletterData";

export function NewsLetterArchivePage() {
  const { t } = useTranslation();
  const canonicalUrl = "https://klimatkollen.se/insights/newsletter-archive";
  const pageTitle = t("newsletterArchivePage.title");
  const pageDescription = t("newsletterArchivePage.description");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
  };

  const items = articleMetaData.map((article) => ({
    id: article.id,
    title: t(article.titleKey),
    excerpt: t(article.excerptKey),
    image: article.image || "",
  }));

  const years = ["2025", "2024", "2023", "2023"];
  /*   const newsletters = [
    "Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf",
  ]; */

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-white gap-4">
      <PageHeader
        title={t("newsletterArchivePage.title")}
        description={t("newsletterArchivePage.description")}
      ></PageHeader>
      <div className="mt-6 relative flex lg:flex-row gap-8">
        <nav
          aria-label="Methodology Navigation"
          className="bg-black-2 rounded-md h-60 p-2 w-64"
        >
          <ul className="divide-y divide-black-1">
            {years.map((year) => (
              <li key="1">
                <button
                  /*               onClick={() => toggleCategory(category)}
                   */ className="flex justify-between items-center w-full p-3 my-1 text-left font-medium text-white hover:bg-black-1 transition-colors duration-200 rounded-lg"
                  /*               aria-expanded={expandedCategories.includes(category)}
                   */
                >
                  {year}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <iframe
          className="rounded-md w-full bg-black-2"
          src="newsletters/Storbolagens ökade utsläpp en Brysselresa och AIröster från framtiden.pdf"
          height={800}
          width={1000}
        ></iframe>
      </div>
    </div>
  );
}
