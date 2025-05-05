import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import PieChartTooltip from "./tooltips/PieChartTooltip";
import CompanyTooltip from "./tooltips/CompanyTooltip";
import { SectorPieChartData } from "./SectorEmissionsChart";

interface PieChartViewProps {
  pieChartData: SectorPieChartData[];
  selectedLabel: string | null;
  size: { innerRadius: number; outerRadius: number };
  handlePieMouseEnter: (data: SectorPieChartData) => void;
  handlePieClick: (data: SectorPieChartData) => void;
  layout?: "desktop" | "mobile";
}

const PieChartView: React.FC<PieChartViewProps> = ({
  pieChartData,
  selectedLabel,
  size,
  handlePieMouseEnter,
  handlePieClick,
  layout,
}) => {
  const isDesktop = layout === "desktop";
  const innerRadius = isDesktop ? size.innerRadius * 1.2 : size.innerRadius;
  const outerRadius = isDesktop ? size.outerRadius * 1.2 : size.outerRadius;

  return (
    <div className="md:w-2/3 md:h-full w-full">
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
            {pieChartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            content={selectedLabel ? <CompanyTooltip /> : <PieChartTooltip />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartView;
