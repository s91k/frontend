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
/*   const { isMobile } = useScreenSize();
 */  console.log(newsletterList);

  return (
    <nav
      aria-label="Methodology Navigation"
      className="bg-black-2 rounded-md p-2 min-w-[280px] max-h-80 overflow-y-scroll"
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
                className="flex justify-between items-center w-full p-3 my-1 text-left font-medium text-white hover:bg-black-1 transition-colors duration-200 rounded-lg"
              >
                <span>{newsletter.send_time.slice(0, newsletter.send_time.indexOf("T"))}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
