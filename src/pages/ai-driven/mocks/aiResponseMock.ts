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
    id: "corporate-emissions-report",
    title: "Corporate Carbon Footprints",
    description:
      "Analysis of the world's largest corporate greenhouse gas emitters and their climate commitments",
    iconSrc: "/src/pages/ai-driven/assets/co2-emissions.svg",
    components: [
      {
        type: "text",
        props: {
          title: "Corporate Climate Responsibility",
          introText:
            "A small number of global corporations are responsible for a disproportionate share of greenhouse gas emissions, presenting both a challenge and an opportunity for climate action.",
          content:
            "Just 100 active fossil fuel producers are linked to 71% of global industrial greenhouse gas emissions since 1988, according to the Carbon Majors Report. These 'carbon majors' include both investor-owned companies and state-owned enterprises across the oil, gas, coal, and cement industries.\n\nWhile fossil fuel companies represent the largest direct and indirect emitters, high-carbon footprints extend across many sectors, including manufacturing, transportation, agriculture, and technology. Despite growing pressure from investors, consumers, and regulators, corporate climate action often falls short of what science indicates is necessary to prevent dangerous warming.\n\nThe concept of 'climate responsibility' for corporations continues to evolve, with increasing focus not just on direct emissions from operations (Scope 1) but also on emissions from purchased energy (Scope 2) and those across the entire value chain (Scope 3), which often represent the largest portion of a company's carbon footprint.",
          imageSrc: "/src/pages/ai-driven/assets/co2-emissions.svg",
          imagePosition: "left",
          imageAlt: "Corporate emissions illustration",
        },
      },
      {
        type: "barchart",
        props: {
          title: "Top 10 Investor-Owned Carbon Emitters (1988-2023)",
          data: [
            { label: "Saudi Aramco", value: 4.5, color: "blue.3" },
            { label: "Chevron", value: 3.92, color: "pink.3" },
            { label: "Gazprom", value: 3.91, color: "blue.4" },
            { label: "ExxonMobil", value: 3.71, color: "pink.4" },
            { label: "BP", value: 3.41, color: "blue.5" },
            { label: "Shell", value: 3.38, color: "pink.5" },
            { label: "National Iranian Oil", value: 2.95, color: "red.3" },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "From Pledges to Progress",
          introText:
            "The corporate response to climate change varies widely, with substantial gaps between ambition and implementation.",
          content:
            "In recent years, there has been a surge in corporate climate pledges, with over 3,000 companies now committed to net-zero emissions targets. However, the quality, scope, and timeline of these commitments vary dramatically.\n\nMany corporate climate strategies rely heavily on carbon offsets rather than absolute emissions reductions. While offsets can play a role in the transition, they are not a substitute for directly reducing emissions, particularly for fossil fuel companies that continue to expand production.\n\nLeading companies are moving beyond incremental approaches to transform their business models, products, and supply chains. This includes shifting investment from fossil fuels to renewables, redesigning products for circularity, and engaging suppliers to reduce upstream emissions. Some are also leveraging their political influence to advocate for stronger climate policies rather than opposing them.\n\nInvestors increasingly recognize climate risk as financial risk, with climate performance becoming a material factor in investment decisions. This has accelerated through initiatives like the Task Force on Climate-related Financial Disclosures (TCFD) and growing shareholder activism on climate issues.",
          imageSrc: null,
        },
      },
      {
        type: "piechart",
        props: {
          title: "Global Emissions by Ownership Type",
          data: [
            { label: "State-Owned Companies", value: 59, color: "orange.2" },
            { label: "Investor-Owned Companies", value: 32, color: "orange.3" },
            { label: "Government-Run Facilities", value: 9, color: "orange.4" },
          ],
        },
      },
      {
        type: "linechart",
        props: {
          title: "Corporate Climate Pledges vs. Actual Emissions (2015-2023)",
          data: [
            { year: "2015", pledged: 100, actual: 100 },
            { year: "2016", pledged: 98, actual: 101 },
            { year: "2017", pledged: 95, actual: 102 },
            { year: "2018", pledged: 93, actual: 104 },
            { year: "2019", pledged: 90, actual: 105 },
            { year: "2020", pledged: 85, actual: 98 },
            { year: "2021", pledged: 80, actual: 103 },
            { year: "2022", pledged: 75, actual: 104 },
            { year: "2023", pledged: 70, actual: 101 },
          ],
          xKey: "year",
          lines: [
            {
              key: "pledged",
              name: "Pledged Emissions (Top 100 Companies, Index)",
              color: "green.3",
            },
            {
              key: "actual",
              name: "Actual Emissions (Top 100 Companies, Index)",
              color: "red.3",
            },
          ],
        },
      },
      {
        type: "text",
        props: {
          title: "The Path Forward for Corporate Climate Action",
          introText:
            "Transforming business models and corporate governance will be essential to align commercial interests with planetary boundaries.",
          content:
            "Effective corporate climate action requires a fundamental shift from treating climate as a peripheral CSR issue to integrating it into core business strategy, risk management, and governance structures. Several key elements are essential for genuine corporate climate leadership:\n\n• Science-based targets aligned with the Paris Agreement's 1.5°C goal\n• Transparent reporting of emissions across all scopes\n• Concrete transition plans with interim milestones and capital allocation aligned with climate goals\n• Integration of climate metrics into executive compensation\n• Climate-competent board oversight and climate scenario planning\n• Policy advocacy supporting rather than undermining climate action\n\nRegulatory frameworks are also evolving rapidly, with mandatory climate disclosure rules being implemented in many jurisdictions. The EU's Corporate Sustainability Reporting Directive (CSRD), the SEC's climate disclosure rule, and various national regulations are creating more standardized requirements for companies to report their climate impacts and risks.\n\nUltimately, addressing corporate emissions requires systemic change in how companies create value. This transition presents both risks for carbon-intensive business models and opportunities for companies that develop climate solutions and successfully adapt to a low-carbon future.",
          imageSrc: null,
        },
      },
    ],
  },
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
          introText:
            "Climate change represents one of the most critical challenges of our time, with wide-ranging impacts on ecosystems and human societies.",
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
          introText:
            "Recent scientific data presents a clear and concerning trajectory for our planet's climate systems.",
          content:
            "The latest climate research indicates that the rate of warming has accelerated in recent decades. The past eight years have been the warmest on record, with 2023 possibly being the warmest year ever recorded.\n\nThis rapid increase in temperatures is consistent with climate models that factor in human greenhouse gas emissions. The scientific consensus is clear: human activity is the dominant cause of observed climate change since the mid-20th century.\n\nMultiple independent lines of evidence support this conclusion, including rising ocean temperatures, retreating glaciers, shifts in plant and animal ranges, and the pattern of warming in the atmosphere and oceans. The physical mechanisms by which greenhouse gases trap heat are well understood and have been established for over a century.",
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
          introText:
            "Rising oceans represent one of the most visible and consequential effects of our warming climate.",
          content:
            "Sea levels have risen by approximately 21-24 centimeters since 1880, with about a third of that occurring in just the last 25 years. The primary causes are thermal expansion of the oceans as they warm and the increased melting of glaciers and ice sheets.\n\nThis rise is accelerating over time, posing significant risks to coastal communities, infrastructure, and ecosystems worldwide. Many low-lying island nations face existential threats, while major coastal cities around the world are developing expensive adaptation strategies to cope with encroaching waters.\n\nThe impacts extend beyond simple inundation, as rising seas also exacerbate coastal erosion, increase the damage from storm surges, and can contaminate freshwater aquifers with saltwater intrusion.",
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
          introText:
            "Scientific models provide increasingly sophisticated predictions of future sea level scenarios, with concerning implications.",
          content:
            "According to the latest IPCC report, global mean sea level is projected to rise by 0.28-0.55 meters by 2100 under a low emissions scenario, but could reach 0.63-1.01 meters under a high emissions scenario.\n\nHowever, these projections do not fully account for potential tipping points in ice sheet dynamics, which could lead to significantly higher sea levels. Some studies suggest sea level rise could exceed 2 meters by 2100 in worst-case scenarios.\n\nEven after emissions cease, sea levels will continue to rise for centuries due to the time lag in ocean warming and ice sheet response. This presents an intergenerational challenge requiring both immediate mitigation efforts to limit warming and long-term adaptation strategies for coastal regions worldwide.",
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
          introText:
            "The transition to clean energy sources represents one of the most promising pathways for addressing climate change.",
          content:
            "Renewable energy has seen unprecedented growth globally, with solar and wind power leading the charge. Costs have fallen dramatically over the past decade, making renewables increasingly competitive with fossil fuels.\n\nThis transition is crucial for meeting global climate goals. To limit warming to 1.5°C, global energy systems must rapidly decarbonize, with renewables playing a central role.\n\nThe transformation is already underway, with many countries setting ambitious renewable energy targets. Technological innovations continue to improve efficiency and reduce costs, while employment in the renewable sector grows steadily. The integration of smart grids, energy storage solutions, and electrification of transport and industry further accelerate this transition.",
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
          introText:
            "Forecasts for renewable energy adoption paint an increasingly optimistic picture for the future of sustainable power generation.",
          content:
            "The International Energy Agency (IEA) projects that renewable energy capacity will expand by over 60% by 2026 compared to 2020 levels, reaching over 4,800 GW. Solar PV alone is expected to account for more than half of this expansion.\n\nWith continued policy support and technological innovation, renewables could potentially supply 90% of global electricity by 2050, dramatically reducing carbon emissions from the power sector.\n\nThe economic case for renewables continues to strengthen as well. In many markets, new renewable installations are already cheaper than continuing to operate existing fossil fuel plants. Long-term purchase agreements for solar and wind now routinely come in at prices below conventional generation, creating a powerful market-driven incentive for the energy transition even in regions without strong climate policies.",
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
          introText:
            "The Arctic region functions as an early warning system for global climate change, experiencing some of the most dramatic transformations on Earth.",
          content:
            "The Arctic is warming at more than twice the global average rate, a phenomenon known as Arctic amplification. This has led to dramatic declines in sea ice extent and thickness.\n\nArctic sea ice reaches its minimum extent each September, at the end of the summer melt season. Satellite observations show that this minimum has decreased by approximately 13% per decade since the late 1970s.\n\nThis transformation is not merely a regional concern but has global implications. The bright white sea ice reflects solar radiation back to space, while the darker ocean water absorbs it. As ice disappears, more heat is absorbed, creating a feedback loop that accelerates warming. Changes in the Arctic also influence atmospheric circulation patterns that can affect weather systems throughout the Northern Hemisphere.",
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
          introText:
            "Arctic changes reverberate throughout Earth's interconnected climate systems, with consequences felt globally.",
          content:
            "The loss of Arctic sea ice has far-reaching consequences beyond the Arctic region itself. These include:\n\n• Accelerated global warming as less sunlight is reflected back to space\n• Changes in ocean circulation patterns\n• Altered atmospheric jet streams affecting weather patterns in mid-latitudes\n• Threats to Arctic ecosystems and indigenous communities\n• New shipping routes and resource extraction opportunities, bringing both economic opportunities and environmental risks\n\nPerhaps most concerning is the potential for permafrost thaw across the Arctic. These frozen soils contain vast amounts of carbon that, when released through thawing, could significantly accelerate climate change. Scientists estimate that permafrost contains nearly twice as much carbon as is currently in the atmosphere, raising the specter of additional feedback loops that could further destabilize the climate system.",
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
          introText:
            "Human-generated carbon dioxide represents the central factor in anthropogenic climate change, with profound implications for planetary systems.",
          content:
            "Carbon dioxide (CO₂) emissions are the primary driver of global climate change. Since the Industrial Revolution, human activities have increased atmospheric CO₂ by more than 45%, from 280 parts per million to over 415 ppm today.\n\nDespite growing awareness and climate commitments, global carbon emissions continue to rise in most years, with only temporary reductions during major economic downturns.\n\nThe persistence of carbon dioxide in the atmosphere compounds the challenge. Once emitted, a significant portion of CO₂ remains in the atmosphere for centuries, creating a long-term warming effect. This means that even if emissions were to stop completely today, the climate would continue to warm for some time, and many changes already set in motion would continue to unfold. This underscores the urgency of both reducing emissions and developing carbon removal technologies.",
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
          introText:
            "Achieving carbon neutrality represents perhaps the greatest collective challenge humanity has ever faced, requiring transformation across all sectors of the global economy.",
          content:
            "To limit global warming to 1.5°C, global carbon emissions must reach net-zero by around 2050. This requires:\n\n• Rapid transition to renewable energy\n• Electrification of transportation and heating\n• Improved energy efficiency\n• Changes in industrial processes\n• Carbon removal technologies\n• Protection and restoration of natural carbon sinks\n\nMany countries and companies have now pledged net-zero targets, but implementation remains challenging and current policies are insufficient to meet these goals.\n\nThe transition to net-zero must also address issues of justice and equity. Historically, wealthy nations have contributed disproportionately to emissions while developing countries often face the most severe climate impacts with fewer resources for adaptation. A just transition requires financial and technological support for developing nations, as well as policies that ensure the costs and benefits of climate action are shared equitably within societies.",
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
