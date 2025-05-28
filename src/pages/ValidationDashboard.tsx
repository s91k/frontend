import { useLanguage } from "@/components/LanguageProvider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { RankedCompany, useCompanies } from "@/hooks/companies/useCompanies";
import { useValidationClaims } from "@/hooks/useValidationClaims";
import { useValidationReports } from "@/hooks/useValidationReports";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/utils/localizeUnit";

type UnverifiedCompanyWithPeriod = {
  company: RankedCompany;
  period: RankedCompany["reportingPeriods"][0];
};

function splitByFilter<T>(
  array: T[],
  filterFn: (item: T) => boolean,
): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], item) => {
      return filterFn(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []],
  );
}

const useGetUnverifiedCompaniesForYear = (year: number) => {
  const { companies } = useCompanies();
  const { isEmissionsAIGenerated } = useVerificationStatus();

  const [unverified, verified] = splitByFilter(
    companies
      .map((company) => {
        const period = company.reportingPeriods.find(
          (period) => new Date(period.endDate).getFullYear() == year,
        );

        return {
          company,
          period,
        };
      })
      .sort(({ company: companyA }, { company: companyB }) =>
        companyA.name.localeCompare(companyB.name),
      ),
    (item) => !!(item.period && isEmissionsAIGenerated(item.period)),
  );

  return [unverified, verified] as [
    UnverifiedCompanyWithPeriod[],
    UnverifiedCompanyWithPeriod[],
  ];
};

const githubUrl = (company: RankedCompany, reportUrl: string | null) => {
  const body = reportUrl ? `Report URL: ${reportUrl}` : "";

  const encodedTitle = encodeURIComponent(
    `[${company.wikidataId}] ${company.name}`,
  );
  const encodedBody = encodeURIComponent(body);
  return `https://github.com/hallski/klimatkollen-test/issues/new?title=${encodedTitle}&body=${encodedBody}`;
};

export const ValidationDashboard = () => {
  const year =
    new URLSearchParams(window.location.search).get("year") || "2024";

  const {
    companies: allCompanies,
    loading: companiesLoading,
    error: companiesError,
  } = useCompanies();
  const [unverifiedCompanies, _verifiedCompanies] =
    useGetUnverifiedCompaniesForYear(parseInt(year));
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const {
    issues,
    isLoading: issuesLoading,
    error: issuesError,
  } = useValidationReports();

  const {
    claims,
    claimValidation,
    unclaimValidation,
    isLoading: claimsLoading,
    error: claimsError,
  } = useValidationClaims();

  const handleYearChange = (selectedYear: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("year", selectedYear);
    window.history.pushState({}, "", url);
    window.location.reload();
  };

  const stealClaim = (wikidataId: string) => {
    claimValidation(wikidataId, true);
  };

  const years = Array.from({ length: 5 }, (_, i) => 2024 - i);

  const nrFinishedCompanies = allCompanies.length - unverifiedCompanies.length;
  const progress = nrFinishedCompanies / allCompanies.length;

  if (issuesError || companiesError || claimsError) {
    return <span>Error</span>;
  }

  if (issuesLoading || companiesLoading || claimsLoading) {
    return <span>Loading</span>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">
        Validation status for <span className="text-green-3">{year}</span>
      </h1>

      <div className="my-6 flex items-center gap-2">
        <label htmlFor="year-selector" className="block text-sm">
          Select Year:
        </label>
        <Select value={year} onValueChange={(value) => handleYearChange(value)}>
          <SelectTrigger className="w-auto bg-black-1 text-white border border-gray-600 px-3 py-2 rounded-md">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-black-1 text-white">
            {years.map((y) => (
              <SelectItem value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="inline-grid grid-cols-[auto_auto_auto_auto_1fr] mb-6 gap-x-8 gap-y-2 border-b border-gray-400">
        <div className="col-span-4">
          <p className="text-gray-400 mb-1">
            Verified: {allCompanies.length - unverifiedCompanies.length} of{" "}
            {allCompanies.length}
            <span className="ml-2">
              ({formatPercent(progress, currentLanguage)})
            </span>
          </p>
          <Progress value={progress * 100} className="mb-8" />
        </div>
        <div className="grid grid-cols-subgrid col-span-5 text-gray-400 border-b border-gray-400">
          <span>Company name</span>
          <span>Report link</span>
          <span>In progress by</span>
          <span>Start/stop working</span>
          <span>Issues</span>
        </div>

        {unverifiedCompanies.length > 0 ? (
          unverifiedCompanies.map(({ company, period }) => (
            <div
              key={company.wikidataId}
              className="grid grid-cols-subgrid col-span-5"
            >
              <a
                className="text-blue-2"
                href={`/companies/${company.wikidataId}/edit`}
              >
                {company.name}
              </a>
              {period.reportURL ? (
                <a className="text-blue-3 text-center" href={period.reportURL}>
                  Report
                </a>
              ) : (
                <span />
              )}
              {claims[company.wikidataId] ? (
                <span
                  className={cn(
                    claims[company.wikidataId] === user?.githubId
                      ? "text-pink-3"
                      : "text-gray-400",
                  )}
                >
                  {claims[company.wikidataId]}
                </span>
              ) : (
                <span></span>
              )}

              <div className="text-center">
                {claims[company.wikidataId] === user?.githubId ? (
                  <button
                    onClick={() => unclaimValidation(company.wikidataId)}
                    className="text-blue-2"
                  >
                    Release
                  </button>
                ) : claims[company.wikidataId] ? (
                  <button
                    onClick={() => stealClaim(company.wikidataId)}
                    className="text-pink-4"
                  >
                    Take over
                  </button>
                ) : (
                  <button
                    onClick={() => claimValidation(company.wikidataId)}
                    className="text-green-2"
                  >
                    Claim
                  </button>
                )}
              </div>
              {issues![company.wikidataId] ? (
                <span>
                  <a
                    href={issues![company.wikidataId].url}
                    className={cn(
                      "mr-2",
                      issues![company.wikidataId].state == "open"
                        ? "text-green-3"
                        : "text-gray-500",
                    )}
                  >{`#${issues![company.wikidataId].number} by ${issues![company.wikidataId].user.login}`}</a>
                  {issues![company.wikidataId].labels.map((label) => (
                    <span
                      style={{ backgroundColor: `#${label.color}` }}
                      className="rounded-2xl mx-[2px] px-2"
                    >
                      {label.name}
                    </span>
                  ))}
                </span>
              ) : (
                <a href={githubUrl(company, period.reportURL)}>Report issue</a>
              )}
            </div>
          ))
        ) : (
          <span className="col-span-4 text-center text-2xl my-4">
            All done! 🎉
          </span>
        )}
      </div>
    </div>
  );
};
