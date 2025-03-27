import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoDataIndicatorProps {
  message?: string;
  className?: string;
}

export const NoDataIndicator: React.FC<NoDataIndicatorProps> = ({ 
  message = "No emissions data available", 
  className = "" 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center text-grey ${className}`}>
            <Info className="h-4 w-4 mr-1" />
            <span>No data</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}; 