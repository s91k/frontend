import { useTranslation } from "react-i18next";
import { articleMetaData } from "@/lib/learn-more/articleList";
import { PageHeader } from "@/components/layout/PageHeader";
import { useState, useEffect, useRef } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { NewsletterNavigation } from "@/components/newsletters/NewsletterNavigation";
import { NewsletterType } from "@/lib/newsletterArchive/newsletterData";
import { useNewsletters } from "@/hooks/useNewsletters";

export function NewsLetterArchivePage() {
  const { t } = useTranslation();
  const canonicalUrl = "https://klimatkollen.se/insights/newsletter-archive";
  const pageTitle = t("newsletterArchivePage.title");
  const pageDescription = t("newsletterArchivePage.description");
  const { isMobile } = useScreenSize();
  const [displayedNewsletter, setDisplayedNewsletter] =
    useState<NewsletterType>() || null;

  const { data, loading, error } = useNewsletters();

  useEffect(() => {
    if (data) setDisplayedNewsletter(data[0].long_archive_url);
  }, [data]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
  };

  /*   const items = articleMetaData.map((article) => ({
    id: article.id,
    title: t(article.titleKey),
    excerpt: t(article.excerptKey),
    image: article.image || "",
  })); */

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
          newsletterList={data}
          setDisplayedNewsletter={setDisplayedNewsletter}
          displayedNewsLetter={displayedNewsletter}
        />

        {displayedNewsletter && (
          <iframe
            className="rounded-md min-h-screen w-full bg-black-2"
            src={`${displayedNewsletter}#view=FitH`}
            height={800}
            width={1000}
          ></iframe>
        )}
      </div>
    </div>
  );
}
