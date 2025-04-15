import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DownloadControlsProps {
  onSelectionChange: (
    type: "companies" | "municipalities",
    year: string | null
  ) => void;
  years: string[];
}

export function DownloadControls({
  onSelectionChange,
  years,
}: DownloadControlsProps) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<
    "companies" | "municipalities"
  >("companies");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    onSelectionChange(selectedType, selectedYear);
  }, [selectedType, selectedYear, onSelectionChange]);

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1 space-y-2">
        <label className="text-sm text-grey">
          {t("downloadsPage.selectType")}
        </label>
        <Select
          value={selectedType}
          onValueChange={(value: "companies" | "municipalities") =>
            setSelectedType(value)
          }
        >
          <SelectTrigger className="w-full bg-black-2 border-black-1">
            <SelectValue placeholder={t("downloadsPage.selectType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="companies">
              {t("downloadsPage.companies")}
            </SelectItem>
            <SelectItem value="municipalities">
              {t("downloadsPage.municipalities")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedType === "companies" && (
        <div className="flex-1 space-y-2">
          <label className="text-sm text-grey">
            {t("downloadsPage.selectYear")}
          </label>
          <Select
            value={selectedYear || "all"}
            onValueChange={(value) =>
              setSelectedYear(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full bg-black-2 border-black-1">
              <SelectValue placeholder={t("downloadsPage.selectYear")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("downloadsPage.allYears")}</SelectItem>
              {[...years].reverse().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
