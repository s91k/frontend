import { useCategoryMetadata } from "@/hooks/companies/useCategories";
import { useTranslation } from "react-i18next";
import { formatEmissionsAbsolute } from "@/utils/localizeUnit";
import { useLanguage } from "@/components/LanguageProvider";
import { useScreenSize } from "@/hooks/useScreenSize";
import { AiIcon } from "@/components/ui/ai-icon";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  companyBaseYear: number | undefined;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  companyBaseYear,
}: CustomTooltipProps) => {
  const { t } = useTranslation();
  const { getCategoryName } = useCategoryMetadata();
  const { currentLanguage } = useLanguage();
  const { isMobile } = useScreenSize();

  if (active && payload && payload.length) {
    if (payload.length === 3) {
      const totalEmissions = payload[0]?.payload.total;

      const companyTotal = {
        dataKey: "total",
        name: t("companies.emissionsHistory.total"),
        color: "white",
        payload: {
          year: payload[0]?.payload.year,
          total: totalEmissions,
        },
        value: totalEmissions,
      };
      payload = [companyTotal, ...payload];
    }

    const isBaseYear = companyBaseYear === payload[0].payload.year;

    return (
      <div
        className={cn(
          isMobile ? "max-w-[280px]" : "max-w-[400px]",
          "bg-black-1 px-4 py-3 rounded-level-2",
          "grid grid-cols-[1fr_auto]",
        )}
      >
        <div className="text-sm font-medium mb-2 grid grid-cols-subgrid col-span-3">
          <span>
            {label}
            {isBaseYear ? "*" : ""}
          </span>
          <span className="flex justify-end">
            {t("companies.tooltip.tonsCO2e")}
          </span>
        </div>
        {payload.map((entry: any) => {
          if (entry.dataKey === "gap") return null;

          let name = entry.name;
          if (entry.dataKey.startsWith("cat")) {
            const categoryId = parseInt(entry.dataKey.replace("cat", ""));
            name = `${categoryId.toLocaleString()}. ${getCategoryName(categoryId)}`;
          }

          // Extract the original value from payload
          const originalValue = entry.payload?.originalValues?.[entry.dataKey];

          // Check if data is AI-generated
          let isDataAI = false;
          if (entry.dataKey === "scope1.value") {
            isDataAI = entry.payload.scope1?.isAIGenerated;
          } else if (entry.dataKey === "scope2.value") {
            isDataAI = entry.payload.scope2?.isAIGenerated;
          } else if (entry.dataKey === "scope3.value") {
            isDataAI = entry.payload.scope3?.isAIGenerated;
          } else if (entry.dataKey && entry.dataKey.startsWith("cat")) {
            const catId = parseInt(entry.dataKey.replace("cat", ""));
            isDataAI = entry.payload.scope3Categories?.find(
              (c: any) => c.category === catId,
            )?.isAIGenerated;
          } else if (entry.dataKey === "total") {
            isDataAI = entry.payload.isAIGenerated;
          }

          // Correctly display "No Data Available" if original value was null or undefined
          const displayValue =
            originalValue == null &&
            (entry.value == null || isNaN(entry.value) || entry.value == 0)
              ? t("companies.tooltip.noDataAvailable")
              : formatEmissionsAbsolute(
                  Math.round(entry.value ?? 0),
                  currentLanguage,
                );

          return (
            <div
              key={entry.dataKey}
              className={cn(
                `${entry.dataKey === "total" ? "my-2 font-medium" : "my-0"}`,
                "text-grey text-xs",
                "grid grid-cols-subgrid col-span-2 w-full ",
              )}
            >
              <div className="text-grey mr-2">{name}</div>
              <div
                className="flex pl-2 gap-1 justify-end"
                style={{ color: entry.color }}
              >
                {isDataAI && (
                  <span>
                    <AiIcon size="sm" />
                  </span>
                )}
                {displayValue}
              </div>
            </div>
          );
        })}
        {isBaseYear ? (
          <span className="text-grey mr-2 text-xs col-span-3">
            <br></br>* {t("companies.emissionsHistory.baseYearInfo")}
          </span>
        ) : null}
      </div>
    );
  }
  return null;
};
