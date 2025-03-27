import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CompanyDetails as Company, RankedCompany } from "@/types/company";
import { getSectorColor, getCompanyColorPalette } from "@/utils/colorPalettes";
import { EmissionsUtils, EmissionsValue } from "@/types/emissions";

export const SECTOR_NAMES = {
  "10": "Energi",
  "15": "Material",
  "20": "Industri",
  "25": "Sällanköpsvaror",
  "30": "Dagligvaror",
  "35": "Hälsovård",
  "40": "Finans",
  "45": "IT",
  "50": "Kommunikation",
  "55": "Kraftförsörjning",
  "60": "Fastigheter",
} as const;

export type SectorCode = keyof typeof SECTOR_NAMES;

export const SECTOR_ORDER: SectorCode[] = [
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
  "60",
];

export const SECTORS = [
  { value: "all", label: "Alla sektorer" },
  ...Object.entries(SECTOR_NAMES).map(([code, name]) => ({
    value: code,
    label: name,
  })),
] as const;

export type CompanySector = (typeof SECTORS)[number]["value"];

// Hook to get translated sector names
export const useSectorNames = () => {
  const { t } = useTranslation();

  return {
    "10": t("sector.energy"),
    "15": t("sector.materials"),
    "20": t("sector.industrials"),
    "25": t("sector.consumerDiscretionary"),
    "30": t("sector.consumerStaples"),
    "35": t("sector.healthCare"),
    "40": t("sector.financials"),
    "45": t("sector.informationTechnology"),
    "50": t("sector.communicationServices"),
    "55": t("sector.utilities"),
    "60": t("sector.realEstate"),
  } as const;
};

// Hook to get translated sectors for dropdown
export const useSectors = () => {
  const { t } = useTranslation();
  const sectorNames = useSectorNames();

  // Cast the first item to the expected type
  const allSectorsOption = {
    value: "all" as "all",
    label: t("companiesPage.allSectors") as "Alla sektorer",
  };

  // Create the sector options with the correct types
  const sectorOptions = Object.entries(sectorNames).map(([value, label]) => ({
    value,
    label: label as
      | "Energi"
      | "Material"
      | "Industri"
      | "Sällanköpsvaror"
      | "Dagligvaror"
      | "Hälsovård"
      | "Finans"
      | "IT"
      | "Kommunikation"
      | "Kraftförsörjning"
      | "Fastigheter",
  }));

  // Filter out the "all" option from the sector options
  const filteredOptions = sectorOptions.filter(
    (option) => option.value !== "all"
  );

  // Return the array with the correct type
  return [allSectorsOption, ...filteredOptions] as const;
};

export const useSortOptions = () => {
  const { t } = useTranslation();

  return [
    {
      value: "emissions_reduction",
      label: t("companiesPage.sortingOptions.emissionsChange"),
    },
    {
      value: "total_emissions",
      label: t("companiesPage.sortingOptions.totalEmissions"),
    },
    {
      value: "scope3_coverage",
      label: t("companiesPage.sortingOptions.scope3Coverage"),
    },
    {
      value: "name_asc",
      label: t("companiesPage.sortingOptions.nameAsc"),
    },
    {
      value: "name_desc",
      label: t("companiesPage.sortingOptions.nameDesc"),
    },
  ] as const;
};

export type SortOption =
  | "emissions_reduction"
  | "total_emissions"
  | "scope3_coverage"
  | "name_asc"
  | "name_desc";

export const useCompanyFilters = (companies: RankedCompany[]) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sectors, setSectors] = useState<CompanySector[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("total_emissions");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const sortOptions = useSortOptions();

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        // Filter by sector
        const matchesSector =
          sectors.length === 0 ||
          sectors.includes("all") ||
          (company.industry?.industryGics?.sectorCode &&
            sectors.includes(company.industry.industryGics.sectorCode));

        // Filter by search query
        const matchesSearch =
          !searchQuery ||
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.industry?.industryGics?.sectorCode &&
            SECTOR_NAMES[company.industry.industryGics.sectorCode as SectorCode]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()));

        return matchesSector && matchesSearch;
      })
      .sort((a, b) => {
        // Get the total emissions for each company
        const emissionsA = getCompanyEmissions(a);
        const emissionsB = getCompanyEmissions(b);

        // Sort companies
        switch (sortBy) {
          case "emissions_reduction": {
            const aChange =
              ((a.reportingPeriods[0]?.emissions?.calculatedTotalEmissions ||
                0) -
                (a.reportingPeriods[1]?.emissions?.calculatedTotalEmissions ||
                  0)) /
              (a.reportingPeriods[1]?.emissions?.calculatedTotalEmissions || 1);
            const bChange =
              ((b.reportingPeriods[0]?.emissions?.calculatedTotalEmissions ||
                0) -
                (b.reportingPeriods[1]?.emissions?.calculatedTotalEmissions ||
                  0)) /
              (b.reportingPeriods[1]?.emissions?.calculatedTotalEmissions || 1);
            return sortDirection === "asc"
              ? aChange - bChange
              : bChange - aChange;
          }
          case "total_emissions": {
            // Handle null values in sorting
            if (emissionsA === null && emissionsB === null) return 0;
            if (emissionsA === null) return sortDirection === "asc" ? -1 : 1; // Null at start or end based on direction
            if (emissionsB === null) return sortDirection === "asc" ? 1 : -1;
            return sortDirection === "asc"
              ? emissionsA - emissionsB
              : emissionsB - emissionsA;
          }
          case "scope3_coverage": {
            const aCategories =
              a.reportingPeriods[0]?.emissions?.scope3?.categories?.length || 0;
            const bCategories =
              b.reportingPeriods[0]?.emissions?.scope3?.categories?.length || 0;
            return sortDirection === "asc"
              ? aCategories - bCategories
              : bCategories - aCategories;
          }
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          default:
            return sortDirection === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
        }
      });
  }, [companies, sectors, searchQuery, sortBy, sortDirection]);

  return {
    searchQuery,
    setSearchQuery,
    sectors,
    setSectors,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filteredCompanies,
    sortOptions,
  };
};

// Helper to get emissions consistently
const getCompanyEmissions = (company: RankedCompany): EmissionsValue => {
  if (!company.reportingPeriods || company.reportingPeriods.length === 0) {
    return null;
  }

  const latestPeriod = company.reportingPeriods[0];
  return EmissionsUtils.getTotal(latestPeriod.emissions);
};

// Remove any remaining color-related code and ensure we're using the imports
export function useSectorColors() {
  return (sectorCode: string) => getSectorColor(sectorCode);
}

export function useCompanyColors() {
  return (index: number) => getCompanyColorPalette(index);
}
