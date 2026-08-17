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
      className={`group fixed inset-x-0 top-12 z-40 flex ${VALET_BANNER_HEIGHT_CLASS} items-center border-b border-[#E2FF8D]/20 bg-black-2/95 backdrop-blur-sm transition-colors hover:border-[#E2FF8D]/35 hover:bg-black-1/95`}
    >
      <div className="container mx-auto flex w-full items-center gap-2.5 px-4 md:gap-4">
        <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#E2FF8D] md:text-xs">
          {t("landingPage.valet2026Banner.badge")}
        </span>
        <div className="min-w-0 flex-1 text-left md:text-center">
          <p className="truncate text-sm font-medium text-white md:text-base">
            {t("landingPage.valet2026Banner.title")}
          </p>
          <p className="truncate text-xs text-white/65 md:hidden">
            {t("landingPage.valet2026Banner.subtitle")}
          </p>
        </div>
        <p className="hidden min-w-0 flex-1 truncate text-center text-sm text-white/65 md:block">
          {t("landingPage.valet2026Banner.subtitle")}
        </p>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-[#E2FF8D] transition-transform duration-300 group-hover:translate-x-0.5 md:h-5 md:w-5"
          aria-hidden
        />
      </div>
    </LocalizedLink>
  );
}
