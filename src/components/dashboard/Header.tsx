import { Bell, Settings, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg font-heading">P</span>
              </div>
              <span className="text-xl font-bold text-foreground font-heading">PensionHub</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="nav-link text-foreground">Dashboard</a>
              <a href="#" className="nav-link">Investments</a>
              <a href="#" className="nav-link">Contributions</a>
              <a href="#" className="nav-link">Documents</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Premium Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
