import React from "react";
import { TrendData } from "@/types/company";
import TrendCard from "./TrendCard";
import { categoryInfo } from "@/utils/trendCategories";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface TrendCardsProps {
  trends: TrendData;
  selectedCategory: "decreasing" | "increasing" | "noComparable" | null;
  onCategorySelect: (
    category: "decreasing" | "increasing" | "noComparable" | null
  ) => void;
}

const TrendCards: React.FC<TrendCardsProps> = ({
  trends,
  selectedCategory,
  onCategorySelect,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={`grid ${isMobile ? "grid-cols-1" : "md:grid-cols-3"} gap-6`}
    >
      {(Object.keys(trends) as Array<keyof TrendData>).map((category) => (
        <TrendCard
          key={category}
          category={category}
          data={trends[category]}
          isSelected={selectedCategory === category}
          onSelect={() =>
            !selectedCategory ? onCategorySelect(category) : null
          }
          onClose={() => onCategorySelect(null)}
          info={categoryInfo[category]}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default TrendCards;
