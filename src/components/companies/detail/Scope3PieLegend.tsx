import React from "react";
import { useTranslation } from "react-i18next";
import { formatEmissionsAbsolute, formatPercent } from "@/utils/localizeUnit";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PieLegendProps {
  payload: {
    name: string;
    value: number;
    total: number;
    color: string;
  }[];
}

const Scope3PieLegend: React.FC<PieLegendProps> = ({ payload }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  if (!payload) {
    return null;
  }

  const sortedPayload = [...payload].sort((a, b) => {
    const aValue = a.value ?? 0;
    const bValue = b.value ?? 0;
    return bValue - aValue;
  });

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-300px md:max-h-500px overflow-y-auto w-full pr-2 mt-2 md:mt-4">
        {sortedPayload.map((entry, index) => {
          const { value, total } = entry;
          const percentage =
            value / total < 0.001
              ? "<0.1%"
              : formatPercent(value / total, currentLanguage);

          const color = entry.color || "var(--grey)";

          return (
            <Tooltip key={`legend-${index}`}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-black-1 transition-colors">
                  <div
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white">
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
                {t("companiesPage.sectorGraphs.pieLegendSector")}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default Scope3PieLegend;
