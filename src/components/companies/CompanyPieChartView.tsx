import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import PieChartTooltip from "./sectors/charts/tooltips/PieChartTooltip";
import CompanyTooltip from "./sectors/charts/tooltips/CompanyTooltip";
import { SectorPieChartData } from "./sectors/charts/SectorEmissionsChart";

interface PieChartViewProps {
  pieChartData: SectorPieChartData[];
  selectedLabel: string | null;
  size: { innerRadius: number; outerRadius: number };
  handlePieMouseEnter?: (data: SectorPieChartData) => void;
  handlePieClick?: (data: SectorPieChartData) => void;
  layout?: "desktop" | "mobile";
  navigable?: boolean;
}

const PieChartView: React.FC<PieChartViewProps> = ({
  pieChartData,
  selectedLabel,
  size,
  handlePieClick,
  layout,
  navigable = false,
}) => {
  const isDesktop = layout === "desktop";
  const innerRadius = isDesktop ? size.innerRadius * 1.2 : size.innerRadius;
  const outerRadius = isDesktop ? size.outerRadius * 1.2 : size.outerRadius;

  return (
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
          onClick={handlePieClick}
          cornerRadius={8}
          paddingAngle={2}
        >
          {pieChartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.color}
              stroke={entry.color}
              style={navigable ? { cursor: "pointer" } : undefined}
            />
          ))}
        </Pie>
        <Tooltip
          content={selectedLabel ? <CompanyTooltip /> : <PieChartTooltip />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartView;
