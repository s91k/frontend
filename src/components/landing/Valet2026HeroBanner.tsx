import { useTranslation } from "react-i18next";
import { LocalizedLink } from "@/components/LocalizedLink";

/**
 * Editorial line on the landing hero – typographic, lime link like the
 * typewriter above.
 */
export function Valet2026HeroBanner() {
  const { t } = useTranslation();

  return (
    <p className="mt-5 max-w-lg px-2 text-center text-base leading-snug story-short:mt-3 story-short:max-w-[17rem] story-short:text-sm md:mt-6 md:text-lg">
      <span className="text-white/85">
        {t("landingPage.valet2026Banner.prefix")}
      </span>{" "}
      <LocalizedLink
        to="/valet-2026"
        className="font-medium text-[#E2FF8D] underline decoration-[#E2FF8D]/40 underline-offset-[0.2em] transition-colors hover:text-white hover:decoration-white/60"
      >
        {t("landingPage.valet2026Banner.link")}
      </LocalizedLink>
    </p>
  );
}
