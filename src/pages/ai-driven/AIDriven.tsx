import { useParams } from "react-router-dom";
import { PageRenderer } from "./components/PageRenderer";
import { aiResponseMock } from "./mocks/aiResponseMock";

export const AIDriven = () => {
  const { id } = useParams<{ id: string; slug?: string }>();
  const selectedStory = aiResponseMock.find((item) => item.id == id);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header section */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI-Driven Climate Insights
        </h1>
        <p className="text-grey text-lg max-w-3xl">
          Explore climate data through AI-generated reports and visualizations.
          Press{" "}
          <kbd className="px-2 py-1 bg-black-2 rounded-md text-sm">⌘ K</kbd> to
          open the command palette and ask for specific climate insights.
        </p>
      </div>

      {/* Content section */}
      {selectedStory ? (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedStory.title}
            </h2>
            <p className="text-grey">{selectedStory.description}</p>
          </div>
          <PageRenderer components={selectedStory.components} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-black-2 rounded-level-2">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Climate AI Insights
          </h2>
          <p className="text-grey max-w-2xl mb-6">
            Press{" "}
            <kbd className="px-2 py-1 bg-black-1 rounded-md text-sm">⌘ K</kbd>{" "}
            to open the command palette and explore climate data through
            AI-generated reports and visualizations.
          </p>
        </div>
      )}
    </div>
  );
};
