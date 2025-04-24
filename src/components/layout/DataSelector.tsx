import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { t } from "i18next";

interface DataSelectorProps<T> {
  label: string;
  selectedItem: T;
  items: T[];
  onItemChange: (item: T) => void;
  getItemLabel: (item: T) => string;
  getItemKey: (item: T) => string;
}

export function DataSelector<T>({
  label,
  selectedItem,
  items,
  onItemChange,
  getItemLabel,
  getItemKey,
}: DataSelectorProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-black-2 rounded-2xl p-4 mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-black-1 text-white transition-colors"
          >
            <span className="text-left font-medium">
              {getItemLabel(selectedItem)}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-black-1 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
              {items.map((item) => (
                <button
                  key={getItemKey(item)}
                  onClick={() => {
                    onItemChange(item);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors
                    ${
                      getItemKey(item) === getItemKey(selectedItem)
                        ? "bg-gray-700/80 text-blue-300"
                        : "text-white hover:bg-gray-700/80"
                    }
                  `}
                >
                  <span className="font-medium">{getItemLabel(item)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
