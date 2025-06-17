import { SearchIcon } from "lucide-react";
import { SearchDialog } from "./SearchDialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CombinedData } from "@/hooks/useCombinedData";
import { cn } from "@/lib/utils";

type HeaderSearchEntryProps = {
  className?: string;
};

export const HeaderSearchEntry = ({ className }: HeaderSearchEntryProps) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const navigate = useNavigate();

  const platform = window.navigator?.userAgent;
  const isMac = platform.toLowerCase().includes("mac");

  // Open command palette with CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectResponse = (response: CombinedData) => {
    switch (response.category) {
      case "companies":
        navigate(`/companies/${response.id}`);
        return;
      case "municipalities":
        navigate(`/municipalities/${response.id}`);
        return;
    }
  };
  return (
    <>
      <button
        onClick={() => setCommandOpen(true)}
        className={cn(
          className,
          "lg:ml-auto px-2 py-1 bg-black-1 min-w-28 md:min-w-48 h-6 lg:h-8 text-grey rounded-full border border-grey/20 hover:text-white transition-colors flex justify-between items-center gap-2",
        )}
      >
        <SearchIcon className="h-4 w-4" />
        <span className="text-xs text-grey/60 inline-flex gap-0.5 min-w-14">
          <kbd className="px-1.5 border border-grey/20 rounded ml-auto">
            {isMac ? "⌘" : "Ctrl"}
          </kbd>
          <kbd className="px-1.5 border border-grey/20 rounded">K</kbd>
        </span>
      </button>
      <SearchDialog
        open={commandOpen}
        setOpen={setCommandOpen}
        onSelectResponse={handleSelectResponse}
      />
    </>
  );
};
