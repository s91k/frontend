import { Municipality } from "@/types/municipality";

interface InsightsListProps {
  title: string;
  municipalities: Municipality[];
  dataPointKey: keyof Municipality;
  unit: string;
  textColor: string;
  totalCount: number;
  isBottomRanking?: boolean;
}

function InsightsList({
  title,
  municipalities,
  dataPointKey,
  unit,
  textColor,
  totalCount,
  isBottomRanking = false,
}: InsightsListProps) {
  return (
    <div className="bg-white/10 rounded-level-2 p-4 md:p-6">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {municipalities.map((municipality, index) => {
          const position = isBottomRanking ? totalCount - index : index + 1;

          return (
            <div
              key={municipality.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-orange-2">{position}</span>
                <span>{municipality.name}</span>
              </div>
              <span className={`${textColor} font-semibold`}>
                {(municipality[dataPointKey] as number).toFixed(1)}
                {unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InsightsList;
