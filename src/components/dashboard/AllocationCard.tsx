import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Equities", value: 55, color: "hsl(222, 60%, 20%)" },
  { name: "Bonds", value: 25, color: "hsl(160, 84%, 39%)" },
  { name: "Property", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Cash", value: 8, color: "hsl(220, 14%, 75%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 rounded-lg shadow-strong border border-border">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-semibold text-foreground">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function AllocationCard() {
  return (
    <div className="metric-card animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="mb-6">
        <h3 className="section-title text-foreground">Asset Allocation</h3>
        <p className="text-sm text-muted-foreground mt-1">Current investment distribution</p>
      </div>
      <div className="flex items-center gap-8">
        <div className="h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground font-medium">{item.name}</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
