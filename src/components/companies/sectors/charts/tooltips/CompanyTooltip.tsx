import React from 'react';
import { TooltipProps } from 'recharts';

const CompanyTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { companyName, scope1, scope2, scope3, total } = payload[0].payload;

  return (
    <div className="bg-black-2 border border-black-1 rounded-lg shadow-xl p-4 text-white">
      <p className="text-sm font-medium mb-2">{companyName}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-grey">
          <span>Scope 1:</span>
          <span className="font-medium text-white">
            {Number(scope1).toLocaleString()} tCO₂e
          </span>
        </div>
        <div className="flex justify-between text-sm text-grey">
          <span>Scope 2:</span>
          <span className="font-medium text-white">
            {Number(scope2).toLocaleString()} tCO₂e
          </span>
        </div>
        <div className="flex justify-between text-sm text-grey">
          <span>Scope 3:</span>
          <span className="font-medium text-white">
            {Number(scope3).toLocaleString()} tCO₂e
          </span>
        </div>
        <div className="pt-2 border-t border-black-1">
          <div className="flex justify-between text-sm">
            <span className="text-grey">Total:</span>
            <span className="font-medium text-white">
              {Number(total).toLocaleString()} tCO₂e
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTooltip;