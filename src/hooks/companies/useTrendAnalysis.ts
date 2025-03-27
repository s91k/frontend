import { useMemo } from "react";
import { RankedCompany, TrendData } from "@/types/company";
import { TrendingDown, TrendingUp, MinusCircle } from "lucide-react";
import { TrendCardInfo } from "@/types/company";
import { useTranslation } from "react-i18next";
import { EmissionsUtils, EmissionsValue } from "@/types/emissions";

const getTotalEmissions = (emissions: any) => {
  if (!emissions) return 0;
  return (
    (emissions.scope1?.total || 0) +
    (emissions.scope2?.calculatedTotalEmissions || 0) +
    (emissions.scope3?.calculatedTotalEmissions || 0)
  );
};

export const useCategoryInfo = (): Record<string, TrendCardInfo> => {
  const { t } = useTranslation();

  return {
    decreasing: {
      title: t("companiesPage.sectorGraphs.decreasing"),
      icon: TrendingDown,
      color: "bg-green-5",
      textColor: "text-green-3",
    },
    increasing: {
      title: t("companiesPage.sectorGraphs.increasing"),
      icon: TrendingUp,
      color: "bg-orange-5",
      textColor: "text-orange-3",
    },
    noComparable: {
      title: t("companiesPage.sectorGraphs.noComparable"),
      icon: MinusCircle,
      color: "bg-blue-5",
      textColor: "text-blue-3",
    },
  };
};

export const useTrendAnalysis = (
  companies: RankedCompany[],
  selectedSectors: string[]
): TrendData => {
  return useMemo(() => {
    const trends: TrendData = {
      decreasing: [],
      increasing: [],
      noComparable: [],
    };

    companies.forEach((company) => {
      if (
        !selectedSectors.includes(
          company.industry?.industryGics.sectorCode || ""
        )
      ) {
        return;
      }

      const periods = company.reportingPeriods
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .filter((period) => period.startDate.startsWith("202"));

      if (periods.length < 2) {
        trends.noComparable.push(company);
        return;
      }

      const latestPeriod = periods[periods.length - 1];
      const baselinePeriod = periods[0];

      const latestEmissions = EmissionsUtils.getTotal(latestPeriod.emissions);
      const baselineEmissions = EmissionsUtils.getTotal(
        baselinePeriod.emissions
      );

      if (baselineEmissions === null) {
        trends.noComparable.push(company);
        return;
      }

      const changePercent = EmissionsUtils.percentChange(
        latestEmissions,
        baselineEmissions
      );

      if (Math.abs(changePercent) > 60) {
        trends.noComparable.push(company);
      } else if (changePercent < 0) {
        trends.decreasing.push({
          company,
          changePercent: changePercent ?? 0,
          baseYear: baselinePeriod.startDate.substring(0, 4),
          currentYear: latestPeriod.startDate.substring(0, 4),
          hasData: latestEmissions !== null && baselineEmissions !== null,
          noDataMessage:
            latestEmissions === null
              ? "Latest period has no data"
              : baselineEmissions === null
              ? "Previous period has no data"
              : "",
        });
      } else {
        trends.increasing.push({
          company,
          changePercent: changePercent ?? 0,
          baseYear: baselinePeriod.startDate.substring(0, 4),
          currentYear: latestPeriod.startDate.substring(0, 4),
          hasData: latestEmissions !== null && baselineEmissions !== null,
          noDataMessage:
            latestEmissions === null
              ? "Latest period has no data"
              : baselineEmissions === null
              ? "Previous period has no data"
              : "",
        });
      }
    });

    // Sort by percentage change
    trends.decreasing.sort((a, b) => a.changePercent - b.changePercent);
    trends.increasing.sort((a, b) => b.changePercent - a.changePercent);

    return trends;
  }, [companies, selectedSectors]);
};
