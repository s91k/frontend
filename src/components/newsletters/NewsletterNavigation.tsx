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

  return (
    <>
      {paginatedContent && (
        <Pagination
          className={`${isMobile ? "max-h-80" : "max-h-[585px]"} flex flex-col bg-black-2 rounded-md p-2 lg:max-w-[280px] justify-between`}
        >
          <PaginationContent className="flex h-3/4 flex-col divide-y divide-black-1 items-center text-left">
            {paginatedContent &&
              paginatedContent["page" + currentPage].map((item) => {
                return (
                  <PaginationLink
                    className={`${displayedNewsLetter === item.long_archive_url ? "bg-black-1" : null} flex flex-col h-full max-h-[125px] gap-[5px] items-left w-full p-3 my-1 text-left text-sm font-medium text-grey hover:bg-black-1 transition-colors cursor-pointer duration-200 rounded-lg`}
                    onClick={() => {
                      setDisplayedNewsletter?.(item.long_archive_url);
                      navigate(`?view=${item.id}`);
                    }}
                  >
                    <span
                      className="flex text-sm font-medium text-white self-start
"
                    >
                      {item.send_time.slice(0, item.send_time.indexOf("T"))}
                    </span>
                    {item.settings.subject_line}
                  </PaginationLink>
                );
              })}
          </PaginationContent>
          <div className="flex justify-center">
            {paginatedContent["page" + currentPage].hasPreviousPage && (
              <PaginationPrevious
                onClick={() => setCurrentPage(currentPage - 1)}
              />
            )}
            {paginatedContent["page" + currentPage].hasNextPage && (
              <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
            )}
          </div>
        </Pagination>
      )}
    </>
  );
}
