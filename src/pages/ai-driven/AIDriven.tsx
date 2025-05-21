import { useState, useEffect } from "react";
import { AICommandPalette } from "./components/AICommandPalette";
import { PageRenderer } from "./components/PageRenderer";
import { AIResponseType, aiResponseMock } from "./mocks/aiResponseMock";

export const AIDriven = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<AIResponseType | null>(null);

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

  const handleSelectResponse = (response: AIResponseType) => {
    setSelectedResponse(response);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          AI-Driven Climate Insights
        </h1>
        <p className="text-grey text-lg max-w-3xl">
          Explore climate data through AI-generated reports and visualizations.
          Press <kbd className="px-2 py-1 bg-black-2 rounded-md text-sm">⌘ K</kbd> to
          open the command palette and ask for specific climate insights.
        </p>
        <button
          onClick={() => setCommandOpen(true)}
          className="mt-4 px-4 py-2 bg-black-2 text-white rounded-level-2 hover:bg-black-1 transition-colors"
        >
          Ask the Climate AI
        </button>
      </div>

      {/* Content section */}
      {selectedResponse ? (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedResponse.title}
            </h2>
            <p className="text-grey">{selectedResponse.description}</p>
          </div>
          <PageRenderer components={selectedResponse.components} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-black-2 rounded-level-2">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Climate AI Insights
          </h2>
          <p className="text-grey max-w-2xl mb-6">
            Press <kbd className="px-2 py-1 bg-black-1 rounded-md text-sm">⌘ K</kbd> to
            open the command palette and explore climate data through
            AI-generated reports and visualizations.
          </p>
          <button
            onClick={() => setCommandOpen(true)}
            className="px-4 py-2 bg-blue-3 text-white rounded-level-2 hover:bg-blue-4 transition-colors"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Command palette */}
      <AICommandPalette
        open={commandOpen}
        setOpen={setCommandOpen}
        onSelectResponse={handleSelectResponse}
      />
    </div>
  );
};