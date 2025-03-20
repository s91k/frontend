import React from "react";

interface CustomLegendProps {
  payload: any[];
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  if (!payload) return null;

  const sectorGroups = payload.reduce((acc: { [key: string]: any[] }, item) => {
    const [sector] = item.value.split("_scope");
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap justify-center gap-6 pt-4">
      {Object.entries(sectorGroups).map(([sector, items]) => {
        // Sort items by scope number
        const sortedItems = items.sort((a, b) => {
          const scopeA = parseInt(a.value.split("_scope")[1]);
          const scopeB = parseInt(b.value.split("_scope")[1]);
          return scopeA - scopeB;
        });

        // Get the first item's color for the sector indicator
        const sectorColor = sortedItems[0]?.color || "#888888";

        return (
          <div key={sector} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: sectorColor }}
            />
            <span className="text-sm font-medium text-white">{sector}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;
