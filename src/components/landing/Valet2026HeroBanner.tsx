import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LocalizedLink } from "@/components/LocalizedLink";

/**
 * Prominent hero banner for the Valet 2026 story – reads as news, not a footnote.
 */
export function Valet2026HeroBanner() {
  const { t } = useTranslation();
  const label = `${t("landingPage.valet2026Banner.badge")} ${t("landingPage.valet2026Banner.title")}`;

  return (
    <LocalizedLink
      to="/valet-2026"
      aria-label={label}
      className="group mt-6 block w-full max-w-md px-2 story-short:mt-4 story-short:max-w-[19rem] md:mt-8 md:max-w-xl"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/[0.08] px-5 py-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors duration-300 hover:border-[#E2FF8D]/45 hover:bg-white/[0.11] story-short:px-4 story-short:py-3 md:px-6 md:py-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_0%_0%,rgba(226,255,141,0.14)_0%,transparent_55%)]"
        />
        <div className="relative flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E2FF8D] story-short:text-[0.65rem]">
              {t("landingPage.valet2026Banner.badge")}
            </p>
            <p className="mt-1 text-xl font-medium leading-tight text-white story-short:text-lg md:text-2xl md:leading-snug">
              {t("landingPage.valet2026Banner.title")}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-white/70 story-short:mt-1 story-short:text-xs md:text-base">
              {t("landingPage.valet2026Banner.subtitle")}
            </p>
          </div>
          <ArrowRight
            className="h-5 w-5 shrink-0 text-[#E2FF8D] transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6"
            aria-hidden
          />
        </div>
      </div>
    </LocalizedLink>
  );
}
