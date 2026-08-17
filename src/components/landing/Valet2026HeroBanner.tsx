import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocalizedLink } from "@/components/LocalizedLink";

/** Fixed bar height – keep landing hero top padding in sync. */
const VALET_BANNER_HEIGHT_CLASS = "h-[3.25rem] md:h-14";

/**
 * Full-width news strip fixed directly below the site header on the landing page.
 */
export function Valet2026HeroBanner() {
  const { t } = useTranslation();
  const label = `${t("landingPage.valet2026Banner.badge")} ${t("landingPage.valet2026Banner.title")}`;

  return (
    <LocalizedLink
      to="/valet-2026"
      aria-label={label}
      className={`group fixed inset-x-0 top-12 z-40 flex ${VALET_BANNER_HEIGHT_CLASS} items-center border-b border-black/10 bg-[#E2FF8D] transition-colors hover:bg-[#daf585]`}
    >
      <div className="container mx-auto flex w-full items-center gap-2.5 px-4 md:justify-center md:gap-3">
        <div className="min-w-0 flex-1 md:flex md:flex-none md:items-center md:gap-2.5">
          <p className="truncate text-sm font-medium text-black md:text-base md:truncate-none">
            {t("landingPage.valet2026Banner.badge")}{" "}
            {t("landingPage.valet2026Banner.title")}
          </p>
          <p className="truncate text-xs text-black/70 md:truncate-none md:text-sm">
            <span className="md:hidden">
              {t("landingPage.valet2026Banner.subtitle")}
            </span>
            <span className="hidden md:inline">
              <span aria-hidden className="mr-2.5">
                ·
              </span>
              {t("landingPage.valet2026Banner.subtitle")}
            </span>
          </p>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-black transition-transform duration-300 group-hover:translate-x-0.5 md:h-5 md:w-5"
          aria-hidden
        />
      </div>
    </LocalizedLink>
  );
}
