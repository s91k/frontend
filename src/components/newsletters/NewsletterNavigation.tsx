import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { newsletterList } from "@/lib/newsletterArchive/newsletterData";
import { NewsletterType } from "@/lib/newsletterArchive/newsletterData";

interface NewsletterNavigationProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  contentRef: React.RefObject<HTMLDivElement>;
  setDisplayedNewsletter: NewsletterType;
}

export function NewsletterNavigation({
  selectedMonth,
  onMonthChange,
  contentRef,
  setDisplayedNewsletter,
}: NewsletterNavigationProps) {
  const { t } = useTranslation();
  const [expandedYear, setExpandedYear] = useState<string[]>(
    Object.keys(newsletterList),
  );
  const { isMobile } = useScreenSize();

  useEffect(() => {
    if (isMobile) {
      setExpandedYear([]);
    } else {
      setExpandedYear(Object.keys(newsletterList));
    }
  }, [isMobile]);

  const toggleYear = (year: string) => {
    setExpandedYear((prev) =>
      prev.includes(year)
        ? prev.filter((cat) => cat !== year)
        : [...prev, year],
    );
  };

  // Scroll to MethodContent on mobile when a method is selected
  const handleMonthChange = (month: string) => {
    onMonthChange(month);
    if (isMobile && contentRef?.current) {
      setTimeout(() => {
        if (!contentRef.current) return;
        const headerHeight = window.innerWidth >= 1024 ? 48 : 40; // 48px for lg, 40px for mobile
        const rect = contentRef.current.getBoundingClientRect();
        const scrollTo = rect.top + window.scrollY - headerHeight;
        window.scrollTo({ top: scrollTo, behavior: "smooth" });
      }, 350);
    }
  };

  return (
    <nav
      aria-label="Methodology Navigation"
      className="bg-black-2 rounded-md p-2 min-w-[280px]"
    >
      <h2 className="sr-only">{t("methodsPage.dataSelector.label")}</h2>

      <ul className="divide-y divide-black-1">
        {Object.entries(newsletterList).map(([year, months]) => (
          <li key={year}>
            <button
              onClick={() => toggleYear(year)}
              className="flex justify-between items-center w-full p-3 my-1 text-left font-medium text-white hover:bg-black-1 transition-colors duration-200 rounded-lg"
              aria-expanded={expandedYear.includes(year)}
            >
              <span>{year}</span>
              {expandedYear.includes(year) ? (
                <ChevronUp size={18} className="text-grey" />
              ) : (
                <ChevronDown size={18} className="text-grey" />
              )}
            </button>

            {expandedYear.includes(year) && (
              <ul className="pl-4 pb-2 animate-slideDown">
                {months.map((month) => (
                  <li key={month.id}>
                    <button
                      onClick={() => {
                        handleMonthChange(month.id);
                        setDisplayedNewsletter(month);
                      }}
                      className={`w-full p-2 my-0.5 text-left text-sm rounded-lg transition-colors duration-200 ${
                        selectedMonth === month.id
                          ? "bg-black-1 text-blue-3 font-medium"
                          : "text-grey hover:bg-black-1 hover:text-white"
                      }`}
                      aria-current={
                        selectedMonth === month.id ? "page" : undefined
                      }
                    >
                      {month.monthPosted}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
