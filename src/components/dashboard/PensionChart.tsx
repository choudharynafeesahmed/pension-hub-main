import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", value: 245000 },
  { month: "Feb", value: 248500 },
  { month: "Mar", value: 252000 },
  { month: "Apr", value: 249800 },
  { month: "May", value: 258000 },
  { month: "Jun", value: 265000 },
  { month: "Jul", value: 272000 },
  { month: "Aug", value: 278500 },
  { month: "Sep", value: 285000 },
  { month: "Oct", value: 292000 },
  { month: "Nov", value: 298500 },
  { month: "Dec", value: 312450 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-strong border border-border">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">
          £{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function PensionChart() {
  return (
    <div className="metric-card animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="mb-6">
        <h3 className="section-title text-foreground">Pension Growth</h3>
        <p className="text-sm text-muted-foreground mt-1">Your pension value over the past 12 months</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
