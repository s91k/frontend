import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DataGuideItemId, dataGuideHelpItems } from "./items";
import { DataGuideMarkdown } from "./DataGuideMarkdown";

export type NonEmptyArray<T> = [T, ...T[]];
interface ProgressiveDataGuideDesktopProps {
  items: NonEmptyArray<DataGuideItemId>;
}

export function ProgressiveDataGuideDesktop({
  items,
}: ProgressiveDataGuideDesktopProps) {
  const { t } = useTranslation();
  const [activeItemId, setActiveItemId] = useState<DataGuideItemId>(items[0]);

  const activeHelpItem = activeItemId && dataGuideHelpItems[activeItemId];

  return (
    <div className="py-8 mt-2 grid grid-cols-[1fr_2fr] gap-8 min-h-[300px] font-thin">
      {/* Left column - Navigation */}
      <div className="space-y-1">
        {items.map((itemId) => {
          const item = dataGuideHelpItems[itemId];
          return (
            <button
              key={itemId}
              onClick={() => setActiveItemId(itemId)}
              className={cn(
                "flex w-full py-1.5 px-2 items-center hover:bg-black-1/70 transition-colors text-left border-blue-2",
                activeItemId === itemId
                  ? "text-white border-l-2 font-bold"
                  : "text-white/70",
              )}
            >
              <span>{t(item.titleKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Right column - Content */}
      <div className="p-8 bg-black-1/60 rounded-md">
        <div className="text-gray-300 leading-relaxed">
          <h2 className="text-lg font-bold">{t(activeHelpItem.titleKey)}</h2>
          <DataGuideMarkdown item={activeHelpItem} className="max-w-prose" />
        </div>
      </div>
    </div>
  );
}
