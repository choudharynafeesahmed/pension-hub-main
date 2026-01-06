import { Target, Calendar, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProjectionCard() {
  const currentAge = 45;
  const retirementAge = 67;
  const yearsToRetirement = retirementAge - currentAge;
  const progressPercentage = ((currentAge - 25) / (retirementAge - 25)) * 100;
  
  return (
    <div className="metric-card animate-slide-up" style={{ animationDelay: "350ms" }}>
      <div className="mb-6">
        <h3 className="section-title text-foreground">Retirement Projection</h3>
        <p className="text-sm text-muted-foreground mt-1">Your path to retirement</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Years to Retirement</p>
              <p className="text-xl font-bold text-foreground">{yearsToRetirement} years</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Target Age</p>
            <p className="text-xl font-bold text-foreground">{retirementAge}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Journey Progress</span>
            <span className="font-medium text-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="p-4 rounded-xl bg-success-light border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Projected Pension at 67</p>
              <p className="text-2xl font-bold text-accent mt-1">£892,500</p>
              <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>On track to meet your goal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
