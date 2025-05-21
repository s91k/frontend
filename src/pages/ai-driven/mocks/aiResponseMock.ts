export interface ComponentConfig {
  type: "text" | "barchart" | "linechart" | "piechart" | "image";
  props: any;
}

export interface AIResponseType {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  components: ComponentConfig[];
}

export const aiResponseMock: AIResponseType[] = [
  {
    id: "global-warming-overview",
    title: "Global Warming Overview",
    description:
      "A comprehensive overview of the latest climate change data and trends",
    iconSrc: "/src/pages/ai-driven/assets/temperature.svg",
    components: [
      {
        type: "text",
        props: {
          title: "The State of Global Warming",
          content:
            "Global temperatures have risen by approximately 1.1°C since the pre-industrial era. This warming is primarily caused by human activities, particularly the emission of greenhouse gases like carbon dioxide and methane.\n\nThe consequences of this warming are already visible worldwide: more extreme weather events, rising sea levels, and disruptions to ecosystems. Without significant action to reduce emissions, scientists project that global temperatures could rise by 2.7°C or more by the end of this century.",
          imageSrc: "/src/pages/ai-driven/assets/temperature.svg",
          imagePosition: "right",
          imageAlt: "Global temperature rise illustration",
        },
      },
      {
        type: "linechart",
        props: {
          title: "Global Temperature Anomalies (1880-2023)",
          data: [
            { year: "1880", value: -0.16 },
            { year: "1900", value: -0.08 },
            { year: "1920", value: -0.27 },
            { year: "1940", value: 0.12 },
            { year: "1960", value: -0.03 },
            { year: "1980", value: 0.26 },
            { year: "2000", value: 0.42 },
            { year: "2020", value: 1.02 },
            { year: "2023", value: 1.18 },
          ],
          xKey: "year",
          lines: [
            {
              key: "value",
              name: "Temperature Anomaly (°C)",
              color: "orange.3",
            },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "Key Findings",
          content:
            "The latest climate research indicates that the rate of warming has accelerated in recent decades. The past eight years have been the warmest on record, with 2023 possibly being the warmest year ever recorded.\n\nThis rapid increase in temperatures is consistent with climate models that factor in human greenhouse gas emissions. The scientific consensus is clear: human activity is the dominant cause of observed climate change since the mid-20th century.",
          imageSrc: null,
        },
      },
      {
        type: "barchart",
        props: {
          data: [
            { label: "Energy", value: 73.2, color: "pink.3" },
            { label: "Agriculture", value: 18.4, color: "pink.3" },
            { label: "Industrial Processes", value: 5.2, color: "pink.3" },
            { label: "Waste", value: 3.2, color: "pink.3" },
          ],
        },
      },
    ],
  },
  {
    id: "sea-level-report",
    title: "Rising Seas: Global Impact",
    description: "Analysis of sea level rise data and future projections",
    iconSrc: "/src/pages/ai-driven/assets/sea-level.svg",
    components: [
      {
        type: "text",
        props: {
          title: "Sea Level Rise: A Growing Threat",
          content:
            "Sea levels have risen by approximately 21-24 centimeters since 1880, with about a third of that occurring in just the last 25 years. The primary causes are thermal expansion of the oceans as they warm and the increased melting of glaciers and ice sheets.\n\nThis rise is accelerating over time, posing significant risks to coastal communities, infrastructure, and ecosystems worldwide.",
          imageSrc: "/src/pages/ai-driven/assets/sea-level.svg",
          imagePosition: "left",
          imageAlt: "Sea level rise illustration",
        },
      },
      {
        type: "linechart",
        props: {
          title: "Global Mean Sea Level Rise (1900-2020)",
          data: [
            { year: "1900", value: 0 },
            { year: "1920", value: 1.8 },
            { year: "1940", value: 3.5 },
            { year: "1960", value: 6.2 },
            { year: "1980", value: 9.4 },
            { year: "2000", value: 15.2 },
            { year: "2020", value: 23.8 },
          ],
          xKey: "year",
          lines: [
            {
              key: "value",
              name: "Sea Level Rise (cm)",
              color: "blue.3",
            },
          ],
        },
      },
      {
        type: "image",
        props: {
          imageSrc: "/src/pages/ai-driven/assets/sea-level.svg",
          caption:
            "Coastal flooding is expected to increase as sea levels continue to rise",
          altText: "Coastal flooding due to sea level rise",
          width: "large",
        },
      },
      {
        type: "text",
        props: {
          title: "Future Projections",
          content:
            "According to the latest IPCC report, global mean sea level is projected to rise by 0.28-0.55 meters by 2100 under a low emissions scenario, but could reach 0.63-1.01 meters under a high emissions scenario.\n\nHowever, these projections do not fully account for potential tipping points in ice sheet dynamics, which could lead to significantly higher sea levels. Some studies suggest sea level rise could exceed 2 meters by 2100 in worst-case scenarios.",
          imageSrc: null,
        },
      },
    ],
  },
  {
    id: "renewable-energy-transition",
    title: "Renewable Energy Transition",
    description:
      "Analysis of global renewable energy adoption and future potential",
    iconSrc: "/src/pages/ai-driven/assets/renewable-energy.svg",
    components: [
      {
        type: "text",
        props: {
          title: "The Renewable Energy Revolution",
          content:
            "Renewable energy has seen unprecedented growth globally, with solar and wind power leading the charge. Costs have fallen dramatically over the past decade, making renewables increasingly competitive with fossil fuels.\n\nThis transition is crucial for meeting global climate goals. To limit warming to 1.5°C, global energy systems must rapidly decarbonize, with renewables playing a central role.",
          imageSrc: "/src/pages/ai-driven/assets/renewable-energy.svg",
          imagePosition: "right",
          imageAlt: "Renewable energy illustration",
        },
      },
      {
        type: "piechart",
        props: {
          data: [
            { label: "Solar", value: 28, color: "orange.2" },
            { label: "Wind", value: 37, color: "orange.3" },
            { label: "Hydro", value: 32, color: "orange.4" },
            { label: "Other", value: 3, color: "orange.5" },
          ],
        },
      },
      {
        type: "linechart",
        props: {
          title: "Renewable Energy Capacity Growth (2000-2023)",
          data: [
            { year: "2000", solar: 1, wind: 17, hydro: 783 },
            { year: "2005", solar: 5, wind: 59, hydro: 826 },
            { year: "2010", solar: 40, wind: 181, hydro: 935 },
            { year: "2015", solar: 227, wind: 433, hydro: 1096 },
            { year: "2020", solar: 714, wind: 733, hydro: 1170 },
            { year: "2023", solar: 1250, wind: 906, hydro: 1230 },
          ],
          xKey: "year",
          lines: [
            {
              key: "solar",
              name: "Solar (GW)",
              color: "orange.3",
            },
            {
              key: "wind",
              name: "Wind (GW)",
              color: "green.3",
            },
            {
              key: "hydro",
              name: "Hydro (GW)",
              color: "blue.3",
            },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "Future Outlook",
          content:
            "The International Energy Agency (IEA) projects that renewable energy capacity will expand by over 60% by 2026 compared to 2020 levels, reaching over 4,800 GW. Solar PV alone is expected to account for more than half of this expansion.\n\nWith continued policy support and technological innovation, renewables could potentially supply 90% of global electricity by 2050, dramatically reducing carbon emissions from the power sector.",
          imageSrc: null,
        },
      },
    ],
  },
  {
    id: "arctic-ice-loss",
    title: "Arctic Ice Loss Report",
    description:
      "Detailed analysis of Arctic sea ice decline and its global implications",
    iconSrc: "/src/pages/ai-driven/assets/arctic-ice.svg",
    components: [
      {
        type: "text",
        props: {
          title: "The Rapidly Changing Arctic",
          content:
            "The Arctic is warming at more than twice the global average rate, a phenomenon known as Arctic amplification. This has led to dramatic declines in sea ice extent and thickness.\n\nArctic sea ice reaches its minimum extent each September, at the end of the summer melt season. Satellite observations show that this minimum has decreased by approximately 13% per decade since the late 1970s.",
          imageSrc: "/src/pages/ai-driven/assets/arctic-ice.svg",
          imagePosition: "left",
          imageAlt: "Arctic ice illustration",
        },
      },
      {
        type: "linechart",
        props: {
          title: "Arctic Sea Ice Extent (1979-2023)",
          data: [
            { year: "1979", value: 7.05 },
            { year: "1985", value: 6.93 },
            { year: "1990", value: 6.24 },
            { year: "1995", value: 6.13 },
            { year: "2000", value: 6.32 },
            { year: "2005", value: 5.57 },
            { year: "2010", value: 4.9 },
            { year: "2015", value: 4.68 },
            { year: "2020", value: 3.92 },
            { year: "2023", value: 4.23 },
          ],
          xKey: "year",
          lines: [
            {
              key: "value",
              name: "September Sea Ice Extent (million km²)",
              color: "blue.4",
            },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "Global Impacts",
          content:
            "The loss of Arctic sea ice has far-reaching consequences beyond the Arctic region itself. These include:\n\n• Accelerated global warming as less sunlight is reflected back to space\n• Changes in ocean circulation patterns\n• Altered atmospheric jet streams affecting weather patterns in mid-latitudes\n• Threats to Arctic ecosystems and indigenous communities\n• New shipping routes and resource extraction opportunities, bringing both economic opportunities and environmental risks",
          imageSrc: null,
        },
      },
      {
        type: "barchart",
        props: {
          data: [
            { label: "1980s", value: 7.0, color: "blue.5" },
            { label: "1990s", value: 6.3, color: "blue.4" },
            { label: "2000s", value: 5.7, color: "blue.3" },
            { label: "2010s", value: 4.4, color: "blue.2" },
            { label: "2020s", value: 4.1, color: "blue.1" },
          ],
        },
      },
    ],
  },
  {
    id: "carbon-emissions-report",
    title: "Global Carbon Emissions",
    description: "Analysis of carbon dioxide emissions by sector and country",
    iconSrc: "/src/pages/ai-driven/assets/co2-emissions.svg",
    components: [
      {
        type: "text",
        props: {
          title: "Carbon Emissions: The Climate Challenge",
          content:
            "Carbon dioxide (CO₂) emissions are the primary driver of global climate change. Since the Industrial Revolution, human activities have increased atmospheric CO₂ by more than 45%, from 280 parts per million to over 415 ppm today.\n\nDespite growing awareness and climate commitments, global carbon emissions continue to rise in most years, with only temporary reductions during major economic downturns.",
          imageSrc: "/src/pages/ai-driven/assets/co2-emissions.svg",
          imagePosition: "right",
          imageAlt: "Carbon emissions illustration",
        },
      },
      {
        type: "piechart",
        props: {
          data: [
            { label: "Electricity & Heat", value: 31, color: "pink.2" },
            { label: "Transportation", value: 16, color: "pink.3" },
            { label: "Manufacturing", value: 12, color: "pink.4" },
            { label: "Buildings", value: 8, color: "pink.5" },
            { label: "Other Energy", value: 6, color: "pink.6" },
          ],
        },
      },
      {
        type: "barchart",
        props: {
          data: [
            { label: "China", value: 27.2, color: "pink.3" },
            { label: "United States", value: 14.5, color: "pink.3" },
            { label: "EU", value: 8.7, color: "pink.3" },
            { label: "India", value: 7.1, color: "pink.3" },
            { label: "Russia", value: 4.7, color: "pink.3" },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "The Path to Net-Zero",
          content:
            "To limit global warming to 1.5°C, global carbon emissions must reach net-zero by around 2050. This requires:\n\n• Rapid transition to renewable energy\n• Electrification of transportation and heating\n• Improved energy efficiency\n• Changes in industrial processes\n• Carbon removal technologies\n• Protection and restoration of natural carbon sinks\n\nMany countries and companies have now pledged net-zero targets, but implementation remains challenging and current policies are insufficient to meet these goals.",
          imageSrc: null,
        },
      },
      {
        type: "linechart",
        props: {
          title: "Global Carbon Emissions (1900-2020)",
          data: [
            { year: "1900", value: 2 },
            { year: "1920", value: 3.5 },
            { year: "1940", value: 4.8 },
            { year: "1960", value: 9.4 },
            { year: "1980", value: 19.5 },
            { year: "2000", value: 24.8 },
            { year: "2010", value: 33.1 },
            { year: "2020", value: 34.8 },
          ],
          xKey: "year",
          lines: [
            {
              key: "value",
              name: "CO₂ Emissions (Gt)",
              color: "green.3",
            },
          ],
        },
      },
    ],
  },
];
