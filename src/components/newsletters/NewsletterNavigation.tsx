import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { NewsletterType } from "@/lib/newsletterArchive/newsletterData";
import { useNavigate } from "react-router-dom";
import itemPagination from "@/utils/itemPagination";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface NewsletterNavigationProps {
  newsletterList: Array<NewsletterType>;
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
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedContent, setPaginatedContent] = useState<Record<
    string,
    NewsletterType[]
  > | null>(null);

  /*   useEffect(() => {
    if (!newsletterList) {
      return;
    } else {
      setDisplayedNavLinks(newsletterList.slice(0, pageSize));
    }
  }, [newsletterList]); */

  useEffect(() => {
    if (newsletterList) {
      const paginatedItems = itemPagination({
        content: newsletterList,
      });
      if (paginatedItems) {
        setPaginatedContent(paginatedItems);
      }
    }
  }, [newsletterList]);

  console.log(paginatedContent);

  return (
    <Pagination
      className={`${isMobile ? "max-h-80" : "max-h-[585px]"} flex flex-col bg-black-2 rounded-md p-2 lg:max-w-[280px] justify-between`}
    >
      <PaginationContent className="flex h-3/4 flex-col divide-y divide-black-1 justify-between items-center text-left">
        {paginatedContent &&
          paginatedContent["page" + currentPage].map((item) => {
            return (
              <PaginationLink
                className="flex flex-col h-full gap-[5px] justify-between items-left w-full p-3 my-1 text-left text-sm font-medium text-grey hover:bg-black-1 transition-colors cursor-pointer duration-200 rounded-lg"
                onClick={() => {
                  setDisplayedNewsletter?.(item.long_archive_url);
                  navigate(`?view=${item.id}`);
                }}
              >
                <span className="flex text-sm font-medium text-white self-start
">
                  {item.send_time.slice(0, item.send_time.indexOf("T"))}
                </span>
                {item.settings.subject_line}
              </PaginationLink>
            );
          })}
      </PaginationContent>
      <div className="flex justify-center">
        <PaginationPrevious></PaginationPrevious>
        <PaginationNext></PaginationNext>
      </div>
    </Pagination>
    /* <nav
      aria-label="Newsletter Navigation"
      className={`${isMobile ? "max-h-80" : "max-h-[585px]"} flex flex-col bg-black-2 rounded-md p-2 lg:max-w-[280px] justify-between`}
    >
      <div>
        <h2 className="sr-only">{t("methodsPage.dataSelector.label")}</h2>

        <ul className="divide-y divide-black-1">
          {displayedNavLinks?.map((newsletter, index) => {
            return (
              <li key={index}>
                <button
                  onClick={() => {
                    setDisplayedNewsletter?.(newsletter.long_archive_url);
                    navigate(`?view=${newsletter.id}`);
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
      </div>
    </nav>  */
  );
}
