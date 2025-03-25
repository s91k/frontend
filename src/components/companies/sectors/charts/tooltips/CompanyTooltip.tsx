import React from "react";
import { TooltipProps } from "recharts";

const CompanyTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value, payload: data } = payload[0];

  // Extract company data
  const companyName = name || data.name || "Unknown Company";
  const totalEmissions = value || 0;

  // Calculate percentage of sector total
  const percentage =
    totalEmissions && data.total
      ? ((totalEmissions / data.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="bg-black-2 border border-black-1 rounded-lg shadow-xl p-4 text-white">
      <p className="text-sm font-medium mb-2">{companyName}</p>
      <div className="text-sm text-grey space-y-1">
        <div className="flex justify-between">
          <span>Total Emissions: </span>
          <span className="text-white font-medium">
            {Math.round(totalEmissions).toLocaleString()} tCO₂e
          </span>
        </div>
        <div className="flex justify-between">
          <span>Percent of Sector: </span>
          <span className="text-white font-medium">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyTooltip;
