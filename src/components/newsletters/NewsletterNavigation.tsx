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
  setDisplayedNewsletter?: (newsletter: NewsletterType) => void;
}

export function NewsletterNavigation({
  selectedMonth,
  onMonthChange,
  contentRef,
  setDisplayedNewsletter,
}: NewsletterNavigationProps) {
  const { t } = useTranslation();
  const [expandedYear, setExpandedYear] = useState<string[]>(
    newsletterList.map((newsletter) => {
      return newsletter.yearPosted;
    }),
  );
  const { isMobile } = useScreenSize();
  console.log(selectedMonth);
  useEffect(() => {
    if (isMobile) {
      setExpandedYear([]);
    } else {
      setExpandedYear(
        newsletterList.map((newsletter) => {
          return newsletter.yearPosted;
        }),
      );
    }
  }, [isMobile]);

  const toggleYear = (year: string) => {
    setExpandedYear((prev) =>
      prev.includes(year)
        ? prev.filter((cat) => cat !== year)
        : [...prev, year],
    );
  };

  const yearsPosted = new Set(
    newsletterList.map((newsletter) => {
      return newsletter.yearPosted;
    }),
  );

  const yearsPostedArray = [...yearsPosted];

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
        {yearsPostedArray.map((year, index) => {
          return (
            <li key={index}>
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
                  {newsletterList.map((newsletter) =>
                    newsletter.yearPosted === year ? (
                      <li key={newsletter.url}>
                        <button
                          onClick={() => {
                            handleMonthChange(newsletter.url);
                            setDisplayedNewsletter?.(newsletter);
                          }}
                          className={`w-full p-2 my-0.5 text-left text-sm rounded-lg transition-colors duration-200 ${
                            selectedMonth === newsletter.url
                              ? "bg-black-1 text-blue-3 font-medium"
                              : "text-grey hover:bg-black-1 hover:text-white"
                          }`}
                          aria-current={
                            selectedMonth === newsletter.url
                              ? "page"
                              : undefined
                          }
                        >
                          {newsletter.monthPosted}
                        </button>
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
