import { TooltipProps } from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const dataKey = payload[0]?.dataKey;
  if (!dataKey) return null;

  if (typeof dataKey !== "string") return null;

  const [sector] = dataKey.split("_scope");
  const scope1 =
    payload.find((p) => p.dataKey === `${sector}_scope1`)?.value || 0;
  const scope2 =
    payload.find((p) => p.dataKey === `${sector}_scope2`)?.value || 0;
  const scope3 =
    payload.find((p) => p.dataKey === `${sector}_scope3`)?.value || 0;
  const total = scope1 + scope2 + scope3;

  return (
    <div className="bg-black-2 border border-black-1 rounded-lg shadow-xl p-4 text-white">
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="mb-3">
        <p className="text-sm font-medium mb-2">{sector}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-grey">
            <span>Scope 1:</span>
            <span className="font-medium text-white">
              {Math.round(Number(scope1)).toLocaleString()} tCO₂e
            </span>
          </div>
          <div className="flex justify-between text-sm text-grey">
            <span>Scope 2:</span>
            <span className="font-medium text-white">
              {Math.round(Number(scope2)).toLocaleString()} tCO₂e
            </span>
          </div>
          <div className="flex justify-between text-sm text-grey">
            <span>Scope 3:</span>
            <span className="font-medium text-white">
              {Math.round(Number(scope3)).toLocaleString()} tCO₂e
            </span>
          </div>
          <div className="pt-2 border-t border-black-1">
            <div className="flex justify-between text-sm">
              <span className="text-grey">Total:</span>
              <span className="font-medium text-white">
                {Number(total).toLocaleString()} tCO₂e
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
