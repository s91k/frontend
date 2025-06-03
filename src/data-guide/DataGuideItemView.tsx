import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { DataGuideItem } from "./types";
import { SidebarGuideItem } from "./SidebarGuideItem";

type DataGuidItemViewProps = {
  item: DataGuideItem;
};

export const DataGuideItemView = ({ item }: DataGuidItemViewProps) => {
  const { t } = useTranslation();

  return (
    <SidebarGuideItem title={t(item.titleKey)}>
      <Markdown
        remarkPlugins={[remarkBreaks]}
        components={{
          ol: ({ node, children, ...props }) => (
            <ol {...props} className="list-decimal list-inside mt-4">
              {children}
            </ol>
          ),
          ul: ({ node, children, ...props }) => (
            <ul {...props} className="list-disc list-inside mt-4">
              {children}
            </ul>
          ),
        }}
      >
        {t(item.contentKey, { joinArrays: "\n" })}
      </Markdown>
    </SidebarGuideItem>
  );
};
