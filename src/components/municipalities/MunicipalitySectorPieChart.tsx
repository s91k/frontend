import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  TooltipProps,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/LanguageProvider";
import { formatEmissionsAbsolute, formatPercent } from "@/utils/localizeUnit";
import { SectorEmissions } from "@/types/municipality";
import { SECTOR_COLORS } from "@/constants/colors";
import { useResponsiveChartSize } from "@/hooks/useResponsiveChartSize";

interface MunicipalitySectorPieChartProps {
  sectorEmissions: SectorEmissions;
  year: number;
  filteredSectors?: Set<string>;
  onFilteredSectorsChange?: (sectors: Set<string>) => void;
}

const MunicipalitySectorPieChart: React.FC<MunicipalitySectorPieChartProps> = ({
  sectorEmissions,
  year,
  filteredSectors = new Set(),
  onFilteredSectorsChange,
}) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { size } = useResponsiveChartSize();

  const yearData = sectorEmissions.sectors[year] || {};
  const total = Object.values(yearData).reduce<number>(
    (sum, value) => sum + (value as number),
    0,
  );

  const pieData = Object.entries(yearData)
    .map(([sector, value]) => ({
      name: sector,
      value,
      color:
        SECTOR_COLORS[sector as keyof typeof SECTOR_COLORS] || "var(--grey)",
    }))
    .filter((item) => (item.value as number) > 0)
    .filter((item) => !filteredSectors.has(item.name))
    .sort((a, b) => (b.value as number) - (a.value as number));

  const handleSectorClick = (data: any) => {
    if (onFilteredSectorsChange) {
      const sectorName = data.name;
      const newFiltered = new Set(filteredSectors);
      if (newFiltered.has(sectorName)) {
        newFiltered.delete(sectorName);
      } else {
        newFiltered.add(sectorName);
      }
      onFilteredSectorsChange(newFiltered);
    }
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black-1 px-4 py-3 rounded-level-2">
          <div className="text-sm font-medium mb-2">{data.name}</div>
          <div className="text-sm">
            <span className="text-grey mr-2">{t("emissions.total")}:</span>
            <span style={{ color: data.color }}>
              {formatEmissionsAbsolute(data.value, currentLanguage)}{" "}
              {t("emissionsUnit")}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-grey mr-2">{t("percentage")}:</span>
            <span style={{ color: data.color }}>
              {formatPercent(data.value / total, currentLanguage)}
            </span>
          </div>
          <div className="text-xs text-grey mt-2">
            {t(
              `municipalities.sectorChart.${
                filteredSectors.has(data.name) ? "clickToShow" : "clickToFilter"
              }`,
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-h-[450px]">
      <ResponsiveContainer width="100%" height={size.outerRadius * 2.5}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={size.innerRadius}
            outerRadius={size.outerRadius}
            cornerRadius={8}
            paddingAngle={2}
            onClick={handleSectorClick}
          >
            {pieData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                stroke={entry.color}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MunicipalitySectorPieChart;
