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
            <ol {...props} className="list-decimal list-outside mt-2 text-sm">
              {children}
            </ol>
          ),
          ul: ({ node, children, ...props }) => (
            <ul {...props} className="list-disc list-outside ml-3 mt-2 text-sm">
              {children}
            </ul>
          ),
          p: ({ node, children, ...props }) => (
            <p
              {...props}
              className="my-1 first:mt-0 last:mb-0 whitespace-pre-wrap text-sm leading-relaxed"
            >
              {children}
            </p>
          ),
        }}
      >
        {t(item.contentKey, { joinArrays: "\n" })}
      </Markdown>
    </SidebarGuideItem>
  );
};
