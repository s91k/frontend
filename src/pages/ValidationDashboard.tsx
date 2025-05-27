import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/companies/useCompanies";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";

const useGetUnverifiedCompaniesForYear = (year: number) => {
  const { companies } = useCompanies();
  const { isEmissionsAIGenerated } = useVerificationStatus();

  const unverifiedCompanies = companies
    .filter((company) => {
      const period = company.reportingPeriods.find(
        (period) => new Date(period.endDate).getFullYear() == year,
      );

      return period && isEmissionsAIGenerated(period);
    })
    .sort((companyA, companyB) => companyA.name.localeCompare(companyB.name));

  return unverifiedCompanies;
};

export const ValidationDashboard = () => {
  const year =
    new URLSearchParams(window.location.search).get("year") || "2024";

  const companies = useGetUnverifiedCompaniesForYear(parseInt(year));

  const handleYearChange = (selectedYear: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("year", selectedYear);
    window.history.pushState({}, "", url);
    window.location.reload();
  };

  const years = Array.from({ length: 5 }, (_, i) => 2024 - i);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">
        Unverified Companies for <span className="text-green-3">{year}</span>
      </h1>
      <p className="text-gray-400 mb-4">
        These are companies that have one or more unverified data points
      </p>

      <div className="mb-6 flex items-center gap-2">
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

      <ul className="list-disc text-lg">
        {companies.map((company) => (
          <li className="mb-2" key={company.wikidataId}>
            <a
              className="text-blue-2"
              href={`/companies/${company.wikidataId}`}
            >
              {company.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
