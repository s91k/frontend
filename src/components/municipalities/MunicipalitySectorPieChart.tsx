import React, { useEffect, useState } from "react";
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
import { formatEmissionsAbsolute } from "@/utils/localizeUnit";
import { SectorEmissions } from "@/types/municipality";
import { SECTOR_COLORS } from "@/constants/colors";
import { useResponsiveChartSize } from "@/hooks/useResponsiveChartSize";
import { X } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";

interface MunicipalitySectorPieChartProps {
  sectorEmissions: SectorEmissions;
  year: number;
  filteredSectors?: Set<string>;
  onFilteredSectorsChange?: (sectors: Set<string>) => void;
}

interface SectorData {
  name: string;
  value: number;
  color: string;
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

  const handleSectorClick = (data: SectorData) => {
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
    const [closed, setClosed] = useState(false);
    const { isMobile } = useScreenSize();

    // Reset closed state when tooltip is re-activated or payload changes
    useEffect(() => {
      if (active) {
        setClosed(false);
      }
    }, []);

    if (!active || !payload || !payload.length || closed) {
      return null;
    }

    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black-2 border border-black-1 rounded-lg shadow-xl p-4 text-white">
          <div className="flex justify-end items-center relative z-30">
            {isMobile && (
              <button
                title="Close"
                className="flex"
                style={{ pointerEvents: "auto" }}
                onClick={() => setClosed(true)}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="text-sm font-medium mb-2">{data.name}</div>
          <div className="text-sm">
            <span className="text-grey mr-2">{t("emissions.total")}:</span>
            <span style={{ color: data.color }}>
              {formatEmissionsAbsolute(data.value, currentLanguage)}{" "}
              {t("emissionsUnit")}
            </span>
          </div>
          <div className="text-xs italic text-blue-2 mt-2">
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
