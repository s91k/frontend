import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExploreChart } from "./ExploreChart";
import { ChartData } from "@/types/emissions";
import { useTranslation } from "react-i18next";

interface ExploreModeProps {
  data: ChartData[];
  companyBaseYear?: number;
  currentLanguage: "sv" | "en";
  trendAnalysis?: {
    method: string;
    explanation: string;
    explanationParams?: Record<string, string | number>;
    coefficients?:
      | { slope: number; intercept: number }
      | { a: number; b: number };
    cleanData?: { year: number; value: number }[];
  } | null;
  yDomain: [number, number];
  onExit: () => void;
}

export function ExploreMode({
  data,
  companyBaseYear,
  currentLanguage,
  trendAnalysis,
  yDomain,
  onExit,
}: ExploreModeProps) {
  const { t } = useTranslation();

  // --- New logic for dynamic explore steps ---
  const hasDataBeforeBaseYear =
    companyBaseYear && data.some((d) => d.year < companyBaseYear);

  // Build steps dynamically
  const exploreSteps = [
    ...(hasDataBeforeBaseYear
      ? [
          {
            label: t("companies.emissionsHistory.exploreStep0Label"),
            description: t(
              "companies.emissionsHistory.exploreStep0Description",
            ),
          },
        ]
      : []),
    {
      label: t("companies.emissionsHistory.exploreStep1Label"),
      description: t("companies.emissionsHistory.exploreStep1Description"),
    },
    {
      label: t("companies.emissionsHistory.exploreStep2Label"),
      description: t("companies.emissionsHistory.exploreStep2Description"),
    },
    {
      label: t("companies.emissionsHistory.exploreStep3Label"),
      description: t("companies.emissionsHistory.exploreStep3Description"),
    },
    {
      label: t("companies.emissionsHistory.exploreStep4Label"),
      description: t("companies.emissionsHistory.exploreStep4Description"),
    },
    {
      label: t("companies.emissionsHistory.exploreStep5Label"),
      description: t("companies.emissionsHistory.exploreStep5Description"),
    },
  ];

  // Set initial step based on whether the first step exists
  const initialExploreStep = 0;
  const [exploreStep, setExploreStep] = useState(initialExploreStep);

  return (
    <div className="flex flex-col w-full bg-black-2 rounded-lg p-6">
      {/* Placeholder for animated/segmented chart for each step */}
      <div className="mb-4 text-center">
        <div className="text-lg font-bold mb-2">
          {exploreSteps[exploreStep].label}
        </div>
        <div className="text-grey text-base mb-4">
          {exploreSteps[exploreStep].description}
        </div>
      </div>

      {/* Render the explore chart, only show step 0 if it exists */}
      <div className="w-full h-[350px] mb-8">
        <ExploreChart
          data={data}
          step={exploreStep + (hasDataBeforeBaseYear ? 0 : 1)}
          companyBaseYear={companyBaseYear}
          currentLanguage={currentLanguage}
          trendExplanation={
            exploreStep === 2
              ? trendAnalysis?.explanation ||
                t("companies.emissionsHistory.trendExplanationFallback")
              : undefined
          }
          yDomain={yDomain}
          trendAnalysis={trendAnalysis}
        />
      </div>

      {/* Button controls - always below chart, never overlapping */}
      <div className="flex flex-row gap-4 justify-center pt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExploreStep((s) => Math.max(0, s - 1))}
          disabled={exploreStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("companies.emissionsHistory.exploreBackButton")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setExploreStep((s) => Math.min(exploreSteps.length - 1, s + 1))
          }
          disabled={exploreStep === exploreSteps.length - 1}
        >
          {t("companies.emissionsHistory.exploreNextButton")}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onExit();
            setExploreStep(initialExploreStep);
          }}
          className="ml-2"
        >
          {t("companies.emissionsHistory.exploreExitButton")}
        </Button>
      </div>
    </div>
  );
}
