import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  sectorColors,
  getCompanyColors,
} from "@/hooks/companies/useCompanyFilters";
import PieChartTooltip from "./tooltips/PieChartTooltip";
import CompanyTooltip from "./tooltips/CompanyTooltip";
import PieLegend from "./PieLegend";
import { SectorPieChartData } from "./SectorEmissionsChart";

interface PieChartViewProps {
  pieChartData: SectorPieChartData[];
  selectedSector: string | null;
  size: { innerRadius: number; outerRadius: number };
  handlePieMouseEnter: (data: SectorPieChartData) => void;
  handlePieClick: (data: SectorPieChartData) => void;
  layout?: "desktop" | "mobile";
}

const PieChartView: React.FC<PieChartViewProps> = ({
  pieChartData,
  selectedSector,
  size,
  handlePieMouseEnter,
  handlePieClick,
  layout,
}) => {
  const isDesktop = layout === "desktop";
  const innerRadius = isDesktop ? size.innerRadius * 1.2 : size.innerRadius;
  const outerRadius = isDesktop ? size.outerRadius * 1.2 : size.outerRadius;

  return (
    <div className={isDesktop ? "flex gap-8" : "flex flex-col gap-4 mt-8"}>
      <div className={isDesktop ? "w-2/3 h-full" : "w-full"}>
        <ResponsiveContainer width="100%" height={outerRadius * 2.5}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              onMouseEnter={handlePieMouseEnter}
              onClick={handlePieClick}
              cornerRadius={8}
              paddingAngle={2}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    selectedSector
                      ? getCompanyColors(index).base
                      : "sectorCode" in entry
                        ? sectorColors[
                            entry.sectorCode as keyof typeof sectorColors
                          ]?.base || "#888888"
                        : "#888888"
                  }
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              content={
                selectedSector ? <CompanyTooltip /> : <PieChartTooltip />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={isDesktop ? "w-1/3 flex items-center" : "w-full"}>
        <PieLegend
          payload={pieChartData}
          selectedSector={selectedSector}
          handlePieClick={handlePieClick}
        />
      </div>
    </div>
  );
};

export default PieChartView;
