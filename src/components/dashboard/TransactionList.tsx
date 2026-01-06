import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    type: "contribution",
    description: "Monthly Contribution",
    amount: "+£450.00",
    date: "Dec 15, 2024",
    status: "completed",
  },
  {
    id: 2,
    type: "contribution",
    description: "Employer Match",
    amount: "+£225.00",
    date: "Dec 15, 2024",
    status: "completed",
  },
  {
    id: 3,
    type: "growth",
    description: "Investment Returns",
    amount: "+£1,234.50",
    date: "Dec 10, 2024",
    status: "completed",
  },
  {
    id: 4,
    type: "fee",
    description: "Management Fee",
    amount: "-£45.00",
    date: "Dec 1, 2024",
    status: "completed",
  },
  {
    id: 5,
    type: "contribution",
    description: "Bonus Contribution",
    amount: "+£2,000.00",
    date: "Nov 28, 2024",
    status: "pending",
  },
];

export function TransactionList() {
  return (
    <div className="metric-card animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="section-title text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest transactions and updates</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline transition-all">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-2 rounded-lg",
                transaction.type === "contribution" && "bg-success-light text-accent",
                transaction.type === "growth" && "bg-success-light text-accent",
                transaction.type === "fee" && "bg-secondary text-muted-foreground"
              )}>
                {transaction.type === "contribution" && <ArrowDownLeft className="h-4 w-4" />}
                {transaction.type === "growth" && <ArrowUpRight className="h-4 w-4" />}
                {transaction.type === "fee" && <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-semibold",
                transaction.amount.startsWith("+") ? "text-accent" : "text-foreground"
              )}>
                {transaction.amount}
              </p>
              {transaction.status === "pending" && (
                <span className="inline-flex items-center gap-1 text-xs text-warning">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
