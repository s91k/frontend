import React from "react";
import { useTranslation } from "react-i18next";
import {
  sectorColors,
  getCompanyColors,
} from "@/hooks/companies/useCompanyFilters";
import { formatEmissionsAbsolute, formatPercent } from "@/utils/localizeUnit";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PieLegendEntry {
  name: string;
  value: number;
  total: number;
  sectorCode?: string;
  wikidataId?: string;
}

interface PieLegendProps {
  payload: PieLegendEntry[];
  selectedLabel: string | null;
  handlePieClick: (data: { sectorCode: string }) => void;
}

const SectorPieLegend: React.FC<PieLegendProps> = ({
  payload,
  selectedLabel,
  handlePieClick,
}) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const navigateToCompany = (wikidataId: string) => {
    window.location.href = `/companies/${wikidataId}`;
  };

  if (!payload) {
    return null;
  }

  const handleItemClick = (entry: PieLegendEntry) => {
    const isCompanyView = entry.wikidataId || entry.wikidataId;

    if (isCompanyView) {
      // If we're viewing companies within a sector, navigate to company detail page
      const wikidataId = entry.wikidataId || entry.wikidataId;
      if (wikidataId) {
        navigateToCompany(wikidataId);
      }
    } else {
      // If we're viewing sectors, handle the sector selection
      const sectorCode = entry.sectorCode || entry.sectorCode;
      if (sectorCode) {
        handlePieClick({ sectorCode });
      }
    }
  };

  return (
    <div className="w-full min-w-0 flex-1">
      <div className="container-type-inline-size w-full m-w-0 flex-1">
        <TooltipProvider>
          <div className="legend-list">
            {payload.map((entry, index) => {
              const value = entry.value || entry.value;
              const total = entry.total || entry.total;
              const percentage =
                value / total < 0.001
                  ? "<0.1%"
                  : formatPercent(value / total, currentLanguage);

              let color;
              if (selectedLabel) {
                color = getCompanyColors(index).base;
              } else if (entry.sectorCode || entry.sectorCode) {
                const sectorCode = entry.sectorCode || entry.sectorCode;
                color =
                  sectorColors[sectorCode as keyof typeof sectorColors]?.base;
              } else {
                color = "var(--grey)";
              }

              return (
                <Tooltip key={`legend-${index}`}>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center gap-2 p-2 rounded bg-black-2 hover:bg-black-1 transition-colors cursor-pointer ${
                        selectedLabel ? "hover:ring-1 hover:ring-black-1" : ""
                      }`}
                      onClick={() => handleItemClick(entry)}
                    >
                      <div
                        className="w-3 h-3 rounded-md flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-white truncate">
                          {entry.name || entry.value}
                        </div>
                        <div className="text-xs text-grey flex justify-between">
                          <span>
                            {formatEmissionsAbsolute(
                              Math.round(value),
                              currentLanguage,
                            )}{" "}
                            {t("emissionsUnit")}
                          </span>
                          <span>{percentage}</span>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black-1 text-white">
                    {selectedLabel
                      ? t("companiesPage.sectorGraphs.pieLegendCompany")
                      : t("companiesPage.sectorGraphs.pieLegendSector")}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SectorPieLegend;
