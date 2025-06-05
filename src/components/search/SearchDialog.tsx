import { RankedCompany, useCompanies } from "@/hooks/companies/useCompanies";
import { useMunicipalities } from "@/hooks/useMunicipalities";
import { Municipality } from "@/types/municipality";
import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export type SearchResult = {
  id: string;
  type: "company" | "municipality";
  name: string;
};

interface SearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectResponse: (response: SearchResult) => void;
}

const calculateSearchResults = (
  query: string,
  allCompanies: RankedCompany[],
  allMunicipalities: Municipality[],
) => {
  if (query.length < 1) {
    return [];
  }

  const lcInput = query.toLowerCase();

  const companies = allCompanies
    .filter((company) => company.name.toLowerCase().includes(lcInput))
    .map((c) => ({
      name: c.name,
      id: c.wikidataId,
      type: "company",
    }));

  const municipalities = allMunicipalities
    .filter((municipality) => municipality.name.toLowerCase().includes(lcInput))
    .map((m) => ({
      name: m.name,
      id: m.name,
      type: "municipality",
    }));

  return [...companies, ...municipalities] as SearchResult[];
};

export function SearchDialog({
  open,
  setOpen,
  onSelectResponse,
}: SearchDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const { companies: allCompanies } = useCompanies();
  const { municipalities: allMunicipalities } = useMunicipalities();
  const results = useMemo(
    () => calculateSearchResults(inputValue, allCompanies, allMunicipalities),
    [inputValue, allCompanies, allMunicipalities],
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for companies or municipalities..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
      <CommandList className="cmdk-list-animate">
        {results.map((item) => (
          <CommandItem
            key={item.id}
            onSelect={() => {
              onSelectResponse(item);
              setOpen(false);
            }}
          >
            <div className="flex justify-between w-full">
              <span>{item.name}</span>
              <span className="ml-auto">
                {item.type === "company" ? "Company" : "Municipality"}
              </span>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
