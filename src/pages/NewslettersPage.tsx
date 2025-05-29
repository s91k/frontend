import { useTranslation } from "react-i18next";
import { articleMetaData } from "@/lib/learn-more/articleList";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, useEffect, useRef } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { NewsletterNavigation } from "@/components/newsletters/newsletterNavigation";
import {
  newsletterList,
  NewsletterType,
  monthsToNumberedValue,
} from "@/lib/newsletterArchive/newsletterData";

export function NewsLetterArchivePage() {
  const { t } = useTranslation();
  const canonicalUrl = "https://klimatkollen.se/insights/newsletter-archive";
  const pageTitle = t("newsletterArchivePage.title");
  const pageDescription = t("newsletterArchivePage.description");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const { isMobile } = useScreenSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedNewsletter, setDisplayedNewsletter] =
    useState<NewsletterType>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedMonth]);

  useEffect(() => {
    const sortedNewsletterList = [...newsletterList].sort((a, b) => {
      const yearA = parseInt(a.yearPosted);
      const yearB = parseInt(b.yearPosted);

      const monthA = convertMonthToNumber(a.monthPosted) ?? 0;
      const monthB = convertMonthToNumber(b.monthPosted) ?? 0;

      const sortValueA = yearA * 100 + monthA;
      const sortValueB = yearB * 100 + monthB;

      return sortValueB - sortValueA;
    });

    setDisplayedNewsletter(sortedNewsletterList[0]);
    setSelectedMonth(sortedNewsletterList[0].url);
  }, []);

  const convertMonthToNumber = (month: string) => {
    const foundMonth = monthsToNumberedValue.find(
      (listedMonth) => listedMonth.name === month,
    );
    return foundMonth?.number;
  };

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
      <div
        className={`${isMobile ? "flex flex-col" : "flex"} mt-6 relative lg:flex-row gap-8`}
      >
        <NewsletterNavigation
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          contentRef={contentRef}
          setDisplayedNewsletter={setDisplayedNewsletter}
        />

        {displayedNewsletter?.url && (
          <iframe
            className="rounded-md min-h-screen w-full bg-black-2"
            src={`${displayedNewsletter.url}`}
            height={800}
            width={1000}
          ></iframe>
        )}
      </div>
    </div>
  );
}
