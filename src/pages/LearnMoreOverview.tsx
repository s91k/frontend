import { PageHeader } from "@/components/layout/PageHeader";
import { useTranslation } from "react-i18next";
import { PageSEO } from "@/components/SEO/PageSEO";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LearnMoreCard } from "@/components/learnMore/LearnMoreCard";
import { articleMetaData } from "@/lib/learn-more/articleList";

export function LearnMoreOverview() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prepare SEO data
  const canonicalUrl = "https://klimatkollen.se/insights/learn-more-overview";
  const pageTitle = `${t("learnMoreOverview.title")} - Klimatkollen`;
  const pageDescription = t("learnMoreOverview.description");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("learnMoreOverview.title"),
    description: pageDescription,
    url: canonicalUrl,
  };

  return (
    <>
      <PageSEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />
      <div className="w-full max-w-[1200px] mx-auto space-y-8">
        <PageHeader
          title={t("learnMoreOverview.title")}
          description={t("learnMoreOverview.description")}
        />
        <div className="max-w-[1150px] mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articleMetaData.map((article) => (
              <LearnMoreCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
