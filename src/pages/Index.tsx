import { Wallet, TrendingUp, PiggyBank, Target } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PensionChart } from "@/components/dashboard/PensionChart";
import { AllocationCard } from "@/components/dashboard/AllocationCard";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ProjectionCard } from "@/components/dashboard/ProjectionCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Good afternoon, Sarah
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your pension portfolio
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Pension Value"
            value="£312,450"
            change="+4.5% this month"
            changeType="positive"
            icon={<Wallet className="h-6 w-6" />}
            delay={0}
          />
          <MetricCard
            title="Annual Growth"
            value="£27,450"
            change="+8.2% vs last year"
            changeType="positive"
            icon={<TrendingUp className="h-6 w-6" />}
            delay={50}
          />
          <MetricCard
            title="Your Contributions"
            value="£5,400/yr"
            change="£450 monthly"
            changeType="neutral"
            icon={<PiggyBank className="h-6 w-6" />}
            delay={100}
          />
          <MetricCard
            title="Employer Match"
            value="£2,700/yr"
            change="50% of your contribution"
            changeType="positive"
            icon={<Target className="h-6 w-6" />}
            delay={150}
          />
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PensionChart />
          </div>
          <AllocationCard />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectionCard />
          <TransactionList />
        </div>
      </main>
    </div>
  );
};

export default Index;
