import { MunicipalityCard } from "./MunicipalityCard";
import type { Municipality } from "@/types/municipality";
import { forwardRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";

interface MunicipalityListProps {
  municipalities: Municipality[];
  selectedRegion: string;
  searchQuery: string;
  sortBy: "meets_paris" | "name";
  sortDirection: "best" | "worst";
}

const gridComponents = {
  List: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ style, children }, ref) => (
      <div
        ref={ref}
        style={style}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {children}
      </div>
    ),
  ),
  Item: ({ children }: React.HTMLAttributes<HTMLDivElement>) => children,
};

export function MunicipalityList({
  municipalities,
  selectedRegion,
  searchQuery,
  sortBy,
  sortDirection,
}: MunicipalityListProps) {
  const filteredMunicipalities = municipalities.filter((municipality) => {
    if (selectedRegion !== "all" && municipality.region !== selectedRegion) {
      return false;
    }

    if (searchQuery) {
      const searchTerms = searchQuery
        .toLowerCase()
        .split(",")
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

      return searchTerms.some((term) =>
        municipality.name.toLowerCase().startsWith(term),
      );
    }

    return true;
  });

  const sortedMunicipalities = filteredMunicipalities.sort((a, b) => {
    const directionMultiplier = sortDirection === "best" ? 1 : -1;
    switch (sortBy) {
      case "meets_paris": {
        const aMeetsParis = a.budgetRunsOut === "Håller budget";
        const bMeetsParis = b.budgetRunsOut === "Håller budget";
        if (aMeetsParis && bMeetsParis) {
          return (
            directionMultiplier *
            (new Date(a.hitNetZero).getTime() -
              new Date(b.hitNetZero).getTime())
          );
        }
        if (aMeetsParis) {
          return -1 * directionMultiplier;
        }
        if (bMeetsParis) {
          return 1 * directionMultiplier;
        }
        return (
          directionMultiplier *
          (new Date(b.budgetRunsOut).getTime() -
            new Date(a.budgetRunsOut).getTime())
        );
      }
      case "name":
        return directionMultiplier * a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      <VirtuosoGrid
        totalCount={sortedMunicipalities.length}
        data={sortedMunicipalities}
        components={gridComponents}
        useWindowScroll
        itemContent={(_index, municipality) => {
          return (
            <MunicipalityCard
              key={municipality.name}
              municipality={municipality}
            />
          );
        }}
      />
    </div>
  );
}
