import { RankedCompany, useCompanies } from "@/hooks/companies/useCompanies";
import { useMunicipalities } from "@/hooks/useMunicipalities";
import { Municipality } from "@/types/municipality";
import { useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Dialog, DialogOverlay, DialogPortal } from "../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  if (query.length <= 0) {
    return [] as SearchResult[];
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

const resultTypeTranslationKeys = {
  company: "globalSearch.searchCategoryCompany",
  municipality: "globalSearch.searchCategoryMunicipality",
  page: "globalSearch.searchCategoryPage",
} as const;

const SearchResultItem = ({ item }: { item: SearchResult }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center w-full text-sm text-gray-500 dark:text-gray-400">
      <span>{item.name}</span>
      <span className="ml-auto mr-2">
        {t(resultTypeTranslationKeys[item.type])}
      </span>
    </div>
  );
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

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 focus:outline-none">
          <div
            className={cn(
              "bg-black-2 px-8 pb-8 pt-2 dark:bg-gray-800 border border-black-1 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden",
              "transition-all duration-200 ease-in-out",
            )}
          >
            <Command className="rounded-lg">
              <CommandInput
                placeholder="Search for companies or municipalities..."
                value={inputValue}
                onValueChange={handleInputChange}
                className="focus:ring-0"
              />
              <CommandEmpty>
                <p className="text-left text-gray-400">
                  To search, start typing the name of a company or municipality
                  you want to learn more about.
                </p>
              </CommandEmpty>
              <CommandList
                className="transition-all duration-200 ease-in-out mt-4"
                style={{
                  maxHeight:
                    results.length > 0
                      ? `${Math.min(results.length * 48, 300)}px`
                      : "0px",
                }}
              >
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onSelectResponse(item);
                      setOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SearchResultItem item={item} />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
