import { useParams } from "react-router-dom";
import { articleMetaData } from "@/lib/learn-more/articleList";
import { LearnMoreReporting } from "./LearnMoreReporting";

export function LearnMoreArticle() {
  const { id } = useParams();

  // Find the current article based on the ID
  const currentArticle = articleMetaData.find((article) => article.id === id);

  // If no article is found, return null (or a 404 component)
  if (!currentArticle) {
    return null;
  }

  // Route to the appropriate component based on the article ID
  switch (id) {
    case "reporting":
      return <LearnMoreReporting article={currentArticle} />;
    // Add more cases here as you create new article components
    default:
      return null;
  }
}
