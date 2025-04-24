import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { t } from "i18next";

interface MethodsDataSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const methods = [
  "parisAgreement",
  "sources",
  "calculations",
  "companyDataCollection",
  "co2Budgets",
  "emissionTypes",
];

const MethodsDataSelector = ({
  selectedMethod,
  onMethodChange,
}: MethodsDataSelectorProps) => {
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
          <span className="text-sm font-medium text-white">
            {t("methodsPage.dataSelector.label")}
          </span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-black-1 text-white transition-colors"
          >
            <span className="text-left font-medium">
              {t(`methodsPage.accordion.${selectedMethod}.title`)}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-black-1 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
              {methods.map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    onMethodChange(method);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors
                    ${
                      selectedMethod === method
                        ? "bg-gray-700/80 text-blue-300"
                        : "text-white hover:bg-gray-700/80"
                    }
                  `}
                >
                  <span className="font-medium">
                    {t(`methodsPage.accordion.${method}.title`)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MethodsDataSelector;
