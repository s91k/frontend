import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import PieChartTooltip from "./sectors/charts/tooltips/PieChartTooltip";
import CompanyTooltip from "./sectors/charts/tooltips/CompanyTooltip";

interface PieChartData {
  name: string;
  value: number;
  color: string;
  category?: number;
}

interface PieChartViewProps {
  pieChartData: PieChartData[];
  selectedLabel: string | null;
  size: { innerRadius: number; outerRadius: number };
  handlePieClick?: (data: PieChartData) => void;
  layout?: "desktop" | "mobile";
  navigable?: boolean;
  filterable?: boolean;
  filteredCategories?: Set<string>;
  onFilteredCategoriesChange?: (categories: Set<string>) => void;
}

const PieChartView: React.FC<PieChartViewProps> = ({
  pieChartData,
  selectedLabel,
  size,
  handlePieClick,
  layout,
  navigable = false,
  filterable = false,
  filteredCategories = new Set(),
  onFilteredCategoriesChange,
}) => {
  const isDesktop = layout === "desktop";
  const innerRadius = isDesktop ? size.innerRadius * 1.2 : size.innerRadius;
  const outerRadius = isDesktop ? size.outerRadius * 1.2 : size.outerRadius;

  const handleCategoryClick = (data: PieChartData) => {
    if (filterable && onFilteredCategoriesChange) {
      const categoryName = data.name;
      const newFiltered = new Set(filteredCategories);
      if (newFiltered.has(categoryName)) {
        newFiltered.delete(categoryName);
      } else {
        newFiltered.add(categoryName);
      }
      onFilteredCategoriesChange(newFiltered);
    }

    // Call the original handlePieClick if it exists
    if (handlePieClick) {
      handlePieClick(data);
    }
  };

  // Filter out the categories that are in filteredCategories
  const filteredData = pieChartData.filter(
    (entry) => !filteredCategories.has(entry.name),
  );

  return (
    <ResponsiveContainer width="100%" height={outerRadius * 2.5}>
      <PieChart>
        <Pie
          data={filteredData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          onClick={handleCategoryClick}
          cornerRadius={8}
          paddingAngle={2}
        >
          {filteredData.map((entry) => (
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
