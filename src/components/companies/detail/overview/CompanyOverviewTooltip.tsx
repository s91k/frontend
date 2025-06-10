import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface CompanyOverviewTooltipProps {
  yearOverYearChange: number | null;
}

export function CompanyOverviewTooltip({
  yearOverYearChange,
}: CompanyOverviewTooltipProps) {
  const { t } = useTranslation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="w-4 h-4 mb-2" />
        </TooltipTrigger>
        <TooltipContent className="max-w-80">
          {yearOverYearChange != null ? (
            yearOverYearChange <= -0.8 || yearOverYearChange >= 0.8 ? (
              <>
                <p>{t("companies.card.emissionsChangeRateInfo")}</p>
                <p className="my-2">
                  {t("companies.card.emissionsChangeRateInfoExtended")}
                </p>
              </>
            ) : (
              <p>{t("companies.card.emissionsChangeRateInfo")}</p>
            )
          ) : (
            <p>{t("companies.card.noData")}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
