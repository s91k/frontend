import { useTranslation } from "react-i18next";
import { useCompanies } from "@/hooks/companies/useCompanies";
import { useCompanyFilters } from "@/hooks/companies/useCompanyFilters";
import { useParams } from "react-router-dom";
import SectorOverview from "@/components/companies/sectors/SectorOverview";
import { useSectorTitles } from "@/hooks/companies/useCompanySectors";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSEO } from "@/components/SEO/PageSEO";
import { buildAbsoluteUrl } from "@/utils/seo";
import { useLanguage } from "@/components/LanguageProvider";
import {
  SectorError,
  SectorLoading,
} from "@/components/companies/sectors/SectorPageStates";
import { NotFoundPage } from "./NotFoundPage";

export function SectorDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { t } = useTranslation();
  const { companies, companiesLoading, companiesError } = useCompanies();
  const sectorTitles = useSectorTitles();
  const { currentLanguage } = useLanguage();

  const { filteredCompanies, filterGroups, activeFilters } = useCompanyFilters(
    companies,
    { includeSectorFilter: false },
  );

  const canonicalUrl = buildAbsoluteUrl(`/${currentLanguage}/sectors/${code}`);

  if (companiesLoading) {
    return <SectorLoading />;
  }

  if (companiesError) {
    return (
      <SectorError
        title={t("sectorsOverviewPage.errorTitle")}
        description={t("sectorsOverviewPage.errorDescription")}
      />
    );
  }

  if (code == undefined || !(code in sectorTitles)) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageSEO
        title={`${sectorTitles[code as keyof typeof sectorTitles]} - Klimatkollen`}
        description={t("sectorsOverviewPage.description")}
        canonicalUrl={canonicalUrl}
      />
      <PageHeader
        variant="title-only"
        title={sectorTitles[code as keyof typeof sectorTitles]}
      />
      <SectorOverview
        companies={filteredCompanies}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        selectedSector={code}
      />
    </>
  );
}
