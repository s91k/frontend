import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataGuideItemId, dataGuideHelpItems } from "./items";

interface ProgressiveDataGuideProps {
  titleKey?: string;
  items: DataGuideItemId[];
  className?: string;
}

export function ProgressiveDataGuide({
  titleKey,
  items,
  className,
}: ProgressiveDataGuideProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const title = titleKey ? t(titleKey) : t("dataGuide.buttonFallbackTitle");

  const handleToggle = () => setIsOpen(!isOpen);
  const handleItemToggle = (key: string) =>
    setActiveItem(activeItem === key ? null : key);

  return (
    <div className={cn(className, "space-y-2 mt-8")}>
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 w-full",
          isOpen
            ? "bg-blue-5/60 text-blue-1 hover:bg-blue-5/70"
            : "bg-blue-5/40 text-gray-300 hover:bg-blue-5/70",
        )}
      >
        <GraduationCap className="w-4 h-4 text-blue-1" />
        <span>{title}</span>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 transition-transform ml-auto",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "transition-all duration-300 ease-out overflow-hidden",
          isOpen ? "opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {isOpen && (
          <div className="bg-black-1/60 rounded-md p-3 space-y-1">
            {items.map((itemId) => {
              const item = dataGuideHelpItems[itemId];
              return (
                <div key={itemId}>
                  <button
                    onClick={() => handleItemToggle(itemId)}
                    className={cn(
                      "flex justify-between w-full py-1.5 px-2 items-center text-xs hover:bg-black-1/70 rounded transition-colors",
                      activeItem === itemId &&
                        "border-b border-black-1/80 text-blue-2",
                    )}
                  >
                    <span className="text-left">{t(item.titleKey)}</span>
                    <ChevronDownIcon
                      className={cn(
                        "w-3 h-3 transition-transform",
                        activeItem === itemId && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "transition-all duration-200 ease-out overflow-hidden border-b border-black-1/80",
                      activeItem === itemId
                        ? "opacity-100"
                        : "max-h-0 opacity-0",
                    )}
                  >
                    {activeItem === itemId && (
                      <div className="px-2 py-4 text-xs text-gray-300 leading-relaxed">
                        <Markdown
                          remarkPlugins={[remarkBreaks]}
                          components={{
                            ol: ({ node, children, ...props }) => (
                              <ol
                                {...props}
                                className="list-decimal list-outside mt-2 text-sm"
                              >
                                {children}
                              </ol>
                            ),
                            ul: ({ node, children, ...props }) => (
                              <ul
                                {...props}
                                className="list-disc list-outside ml-3 mt-2 text-sm"
                              >
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
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
