import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCompanies } from "@/hooks/companies/useCompanies";
import { useMunicipalities } from "@/hooks/useMunicipalities";
import { useEffect, useState } from "react";
import { aiResponseMock } from "../mocks/aiResponseMock";

interface AICommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectResponse: (response: AICommandResult) => void;
}

type ResultType = {
  companies: { type: "story"; name: string; wikidataId: string }[];
  municipalities: { type: "municipality"; name: string }[];
  aiStories: { type: "aiStory"; suggestion: string; id: string }[];
};

export type AICommandResult =
  | { type: "story"; name: string; wikidataId: string }
  | { type: "municipality"; name: string }
  | { type: "aiStory"; suggestion: string; id: string };

const emptyResult = {
  companies: [],
  municipalities: [],
  aiStories: [],
};

export function AICommandPalette({
  open,
  setOpen,
  onSelectResponse,
}: AICommandPaletteProps) {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<ResultType>(emptyResult);

  const [loading, setLoading] = useState(false);
  const { companies: allCompanies } = useCompanies();
  const { municipalities: allMunicipalities } = useMunicipalities();

  useEffect(() => {
    if (open) {
      console.log("Open changed");
      setInputValue("");
      setResults(emptyResult);
    }
  }, [open]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.length > 2) {
      setLoading(loading);

      // Simulate API call with a delay
      setTimeout(() => {
        const lcInput = value.toLowerCase();

        const companies = allCompanies
          .filter((company) => company.name.toLowerCase().includes(lcInput))
          .map((c) => ({
            type: "story" as const,
            name: c.name,
            wikidataId: c.wikidataId,
          }));

        const municipalities = allMunicipalities
          .filter((municipality) =>
            municipality.name.toLowerCase().includes(lcInput),
          )
          .map((m) => ({
            type: "municipality" as const,
            name: m.name,
          }));

        const aiStories = aiResponseMock
          .filter(
            (item) =>
              item.title.toLowerCase().includes(lcInput) ||
              item.description.toLowerCase().includes(lcInput),
          )
          .map((story) => ({
            type: "aiStory" as const,
            suggestion: story.title,
            id: story.id,
          }));

        const r = {
          companies,
          municipalities,
          aiStories,
        };

        console.log("Result:", r, "companies:", allCompanies, lcInput);

        setResults(r);

        setLoading(false);
      }, 500);
    } else {
      setResults(emptyResult);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Ask about climate data..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="py-6 text-center flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </div>
          ) : (
            <p>No results found. Try a different search.</p>
          )}
        </CommandEmpty>

        <CommandGroup heading="Companies">
          {results.companies.map((item) => (
            <CommandItem
              key={item.wikidataId}
              onSelect={() => {
                onSelectResponse(item);
                setOpen(false);
              }}
            >
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Municipalities">
          {results.municipalities.map((item) => (
            <CommandItem
              key={item.name}
              onSelect={() => {
                onSelectResponse(item);
                setOpen(false);
              }}
            >
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Stories">
          {results.aiStories.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => {
                onSelectResponse(item);
                setOpen(false);
              }}
            >
              {item.suggestion}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
