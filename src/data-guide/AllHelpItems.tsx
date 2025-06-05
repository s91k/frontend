import Markdown from "react-markdown";
import { dataGuideHelpItems } from "./items";
import remarkBreaks from "remark-breaks";
import { useTranslation } from "react-i18next";

export const AllHelpItems = () => {
  const { t } = useTranslation();
  const items = Object.values(dataGuideHelpItems);

  return (
    <>
      <h1 className="text-2xl mb-8">All help texts</h1>
      {items.map((item) => (
        <div className="mb-8 max-w-prose">
          <h2 className="text-lg text-blue-2">{t(item.titleKey)}</h2>
          <p className="text-orange-2 mb-4">{item.id}</p>
          <Markdown
            remarkPlugins={[remarkBreaks]}
            components={{
              ol: ({ node, children, ...props }) => (
                <ol {...props} className="list-decimal list-outside mt-2">
                  {children}
                </ol>
              ),
              ul: ({ node, children, ...props }) => (
                <ul {...props} className="list-disc list-outside ml-6 my-4">
                  {children}
                </ul>
              ),
              li: ({ node, children, ...props }) => (
                <li {...props} className="my-1">
                  {children}
                </li>
              ),

              p: ({ node, children, ...props }) => (
                <p
                  {...props}
                  className="my-1 first:mt-0 last:mb-0 whitespace-pre-wrap  leading-relaxed"
                >
                  {children}
                </p>
              ),
            }}
          >
            {t(item.contentKey, { joinArrays: " " })}
          </Markdown>
        </div>
      ))}
    </>
  );
};
