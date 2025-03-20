import React, { useState } from "react";
import { TrendingDown, TrendingUp, MinusCircle, X } from "lucide-react";
import { RankedCompany } from "@/hooks/companies/useCompanies";

interface EmissionsTrendAnalysisProps {
  companies: RankedCompany[];
  selectedSectors: string[];
}

interface TrendData {
  decreasing: Array<{
    company: RankedCompany;
    changePercent: number;
    baseYear: string;
    currentYear: string;
  }>;
  increasing: Array<{
    company: RankedCompany;
    changePercent: number;
    baseYear: string;
    currentYear: string;
  }>;
  noComparable: RankedCompany[];
}

interface CategoryInfo {
  title: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
}

const categoryInfo: Record<keyof TrendData, CategoryInfo> = {
  decreasing: {
    title: "Companies Reducing Emissions",
    icon: TrendingDown,
    color: "bg-green-5",
    textColor: "text-green-3",
  },
  increasing: {
    title: "Companies Increasing Emissions",
    icon: TrendingUp,
    color: "bg-orange-5",
    textColor: "text-orange-3",
  },
  noComparable: {
    title: "No Comparable Data",
    icon: MinusCircle,
    color: "bg-blue-5",
    textColor: "text-blue-3",
  },
};

const EmissionsTrendAnalysis: React.FC<EmissionsTrendAnalysisProps> = ({
  companies,
  selectedSectors,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    keyof TrendData | null
  >(null);

  const getTotalEmissions = (emissions: any) => {
    if (!emissions) return 0;
    return (
      (emissions.scope1?.total || 0) +
      (emissions.scope2?.calculatedTotalEmissions || 0) +
      (emissions.scope3?.calculatedTotalEmissions || 0)
    );
  };

  const analyzeTrends = () => {
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

      const latestEmissions = getTotalEmissions(latestPeriod.emissions);
      const baselineEmissions = getTotalEmissions(baselinePeriod.emissions);

      if (baselineEmissions === 0) {
        trends.noComparable.push(company);
        return;
      }

      const changePercent =
        ((latestEmissions - baselineEmissions) / baselineEmissions) * 100;

      if (Math.abs(changePercent) > 80) {
        trends.noComparable.push(company);
      } else if (changePercent < 0) {
        trends.decreasing.push({
          company,
          changePercent,
          baseYear: baselinePeriod.startDate.substring(0, 4),
          currentYear: latestPeriod.startDate.substring(0, 4),
        });
      } else {
        trends.increasing.push({
          company,
          changePercent,
          baseYear: baselinePeriod.startDate.substring(0, 4),
          currentYear: latestPeriod.startDate.substring(0, 4),
        });
      }
    });

    // Sort by percentage change
    trends.decreasing.sort((a, b) => a.changePercent - b.changePercent);
    trends.increasing.sort((a, b) => b.changePercent - a.changePercent);

    return trends;
  };

  const trends = analyzeTrends();

  const TrendCard = ({
    category,
    data,
  }: {
    category: keyof TrendData;
    data: (typeof trends)[keyof TrendData];
  }) => {
    const info = categoryInfo[category];
    const Icon = info.icon;
    const isSelected = selectedCategory === category;

    return (
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isSelected ? "col-span-3 h-[400px]" : "cursor-pointer hover:scale-102"
        }`}
        onClick={() => !isSelected && setSelectedCategory(category)}
      >
        <div
          className={`
          bg-black-1 border border-black-2 rounded-lg p-6
          transition-all duration-300 ease-in-out
          ${
            isSelected ? "h-full overflow-hidden" : "flex flex-col items-center"
          }
        `}
        >
          {isSelected ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${info.color}`}>
                    <Icon className={`h-5 w-5 ${info.textColor}`} />
                  </div>
                  <h3 className="text-xl font-light text-white">
                    {info.title}
                  </h3>
                  <span className="text-sm text-grey">({data.length})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(null);
                  }}
                  className="text-grey hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)] pr-2 space-y-2">
                {category === "noComparable"
                  ? (data as RankedCompany[]).map((company) => (
                      <div
                        key={company.wikidataId}
                        className="bg-black-2 rounded-lg px-4 py-3 text-sm"
                      >
                        <div className="font-medium text-white mb-1">
                          {company.name}
                        </div>
                        {company.description && (
                          <div className="text-grey">{company.description}</div>
                        )}
                      </div>
                    ))
                  : (
                      data as Array<{
                        company: RankedCompany;
                        changePercent: number;
                        baseYear: string;
                        currentYear: string;
                      }>
                    ).map(
                      ({ company, changePercent, baseYear, currentYear }) => (
                        <div
                          key={company.wikidataId}
                          className="bg-black-2 rounded-lg px-4 py-3 text-sm"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-white">
                              {company.name}
                            </div>
                            <div
                              className={`text-sm ${
                                category === "decreasing"
                                  ? "text-green-3"
                                  : "text-orange-3"
                              }`}
                            >
                              {changePercent.toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-grey text-xs">
                            Base year: {baseYear} → Current: {currentYear}
                          </div>
                          {company.description && (
                            <div className="text-grey mt-1">
                              {company.description}
                            </div>
                          )}
                        </div>
                      )
                    )}
              </div>
            </>
          ) : (
            <>
              <div className={`rounded-full p-3 ${info.color} mb-4`}>
                <Icon className={`h-6 w-6 ${info.textColor}`} />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">
                {data.length}
              </h3>
              <p className="text-sm text-grey text-center">{info.title}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-light text-white">
          Emissions Trend Analysis
        </h2>
        <span className="text-sm text-grey">(From Base Year)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(trends) as Array<keyof TrendData>).map((category) => (
          <TrendCard
            key={category}
            category={category}
            data={trends[category]}
          />
        ))}
      </div>
    </div>
  );
};

export default EmissionsTrendAnalysis;
