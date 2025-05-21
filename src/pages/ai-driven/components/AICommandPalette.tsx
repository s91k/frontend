import { useState, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AIResponseType, aiResponseMock } from "../mocks/aiResponseMock";
import { CommandLoading } from "cmdk";
import { TvIcon } from "lucide-react";

interface AICommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectResponse: (response: AIResponseType) => void;
}

export function AICommandPalette({
  open,
  setOpen,
  onSelectResponse,
}: AICommandPaletteProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResponseType[]>([]);

  useEffect(() => {
    if (open) {
      console.log("Open changed");
      setInputValue("");
      setResults([]);
    }
  }, [open]);

  console.log("Result:", results);
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.length > 2) {
      setLoading(true);

      // Simulate API call with a delay
      setTimeout(() => {
        // Filter mock results based on input
        const filteredResults = aiResponseMock.filter(
          (item) =>
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase()),
        );

        setResults(filteredResults);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  };

  console.log(
    "COmmand list with",
    results.length,
    "items. Open:",
    open,
    ", loading:",
    loading,
  );
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Ask about climate data..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
      <CommandList>
        {loading && <CommandLoading></CommandLoading>}
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

        {results.map((item) => (
          <CommandItem
            key={item.id}
            onSelect={() => {
              onSelectResponse(item);
              setOpen(false);
            }}
          >
            {item.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
