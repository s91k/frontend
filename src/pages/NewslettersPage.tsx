import { useTranslation } from "react-i18next";
import { articleMetaData } from "@/lib/learn-more/articleList";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, useEffect, useRef } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { NewsletterNavigation } from "@/components/newsletters/newsletterNavigation";
import { newsletterList } from "@/lib/newsletterArchive/newsletterData";

export function NewsLetterArchivePage() {
  const { t } = useTranslation();
  const canonicalUrl = "https://klimatkollen.se/insights/newsletter-archive";
  const pageTitle = t("newsletterArchivePage.title");
  const pageDescription = t("newsletterArchivePage.description");
  const [selectedMonth, setSelectedMonth] = useState("March");
  const { isMobile } = useScreenSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedNewsletter, setDisplayedNewsletter] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedMonth]);

  useEffect(() => {
    const latestYear = Object.keys(newsletterList)
      .map(Number)
      .sort((a, b) => b - a)[0];

    const latestNewspaperPublished = newsletterList[latestYear];

    if (latestNewspaperPublished?.[0]) {
      setDisplayedNewsletter(latestNewspaperPublished[0]);
    }
  }, [newsletterList]);

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

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-white gap-4">
      <PageHeader
        title={t("newsletterArchivePage.title")}
        description={t("newsletterArchivePage.description")}
      ></PageHeader>
      <div className="mt-6 relative flex lg:flex-row gap-8">
        <NewsletterNavigation
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          contentRef={contentRef}
          setDisplayedNewsletter={setDisplayedNewsletter}
        />
        {/*         <nav
          aria-label="Methodology Navigation"
          className="bg-black-2 rounded-md p-2"
        >
          <h2 className="sr-only">{t("methodsPage.dataSelector.label")}</h2>

          <ul className="divide-y divide-black-1">
            {Object.keys(newsletterList).map((year) => (
              <li key={year}>
                <button
                  onClick={() => toggleYear(year)}
                  className="flex justify-between items-center w-full p-3 my-1 text-left font-medium text-white hover:bg-black-1 transition-colors duration-200 rounded-lg"
                                    aria-expanded={setExpandedYear.includes(year)}
                  
                >
                  <span>{t(`${year}`)}</span>
                  {expandedYear.includes(year) ? (
                    <ChevronUp size={18} className="text-grey" />
                  ) : (
                    <ChevronDown size={18} className="text-grey" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav> */}
        {displayedNewsletter?.url && (
          <iframe
            className="rounded-md w-full bg-black-2"
            src={`${displayedNewsletter.url}`}
            height={800}
            width={1000}
          ></iframe>
        )}
      </div>
    </div>
  );
}
