import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon,
  delay = 0 
}: MetricCardProps) {
  return (
    <div 
      className="metric-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="stat-label">{title}</p>
          <p className="stat-value text-foreground">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              changeType === "positive" && "text-accent",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "positive" && <TrendingUp className="h-4 w-4" />}
              {changeType === "negative" && <TrendingDown className="h-4 w-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/5 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
