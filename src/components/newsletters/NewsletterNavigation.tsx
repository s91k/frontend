import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { NewsletterType } from "@/lib/newsletterArchive/newsletterData";

interface NewsletterNavigationProps {
  newsletterList: Array<T>;
  setDisplayedNewsletter: (newsletter: NewsletterType) => void;
  displayedNewsLetter: NewsletterType;
}

export function NewsletterNavigation({
  newsletterList,
  displayedNewsLetter,
  setDisplayedNewsletter,
}: NewsletterNavigationProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  console.log(newsletterList);

  return (
    <nav
      aria-label="Methodology Navigation"
      className={`${isMobile ? "max-h-80" : "max-h-[570px]"} bg-black-2 rounded-md p-2 lg:max-w-[280px] overflow-y-scroll`}
    >
      <h2 className="sr-only">{t("methodsPage.dataSelector.label")}</h2>

      <ul className="divide-y divide-black-1">
        {newsletterList?.map((newsletter, index) => {
          return (
            <li key={index}>
              <button
                onClick={() => {
                  setDisplayedNewsletter?.(newsletter.long_archive_url);
                }}
                className="flex flex-col gap-[5px] justify-between items-left w-full p-3 my-1 text-left text-sm font-medium text-grey hover:bg-black-1 transition-colors duration-200 rounded-lg"
              >
                <span className="text-sm font-medium text-white">
                  {newsletter.send_time.slice(
                    0,
                    newsletter.send_time.indexOf("T"),
                  )}
                </span>
                <span>{newsletter.settings.subject_line}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
