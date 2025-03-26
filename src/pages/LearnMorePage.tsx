import {
  ArrowDown,
  LineChart,
  Building2,
  Users,
  Globe2,
  AlertCircle,
  FileSpreadsheet,
  Scale,
  Target,
  History,
  ArrowRight,
} from "lucide-react";
import ParticleAnimation from "../components/learnMore/ParticleAnimation";
import { useTranslation } from "react-i18next";

export function LearnMorePage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <ParticleAnimation />
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {t("learnMorePage.title")}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-300">
            {t("learnMorePage.subtitle")}
          </p>

          <div className="animate-bounce mt-12">
            <ArrowDown size={32} className="text-white opacity-75" />
          </div>
        </div>

        {/* Info Section */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
              {t("learnMorePage.impactTitle")}
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow">
              {t("learnMorePage.impactDescription")}
            </p>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow">
              {t("learnMorePage.impactDescription2")}
            </p>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-2 to-blue-4 drop-shadow-lg">
                {t("learnMorePage.trackingTitle")}
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow">
                {t("learnMorePage.trackingDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Companies Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-blue-3/50 transition-colors shadow-xl">
                <Building2 className="w-12 h-12 text-blue-3 mb-4 drop-shadow" />
                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-lg">
                  {t("learnMorePage.companies")}
                </h3>
                <p className="text-gray-200 drop-shadow">
                  {t("learnMorePage.companiesDescription")}
                </p>
              </div>

              {/* Communities Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-blue-3/50 transition-colors shadow-xl">
                <Users className="w-12 h-12 text-blue-3 mb-4 drop-shadow" />
                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-lg">
                  {t("learnMorePage.communities")}
                </h3>
                <p className="text-gray-200 drop-shadow">
                  {t("learnMorePage.communitiesDescription")}
                </p>
              </div>

              {/* Countries Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-blue-3/50 transition-colors shadow-xl">
                <Globe2 className="w-12 h-12 text-blue-3 mb-4 drop-shadow" />
                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-lg">
                  {t("learnMorePage.countries")}
                </h3>
                <p className="text-gray-200 drop-shadow">
                  {t("learnMorePage.countriesDescription")}
                </p>
              </div>

              {/* Data Gaps Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-blue-3/50 transition-colors shadow-xl">
                <AlertCircle className="w-12 h-12 text-blue-3 mb-4 drop-shadow" />
                <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-lg">
                  {t("learnMorePage.dataGaps")}
                </h3>
                <p className="text-gray-200 drop-shadow">
                  {t("learnMorePage.dataGapsDescription")}
                </p>
              </div>
            </div>

            <div className="mt-16 bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-xl">
              <div className="flex items-start gap-6">
                <LineChart className="w-12 h-12 text-blue-3 flex-shrink-0 mt-1 drop-shadow" />
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-lg">
                    {t("learnMorePage.whyTrackingMatters")}
                  </h3>
                  <p className="text-gray-200 mb-4 drop-shadow">
                    {t("learnMorePage.whyTrackingMattersDescription")}
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-2 drop-shadow">
                    {t("learnMorePage.trackingBenefits", {
                      returnObjects: true,
                    }).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSRD Section */}
        <div className="min-h-screen flex items-center justify-center px-4 py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-3 to-blue-4 drop-shadow-lg">
                {t("learnMorePage.csrdTitle")}
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow">
                {t("learnMorePage.csrdDescription")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Current Challenges Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-xl">
                <History className="w-12 h-12 text-blue-3 mb-6 drop-shadow" />
                <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-lg">
                  {t("learnMorePage.currentChallenges")}
                </h3>
                <ul className="space-y-3 text-gray-200 drop-shadow">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>
                      Inconsistent methodologies across companies and regions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Limited scope of emissions coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Lack of standardized verification processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>
                      Difficulty tracking progress towards Paris Agreement goals
                    </span>
                  </li>
                </ul>
              </div>

              {/* CSRD Benefits Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-xl">
                <FileSpreadsheet className="w-12 h-12 text-blue-3 mb-6 drop-shadow" />
                <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-lg">
                  CSRD Improvements
                </h3>
                <ul className="space-y-3 text-gray-200 drop-shadow">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>
                      Standardized reporting requirements across the EU
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Comprehensive coverage of environmental impacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Mandatory third-party assurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Digital tagging for improved data accessibility</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Paris Alignment Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-xl">
                <Target className="w-12 h-12 text-blue-3 mb-6 drop-shadow" />
                <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-lg">
                  Paris Agreement Alignment
                </h3>
                <p className="text-gray-200 drop-shadow mb-4">
                  CSRD helps track progress towards Paris Agreement goals by:
                </p>
                <ul className="space-y-2 text-gray-200 drop-shadow">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Requiring detailed transition plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Mandating science-based targets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Ensuring consistent progress tracking</span>
                  </li>
                </ul>
              </div>

              {/* Implementation Timeline Card */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10 shadow-xl">
                <Scale className="w-12 h-12 text-blue-3 mb-6 drop-shadow" />
                <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-lg">
                  Implementation Timeline
                </h3>
                <ul className="space-y-3 text-gray-200 drop-shadow">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>2024: Large public companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>2025: Large companies not yet reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>2026: Listed SMEs and other companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-3 mt-1">•</span>
                    <span>Gradual expansion to cover more businesses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          {/* <div className="animate-bounce mt-12">
            <p>Continue</p><ArrowRight size={32} className="text-white opacity-75" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
