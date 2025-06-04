import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type SidebarGuideItemProps = {
  title: string;
  children: React.ReactNode;
};

export const SidebarGuideItem = ({
  title,
  children,
}: SidebarGuideItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mt-1 first:mt-2 bg-blue-5/40 rounded-md px-3 py-1"
    >
      <CollapsibleTrigger asChild>
        <button className="flex justify-between w-full py-2 items-center text-sm hover:bg-blue-5/20 rounded transition-colors">
          <span className="text-left font-medium">{title}</span>
          <div className="ml-2 flex-shrink-0">
            {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-gray-400/50 pt-2 pb-1 text-sm">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
