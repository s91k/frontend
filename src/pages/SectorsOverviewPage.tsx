import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCompanies } from "@/hooks/companies/useCompanies";
import { PageHeader } from "@/components/layout/PageHeader";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import SectorGraphs from "@/components/companies/sectors/SectorGraphs";
import { FilterPopover } from "@/components/explore/FilterPopover";
import { FilterBadges } from "@/components/companies/list/FilterBadges";
import { useCompanyFilters } from "@/hooks/companies/useCompanyFilters";
import { useSectorNames } from "@/hooks/companies/useCompanySectors";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { localizedPath } from "@/utils/routing";
import { useLanguage } from "@/components/LanguageProvider";

export function SectorsOverviewPage() {
  const { code } = useParams<{ code?: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const screenSize = useScreenSize();
  const { companies, companiesLoading, companiesError } = useCompanies();
  const [filterOpen, setFilterOpen] = useState(false);
  const sectorNames = useSectorNames();

  const { filteredCompanies, filterGroups, activeFilters } = useCompanyFilters(
    companies,
    { includeSectorFilter: false },
  );

  if (companiesLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-black-2 rounded-level-2" />
        ))}
      </div>
    );
  }

  if (companiesError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-light text-red-500">
          {t("sectorsOverviewPage.errorTitle")}
        </h2>
        <p className="text-grey mt-2">
          {t("sectorsOverviewPage.errorDescription")}
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader variant="title-only" title={t("sectorsOverviewPage.title")} />

      {/* Filters Section */}
      <div
        className={cn(
          screenSize.isMobile ? "relative" : "sticky top-0 z-10",
          "bg-black shadow-md",
        )}
      >
        <div className="absolute inset-0 w-full bg-black -z-10" />

        {/* Wrapper for Filters and Badges */}
        <div className={cn("flex flex-wrap items-center gap-2 mb-2 md:mb-4")}>
          {code && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(localizedPath(currentLanguage, `/sectors${location.search}`))
              }
              className="bg-black-2 border-black-1 text-white hover:bg-black-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("sectorsOverviewPage.overview")}
            </Button>
          )}

          {/* Filter Button */}
          <FilterPopover
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            groups={filterGroups}
          />

          {/* Badges */}
          {activeFilters.length > 0 && (
            <div
              className={cn(
                "flex flex-wrap gap-2",
                screenSize.isMobile ? "w-full" : "flex-1",
              )}
            >
              <FilterBadges filters={activeFilters} view="graphs" />
            </div>
          )}
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-light text-grey">
            {t("sectorsOverviewPage.noCompaniesFound")}
          </h3>
          <p className="text-grey mt-2">
            {t("sectorsOverviewPage.tryDifferentCriteria")}
          </p>
        </div>
      ) : (
        <SectorGraphs
          companies={filteredCompanies}
          sectors={Object.keys(sectorNames).filter((key) => key !== "all")}
          selectedSector={code ?? null}
        />
      )}
    </>
  );
}
