import React from "react";
import { ComponentConfig } from "../mocks/aiResponseMock";
import { TextSection } from "./TextSection";
import { ImageSection } from "./ImageSection";
import { LineChart } from "./LineChart";
import { BarChart } from "@/components/graphs/BarChart";
import { DonutChart } from "@/components/graphs/DonutChart";

interface PageRendererProps {
  components: ComponentConfig[];
}

export function PageRenderer({ components }: PageRendererProps) {
  if (!components || components.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-grey text-lg">No content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {components.map((component, index) => {
        switch (component.type) {
          case "text":
            return <TextSection key={index} {...component.props} />;
          case "image":
            return <ImageSection key={index} {...component.props} />;
          case "linechart":
            return <LineChart key={index} {...component.props} />;
          case "barchart":
            return <BarChart key={index} data={component.props.data} />;
          case "piechart":
            return <DonutChart key={index} data={component.props.data} />;
          default:
            return (
              <div key={index} className="p-4 bg-black-2 rounded-level-2 text-grey">
                Unknown component type: {component.type}
              </div>
            );
        }
      })}
    </div>
  );
}