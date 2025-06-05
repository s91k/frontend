import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataGuideItemId, dataGuideHelpItems } from "./guide-items";

interface ProgressiveDataGuideProps {
  items: DataGuideItemId[];
}

export function ProgressiveDataGuide({ items }: ProgressiveDataGuideProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleItemToggle = (key: string) => 
    setActiveItem(activeItem === key ? null : key);

  return (
    <div className="space-y-2">
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
        <span>Learn about the metrics</span>
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
          <div className="bg-gray-800/20 rounded-md p-3 space-y-1">
            {items.map((itemId) => {
              const item = dataGuideHelpItems[itemId];
              return (
                <div key={itemId}>
                  <button
                    onClick={() => handleItemToggle(itemId)}
                    className={cn(
                      "flex justify-between w-full py-1.5 px-2 items-center text-xs hover:bg-gray-700/30 rounded transition-colors",
                      activeItem === itemId && "border-b border-gray-600/20",
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
                      "transition-all duration-200 ease-out overflow-hidden border-b border-gray-600/20",
                      activeItem === itemId ? "opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {activeItem === itemId && (
                      <div className="px-2 pb-2 pt-1 text-xs text-gray-300 leading-relaxed">
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