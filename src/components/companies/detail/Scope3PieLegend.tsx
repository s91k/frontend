import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  formatEmissionsAbsolute,
  formatPercent,
} from "@/utils/formatting/localization";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AiIcon } from "@/components/ui/ai-icon";
import { useCategoryMetadata } from "@/hooks/companies/useCategories";
import { Text } from "@/components/ui/text";

interface PieLegendEntry {
  name: string;
  value: number;
  total: number;
  color: string;
  category: number;
  isAIGenerated: boolean;
}

interface PieLegendProps {
  payload: PieLegendEntry[];
  filteredCategories?: Set<string>;
  onFilteredCategoriesChange?: (categories: Set<string>) => void;
}

const Scope3PieLegend: React.FC<PieLegendProps> = ({
  payload,
  filteredCategories = new Set(),
  onFilteredCategoriesChange,
}) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { upstreamCategories, downstreamCategories } = useCategoryMetadata();

  if (!payload) {
    return null;
  }

  const handleLegendItemClick = (name: string) => {
    if (onFilteredCategoriesChange) {
      const newFiltered = new Set(filteredCategories);
      if (newFiltered.has(name)) {
        newFiltered.delete(name);
      } else {
        newFiltered.add(name);
      }
      onFilteredCategoriesChange(newFiltered);
    }
  };

  const renderTooltip = (entry: PieLegendEntry): ReactNode => {
    const { value, total } = entry;
    const percentage =
      value / total < 0.001
        ? "<0.1%"
        : formatPercent(value / total, currentLanguage);

    const color = entry.color || "var(--grey)";
    const isFiltered = filteredCategories.has(entry.name);

    return (
      <Tooltip key={`legend-${entry.category}`}>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-black-1 transition-colors cursor-pointer ${
              isFiltered ? "opacity-50" : ""
            }`}
            onClick={() => handleLegendItemClick(entry.name)}
          >
            <div
              className="w-3 h-3 rounded flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white">
                {`${entry.category}. ${entry.name || entry.value}`}
              </div>
              <div className="text-xs text-grey flex justify-between">
                <span>
                  {formatEmissionsAbsolute(Math.round(value), currentLanguage)}{" "}
                  {t("emissionsUnit")}
                  {entry.isAIGenerated && (
                    <span className="ml-2">
                      <AiIcon size="sm" />
                    </span>
                  )}
                </span>
                <span>{percentage}</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-black-1 text-white">
          {t(
            `companies.scope3Chart.${isFiltered ? "clickToShow" : "clickToFilter"}`,
          )}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2 max-h-300px md:max-h-500px overflow-y-auto w-full pr-2 my-2 md:my-4">
        <div className="w-full flex flex-col gap-2">
          <Text variant="h6" className="pl-7">
            {t("emissionsBreakdown.upstream")}
          </Text>
          {upstreamCategories
            .map((categoryId) =>
              payload.find(
                (entry: PieLegendEntry) => entry.category == categoryId,
              ),
            )
            .filter((entry) => entry != undefined)
            .map((entry) => renderTooltip(entry))}
        </div>

        <div className="w-full flex flex-col gap-2">
          <Text variant="h6" className="pl-7">
            {t("emissionsBreakdown.downstream")}
          </Text>
          {downstreamCategories
            .map((categoryId) =>
              payload.find(
                (entry: PieLegendEntry) => entry.category == categoryId,
              ),
            )
            .filter((entry) => entry != undefined)
            .map((entry) => renderTooltip(entry))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Scope3PieLegend;
