import { Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import type { CompanyDetails, ReportingPeriod } from "@/types/company";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";
import { useState } from "react";
import {
  useSectorNames,
  SectorCode,
} from "@/hooks/companies/useCompanyFilters";
import { useLanguage } from "@/components/LanguageProvider";
import {
  formatEmissionsAbsolute,
  formatEmployeeCount,
  formatPercentChange,
} from "@/utils/localizeUnit";
import { cn } from "@/lib/utils";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { AiIcon } from "@/components/ui/ai-icon";
import { OverviewStatistics } from "./OverviewStatistics";
import { CompanyOverviewTooltip } from "./CompanyOverviewTooltip";
import { CompanyDescription } from "./CompanyDescription";
import { calculateRateOfChange } from "@/lib/calculations/general";

import { dataGuideHelpItems } from "@/data-guide/guide-items";
import { DataGuideItem } from "@/data-guide/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface CompanyOverviewProps {
  company: CompanyDetails;
  selectedPeriod: ReportingPeriod;
  previousPeriod?: ReportingPeriod;
  onYearSelect: (year: string) => void;
  selectedYear: string;
}

// Alternative 1: Pill/Tag approach
interface HelpPillProps {
  item: DataGuideItem;
  isActive: boolean;
  onClick: () => void;
}

function HelpPill({ item, isActive, onClick }: HelpPillProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
        isActive
          ? "bg-blue-2 text-black"
          : "bg-blue-5/30 text-blue-1 hover:bg-blue-5/50",
      )}
    >
      {t(item.titleKey)}
    </button>
  );
}

// Alternative 2: Floating help panel
interface FloatingHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ key: string; item: DataGuideItem }>;
}

function FloatingHelpPanel({ isOpen, onClose, items }: FloatingHelpPanelProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-black-2 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text className="text-lg font-semibold">Data Guide</Text>
          <button onClick={onClose} className="text-grey hover:text-white">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {items.map(({ key, item }) => (
            <div
              key={key}
              className="border-b border-gray-600/30 pb-3 last:border-b-0"
            >
              <Text className="font-medium mb-2">{t(item.titleKey)}</Text>
              <Markdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  p: ({ children, ...props }) => (
                    <p
                      {...props}
                      className="text-sm text-gray-300 leading-relaxed"
                    >
                      {children}
                    </p>
                  ),
                }}
              >
                {t(item.contentKey, { joinArrays: "\n" })}
              </Markdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Alternative 3: Minimal accordion (current but smaller)
interface MinimalHelpItemProps {
  item: DataGuideItem;
  isOpen: boolean;
  onToggle: () => void;
}

function MinimalHelpItem({ item, isOpen, onToggle }: MinimalHelpItemProps) {
  const { t } = useTranslation();

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border-b border-gray-600/20 last:border-b-0"
    >
      <CollapsibleTrigger asChild>
        <button className="flex justify-between w-full py-2 items-center text-xs hover:text-blue-2 transition-colors">
          <span className="text-left">{t(item.titleKey)}</span>
          <ChevronDownIcon
            className={cn(
              "w-3 h-3 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-2 text-xs text-gray-300 leading-relaxed">
          <Markdown remarkPlugins={[remarkBreaks]}>
            {t(item.contentKey, { joinArrays: "\n" })}
          </Markdown>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Alternative 9: Progressive disclosure
interface ProgressiveHelpProps {
  items: Array<{ key: string; item: DataGuideItem }>;
  isOpen: boolean;
  onToggle: () => void;
  activeItem: string | null;
  onItemToggle: (key: string) => void;
}

function ProgressiveHelp({
  items,
  isOpen,
  onToggle,
  activeItem,
  onItemToggle,
}: ProgressiveHelpProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200",
          isOpen
            ? "bg-blue-5/40 text-blue-1"
            : "bg-gray-800/30 text-gray-300 hover:bg-gray-800/50",
        )}
      >
        <span className="w-4 h-4 rounded-full bg-blue-5/50 flex items-center justify-center text-xs">
          ?
        </span>
        <span>Help & Information</span>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 transition-transform ml-auto",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "transition-all duration-300 ease-out overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {isOpen && (
          <div className="bg-gray-800/20 rounded-md p-3 space-y-1">
            {items.map(({ key, item }) => (
              <div key={key}>
                <button
                  onClick={() => onItemToggle(key)}
                  className="flex justify-between w-full py-1.5 px-2 items-center text-xs hover:bg-gray-700/30 rounded transition-colors"
                >
                  <span className="text-left">{t(item.titleKey)}</span>
                  <ChevronDownIcon
                    className={cn(
                      "w-3 h-3 transition-transform",
                      activeItem === key && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "transition-all duration-200 ease-out overflow-hidden",
                    activeItem === key
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  {activeItem === key && (
                    <div className="px-2 pb-2 pt-1 text-xs text-gray-300 leading-relaxed">
                      <Markdown remarkPlugins={[remarkBreaks]}>
                        {t(item.contentKey, { joinArrays: "\n" })}
                      </Markdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Alternative 4: Tooltip approach
interface HelpTooltipProps {
  item: DataGuideItem;
}

function HelpTooltip({ item }: HelpTooltipProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-4 h-4 rounded-full bg-blue-5/50 text-blue-2 text-xs flex items-center justify-center hover:bg-blue-5/70 transition-colors"
      >
        ?
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black-1 border border-gray-600 rounded-md p-3 shadow-lg z-10">
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black-1"></div>
          <Text className="font-medium text-sm mb-1">{t(item.titleKey)}</Text>
          <Text className="text-xs text-gray-300 leading-relaxed">
            {t(item.contentKey, { joinArrays: "\n" })}
          </Text>
        </div>
      )}
    </div>
  );
}

// Alternative 5: Dropdown approach
interface HelpDropdownProps {
  items: Array<{ key: string; item: DataGuideItem }>;
  isOpen: boolean;
  onToggle: () => void;
}

function HelpDropdown({ items, isOpen, onToggle }: HelpDropdownProps) {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1 bg-blue-5/30 rounded-md text-sm hover:bg-blue-5/50 transition-colors"
      >
        <span>Help Topics</span>
        <ChevronDownIcon
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-black-1 border border-gray-600 rounded-md shadow-lg z-10">
          <div className="max-h-64 overflow-y-auto">
            {items.map(({ key, item }) => (
              <div
                key={key}
                className="border-b border-gray-600/30 last:border-b-0"
              >
                <button
                  onClick={() =>
                    setSelectedItem(selectedItem === key ? null : key)
                  }
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 flex justify-between items-center"
                >
                  <span>{t(item.titleKey)}</span>
                  <ChevronDownIcon
                    className={cn(
                      "w-3 h-3 transition-transform",
                      selectedItem === key && "rotate-180",
                    )}
                  />
                </button>
                {selectedItem === key && (
                  <div className="px-4 pb-3 text-xs text-gray-300 leading-relaxed border-t border-gray-600/20">
                    <Markdown remarkPlugins={[remarkBreaks]}>
                      {t(item.contentKey, { joinArrays: "\n" })}
                    </Markdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Alternative 6: Sidebar approach
interface HelpSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ key: string; item: DataGuideItem }>;
}

function HelpSidebar({ isOpen, onClose, items }: HelpSidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      )}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-black-2 shadow-lg transform transition-transform duration-300 z-50",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Data Guide</Text>
            <button onClick={onClose} className="text-grey hover:text-white">
              ✕
            </button>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-100px)] overflow-y-auto">
            {items.map(({ key, item }) => (
              <div key={key} className="bg-gray-800/30 rounded-md p-3">
                <Text className="font-medium text-sm mb-2">
                  {t(item.titleKey)}
                </Text>
                <Text className="text-xs text-gray-300 leading-relaxed">
                  {t(item.contentKey, { joinArrays: "\n" })}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Alternative 7: Tabs approach
interface HelpTabsProps {
  items: Array<{ key: string; item: DataGuideItem }>;
  activeTab: number;
  onTabChange: (index: number) => void;
}

function HelpTabs({ items, activeTab, onTabChange }: HelpTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800/30 rounded-md">
      <div className="flex border-b border-gray-600/30 overflow-x-auto">
        {items.map(({ key, item }, index) => (
          <button
            key={key}
            onClick={() => onTabChange(index)}
            className={cn(
              "px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === index
                ? "text-blue-2 border-b-2 border-blue-2"
                : "text-gray-400 hover:text-gray-200",
            )}
          >
            {t(item.titleKey)}
          </button>
        ))}
      </div>
      <div className="p-4">
        <Text className="text-xs text-gray-300 leading-relaxed">
          {t(items[activeTab]?.item.contentKey, { joinArrays: "\n" })}
        </Text>
      </div>
    </div>
  );
}

// Alternative 8: Bottom Sheet approach
interface HelpBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ key: string; item: DataGuideItem }>;
}

function HelpBottomSheet({ isOpen, onClose, items }: HelpBottomSheetProps) {
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      )}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-black-2 rounded-t-lg transform transition-transform duration-300 z-50",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="p-4">
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="flex justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Data Guide</Text>
            <button onClick={onClose} className="text-grey hover:text-white">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {items.map(({ key, item }) => (
              <div key={key} className="bg-gray-800/30 rounded-md p-3">
                <Text className="font-medium text-sm mb-2">
                  {t(item.titleKey)}
                </Text>
                <Text className="text-xs text-gray-300 leading-relaxed">
                  {t(item.contentKey, { joinArrays: "\n" })}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function CompanyOverview({
  company,
  selectedPeriod,
  previousPeriod,
  onYearSelect,
  selectedYear,
}: CompanyOverviewProps) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const sectorNames = useSectorNames();
  const { currentLanguage } = useLanguage();
  const { isAIGenerated, isEmissionsAIGenerated } = useVerificationStatus();
  const [activeHelpItem, setActiveHelpItem] = useState<string | null>(null);
  const [helpMode, setHelpMode] = useState<
    | "pills"
    | "floating"
    | "minimal"
    | "progressive"
    | "tooltips"
    | "dropdown"
    | "sidebar"
    | "tabs"
    | "bottomsheet"
  >("pills");
  const [showFloatingHelp, setShowFloatingHelp] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showHelpSection, setShowHelpSection] = useState(false);

  const periodYear = new Date(selectedPeriod.endDate).getFullYear();

  // Check if any data is AI-generated
  const totalEmissionsAIGenerated = isEmissionsAIGenerated(selectedPeriod);
  const yearOverYearAIGenerated =
    isEmissionsAIGenerated(selectedPeriod) ||
    (previousPeriod && isEmissionsAIGenerated(previousPeriod));
  const turnoverAIGenerated = isAIGenerated(selectedPeriod.economy?.turnover);
  const employeesAIGenerated = isAIGenerated(selectedPeriod.economy?.employees);

  // Get the translated sector name using the sector code
  const sectorCode = company.industry?.industryGics?.sectorCode as
    | SectorCode
    | undefined;
  const sectorName = sectorCode
    ? sectorNames[sectorCode]
    : company.industry?.industryGics?.sv?.sectorName ||
      company.industry?.industryGics?.en?.sectorName ||
      t("companies.overview.unknownSector");

  const yearOverYearChange = calculateRateOfChange(
    selectedPeriod?.emissions?.calculatedTotalEmissions,
    previousPeriod?.emissions?.calculatedTotalEmissions,
  );

  const sortedPeriods = [...company.reportingPeriods].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
  );

  const formattedEmployeeCount = selectedPeriod.economy?.employees?.value
    ? formatEmployeeCount(
        selectedPeriod.economy.employees.value,
        currentLanguage,
      )
    : t("companies.overview.notReported");

  return (
    <div className="bg-black-2 rounded-level-1 p-8 md:p-16">
      <div className="flex items-start justify-between mb-4 md:mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Text className="text-4xl lg:text-6xl">{company.name}</Text>
            <div className="flex flex-col h-full justify-around">
              {token && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 mt-2"
                  onClick={() => navigate("edit")}
                >
                  Edit
                  <div className="w-5 h-5 rounded-full bg-orange-5/30 text-orange-2 text-xs flex items-center justify-center">
                    <Pen />
                  </div>
                </Button>
              )}
            </div>
          </div>
          <CompanyDescription description={company.description} />
          <div className="flex flex-row items-center gap-2 my-4">
            <Text
              variant="body"
              className="text-grey text-sm md:text-base lg:text-lg"
            >
              {t("companies.overview.sector")}:
            </Text>
            <Text variant="body" className="text-sm md:text-base lg:text-lg">
              {sectorName}
            </Text>
          </div>
          <div className="my-4 w-full max-w-[180px]">
            <Select value={selectedYear} onValueChange={onYearSelect}>
              <SelectTrigger className="w-full bg-black-1 text-white px-3 py-2 rounded-md">
                <SelectValue placeholder={t("companies.overview.selectYear")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">
                  {t("companies.overview.latestYear")}
                </SelectItem>
                {sortedPeriods.map((period) => {
                  const year = new Date(period.endDate)
                    .getFullYear()
                    .toString();
                  return (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="hidden md:flex w-16 h-16 rounded-full bg-blue-5/30 items-center justify-center">
          <Building2 className="w-8 h-8 text-blue-2" />
        </div>
      </div>

      <div className="flex flex-col mb-6 gap-4 md:flex-row md:gap-12 md:items-start md:mb-12">
        <div className="flex-1">
          <Text
            variant="body"
            className="mb-1 md:mb-2 lg:text-lg md:text-base text-sm"
          >
            {t("companies.overview.totalEmissions")} {periodYear}
          </Text>
          <div className="flex items-baseline gap-4">
            <Text
              className={cn(
                "text-3xl md:text-4xl lg:text-6xl font-light tracking-tighter leading-none",
                selectedPeriod.emissions?.calculatedTotalEmissions === 0
                  ? "text-grey"
                  : "text-orange-2",
              )}
            >
              {!selectedPeriod.emissions ||
              selectedPeriod.emissions?.calculatedTotalEmissions === 0
                ? t("companies.overview.noData")
                : formatEmissionsAbsolute(
                    selectedPeriod.emissions.calculatedTotalEmissions,
                    currentLanguage,
                  )}
              <span className="text-lg lg:text-2xl md:text-lg sm:text-sm ml-2 text-grey">
                {t(
                  selectedPeriod.emissions?.calculatedTotalEmissions === 0
                    ? " "
                    : "emissionsUnit",
                )}
              </span>
            </Text>
            {totalEmissionsAIGenerated && (
              <span className="ml-2">
                <AiIcon size="md" />
              </span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Text className="mb-1 md:mb-2 lg:text-lg md:text-base sm:text-sm">
              {t("companies.overview.changeSinceLastYear")}
            </Text>
            <CompanyOverviewTooltip yearOverYearChange={yearOverYearChange} />
          </div>
          <Text className="text-3xl md:text-4xl lg:text-6xl font-light tracking-tighter leading-none">
            {yearOverYearChange !== null ? (
              <span
                className={
                  yearOverYearChange < 0 ? "text-orange-2" : "text-pink-3"
                }
              >
                {formatPercentChange(yearOverYearChange, currentLanguage, true)}
              </span>
            ) : (
              <span className="text-grey">
                {t("companies.overview.noData")}
              </span>
            )}
            {yearOverYearAIGenerated && (
              <span className="ml-2">
                <AiIcon size="md" />
              </span>
            )}
          </Text>
        </div>
      </div>

      <OverviewStatistics
        selectedPeriod={selectedPeriod}
        currentLanguage={currentLanguage}
        formattedEmployeeCount={formattedEmployeeCount}
        turnoverAIGenerated={turnoverAIGenerated}
        employeesAIGenerated={employeesAIGenerated}
        className="mt-3 md:mt-0"
      />

      <div className="mt-6">
        {/* Mode switcher for demo - remove in production */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setHelpMode("pills")}
            className={helpMode === "pills" ? "text-blue-2" : "text-grey"}
          >
            Pills
          </button>
          <button
            onClick={() => setHelpMode("floating")}
            className={helpMode === "floating" ? "text-blue-2" : "text-grey"}
          >
            Floating
          </button>
          <button
            onClick={() => setHelpMode("minimal")}
            className={helpMode === "minimal" ? "text-blue-2" : "text-grey"}
          >
            Minimal
          </button>
          <button
            onClick={() => setHelpMode("progressive")}
            className={helpMode === "progressive" ? "text-blue-2" : "text-grey"}
          >
            Progressive
          </button>
          <button
            onClick={() => setHelpMode("tooltips")}
            className={helpMode === "tooltips" ? "text-blue-2" : "text-grey"}
          >
            Tooltips
          </button>
          <button
            onClick={() => setHelpMode("dropdown")}
            className={helpMode === "dropdown" ? "text-blue-2" : "text-grey"}
          >
            Dropdown
          </button>
          <button
            onClick={() => setHelpMode("sidebar")}
            className={helpMode === "sidebar" ? "text-blue-2" : "text-grey"}
          >
            Sidebar
          </button>
          <button
            onClick={() => setHelpMode("tabs")}
            className={helpMode === "tabs" ? "text-blue-2" : "text-grey"}
          >
            Tabs
          </button>
          <button
            onClick={() => setHelpMode("bottomsheet")}
            className={helpMode === "bottomsheet" ? "text-blue-2" : "text-grey"}
          >
            Bottom Sheet
          </button>
        </div>

        {helpMode === "pills" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: "totalEmissions",
                  item: dataGuideHelpItems["totalEmissions"],
                },
                { key: "co2units", item: dataGuideHelpItems["co2units"] },
                {
                  key: "companySectors",
                  item: dataGuideHelpItems["companySectors"],
                },
                {
                  key: "companyMissingData",
                  item: dataGuideHelpItems["companyMissingData"],
                },
                {
                  key: "yearOverYearChange",
                  item: dataGuideHelpItems["yearOverYearChange"],
                },
              ].map(({ key, item }) => (
                <HelpPill
                  key={key}
                  item={item}
                  isActive={activeHelpItem === key}
                  onClick={() =>
                    setActiveHelpItem(activeHelpItem === key ? null : key)
                  }
                />
              ))}
            </div>
            <div
              className={cn(
                "transition-all duration-300 ease-out overflow-hidden",
                activeHelpItem ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {activeHelpItem && (
                <div className="bg-blue-5/20 rounded-md p-4 mt-3 transform translate-y-0 transition-all duration-300 ease-out">
                  <Markdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                      ol: ({ node, children, ...props }) => (
                        <ol
                          {...props}
                          className="list-decimal list-outside mt-2 text-sm"
                        >
                          {children}
                        </ol>
                      ),
                      ul: ({ node, children, ...props }) => (
                        <ul
                          {...props}
                          className="list-disc list-outside ml-3 mt-2 text-sm"
                        >
                          {children}
                        </ul>
                      ),
                      p: ({ node, children, ...props }) => (
                        <p
                          {...props}
                          className="my-1 first:mt-0 last:mb-0 whitespace-pre-wrap text-sm leading-relaxed"
                        >
                          {children}
                        </p>
                      ),
                    }}
                  >
                    {t(
                      dataGuideHelpItems[
                        activeHelpItem as keyof typeof dataGuideHelpItems
                      ].contentKey,
                      { joinArrays: "\n" },
                    )}
                  </Markdown>
                </div>
              )}
            </div>
          </div>
        )}

        {helpMode === "floating" && (
          <div>
            <button
              onClick={() => setShowFloatingHelp(true)}
              className="flex items-center gap-2 text-sm text-blue-2 hover:text-blue-1 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-5/30 flex items-center justify-center text-xs">
                ?
              </span>
              Data Guide
            </button>
            <FloatingHelpPanel
              isOpen={showFloatingHelp}
              onClose={() => setShowFloatingHelp(false)}
              items={[
                {
                  key: "totalEmissions",
                  item: dataGuideHelpItems["totalEmissions"],
                },
                { key: "co2units", item: dataGuideHelpItems["co2units"] },
                {
                  key: "companySectors",
                  item: dataGuideHelpItems["companySectors"],
                },
                {
                  key: "companyMissingData",
                  item: dataGuideHelpItems["companyMissingData"],
                },
                {
                  key: "yearOverYearChange",
                  item: dataGuideHelpItems["yearOverYearChange"],
                },
              ]}
            />
          </div>
        )}

        {helpMode === "minimal" && (
          <div className="bg-gray-800/30 rounded-md p-3">
            <Text className="text-xs text-grey mb-2">Help Topics</Text>
            {[
              {
                key: "totalEmissions",
                item: dataGuideHelpItems["totalEmissions"],
              },
              { key: "co2units", item: dataGuideHelpItems["co2units"] },
              {
                key: "companySectors",
                item: dataGuideHelpItems["companySectors"],
              },
              {
                key: "companyMissingData",
                item: dataGuideHelpItems["companyMissingData"],
              },
              {
                key: "yearOverYearChange",
                item: dataGuideHelpItems["yearOverYearChange"],
              },
            ].map(({ key, item }) => (
              <MinimalHelpItem
                key={key}
                item={item}
                isOpen={activeHelpItem === key}
                onToggle={() =>
                  setActiveHelpItem(activeHelpItem === key ? null : key)
                }
              />
            ))}
          </div>
        )}

        {helpMode === "progressive" && (
          <ProgressiveHelp
            items={[
              {
                key: "totalEmissions",
                item: dataGuideHelpItems["totalEmissions"],
              },
              { key: "co2units", item: dataGuideHelpItems["co2units"] },
              {
                key: "companySectors",
                item: dataGuideHelpItems["companySectors"],
              },
              {
                key: "companyMissingData",
                item: dataGuideHelpItems["companyMissingData"],
              },
              {
                key: "yearOverYearChange",
                item: dataGuideHelpItems["yearOverYearChange"],
              },
            ]}
            isOpen={showHelpSection}
            onToggle={() => setShowHelpSection(!showHelpSection)}
            activeItem={activeHelpItem}
            onItemToggle={(key) =>
              setActiveHelpItem(activeHelpItem === key ? null : key)
            }
          />
        )}

        {helpMode === "tooltips" && (
          <div className="flex items-center gap-4 flex-wrap">
            <Text className="text-sm text-grey">Hover or click for help:</Text>
            {[
              {
                key: "totalEmissions",
                item: dataGuideHelpItems["totalEmissions"],
              },
              { key: "co2units", item: dataGuideHelpItems["co2units"] },
              {
                key: "companySectors",
                item: dataGuideHelpItems["companySectors"],
              },
              {
                key: "companyMissingData",
                item: dataGuideHelpItems["companyMissingData"],
              },
              {
                key: "yearOverYearChange",
                item: dataGuideHelpItems["yearOverYearChange"],
              },
            ].map(({ key, item }) => (
              <HelpTooltip key={key} item={item} />
            ))}
          </div>
        )}

        {helpMode === "dropdown" && (
          <HelpDropdown
            items={[
              {
                key: "totalEmissions",
                item: dataGuideHelpItems["totalEmissions"],
              },
              { key: "co2units", item: dataGuideHelpItems["co2units"] },
              {
                key: "companySectors",
                item: dataGuideHelpItems["companySectors"],
              },
              {
                key: "companyMissingData",
                item: dataGuideHelpItems["companyMissingData"],
              },
              {
                key: "yearOverYearChange",
                item: dataGuideHelpItems["yearOverYearChange"],
              },
            ]}
            isOpen={showDropdown}
            onToggle={() => setShowDropdown(!showDropdown)}
          />
        )}

        {helpMode === "sidebar" && (
          <div>
            <button
              onClick={() => setShowSidebar(true)}
              className="flex items-center gap-2 text-sm text-blue-2 hover:text-blue-1 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-5/30 flex items-center justify-center text-xs">
                📖
              </span>
              Open Help Sidebar
            </button>
            <HelpSidebar
              isOpen={showSidebar}
              onClose={() => setShowSidebar(false)}
              items={[
                {
                  key: "totalEmissions",
                  item: dataGuideHelpItems["totalEmissions"],
                },
                { key: "co2units", item: dataGuideHelpItems["co2units"] },
                {
                  key: "companySectors",
                  item: dataGuideHelpItems["companySectors"],
                },
                {
                  key: "companyMissingData",
                  item: dataGuideHelpItems["companyMissingData"],
                },
                {
                  key: "yearOverYearChange",
                  item: dataGuideHelpItems["yearOverYearChange"],
                },
              ]}
            />
          </div>
        )}

        {helpMode === "tabs" && (
          <HelpTabs
            items={[
              {
                key: "totalEmissions",
                item: dataGuideHelpItems["totalEmissions"],
              },
              { key: "co2units", item: dataGuideHelpItems["co2units"] },
              {
                key: "companySectors",
                item: dataGuideHelpItems["companySectors"],
              },
              {
                key: "companyMissingData",
                item: dataGuideHelpItems["companyMissingData"],
              },
              {
                key: "yearOverYearChange",
                item: dataGuideHelpItems["yearOverYearChange"],
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {helpMode === "bottomsheet" && (
          <div>
            <button
              onClick={() => setShowBottomSheet(true)}
              className="flex items-center gap-2 text-sm text-blue-2 hover:text-blue-1 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-5/30 flex items-center justify-center text-xs">
                ↗
              </span>
              Show Help Sheet
            </button>
            <HelpBottomSheet
              isOpen={showBottomSheet}
              onClose={() => setShowBottomSheet(false)}
              items={[
                {
                  key: "totalEmissions",
                  item: dataGuideHelpItems["totalEmissions"],
                },
                { key: "co2units", item: dataGuideHelpItems["co2units"] },
                {
                  key: "companySectors",
                  item: dataGuideHelpItems["companySectors"],
                },
                {
                  key: "companyMissingData",
                  item: dataGuideHelpItems["companyMissingData"],
                },
                {
                  key: "yearOverYearChange",
                  item: dataGuideHelpItems["yearOverYearChange"],
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
