import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  xKey: string;
  lines: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
}

export function LineChart({ data, xKey, lines, title }: LineChartProps) {
  const getColor = (colorKey: string) => {
    const [palette, shade] = colorKey.split(".");
    return `var(--${palette}-${shade})`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black-1 px-3 py-2 rounded-level-2 text-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="text-sm flex justify-between gap-4"
            >
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-black-2 rounded-level-2 p-6">
      {title && (
        <h3 className="text-sm font-light text-grey mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: "#878787", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            tick={{ fill: "#878787", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="line"
            wrapperStyle={{ fontSize: "12px", color: "#878787" }}
          />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={getColor(line.color)}
              activeDot={{ r: 8, fill: getColor(line.color) }}
              strokeWidth={2}
              dot={{ fill: getColor(line.color), r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}