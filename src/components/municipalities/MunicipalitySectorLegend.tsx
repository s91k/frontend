import React from "react";
import { useTranslation } from "react-i18next";
import { formatEmissionsAbsolute, formatPercent } from "@/utils/localizeUnit";
import { useLanguage } from "@/components/LanguageProvider";

interface LegendProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  total: number;
}

const MunicipalitySectorLegend: React.FC<LegendProps> = ({ data, total }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-300px md:max-h-500px overflow-y-auto w-full pr-2 mt-2 md:mt-4">
      {data.map((entry, index) => {
        const percentage = formatPercent(entry.value / total, currentLanguage);

        return (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-black-1 transition-colors"
          >
            <div
              className="w-3 h-3 rounded flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white">{entry.name}</div>
              <div className="text-xs text-grey flex justify-between">
                <span>
                  {formatEmissionsAbsolute(
                    Math.round(entry.value),
                    currentLanguage,
                  )}{" "}
                  {t("emissionsUnit")}
                </span>
                <span>{percentage}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MunicipalitySectorLegend;
