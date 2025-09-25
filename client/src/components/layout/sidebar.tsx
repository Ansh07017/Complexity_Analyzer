import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  Search, 
  Share2, 
  GitBranch, 
  Globe, 
  Zap,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sorting Algorithms", href: "/sorting", icon: ArrowUpDown },
  { name: "Searching Algorithms", href: "/searching", icon: Search },
  { name: "Graph Algorithms", href: "/graph", icon: Share2 },
  { name: "Dynamic Programming", href: "/dynamic", icon: GitBranch },
  { name: "Real-World Examples", href: "/examples", icon: Globe }
];

const recentAlgorithms = [
  { name: "Quick Sort", complexity: "O(n log n)", icon: ArrowUpDown, color: "bg-green-100" },
  { name: "Binary Search", complexity: "O(log n)", icon: Target, color: "bg-blue-100" }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`sidebar-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "nav-active"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recently Used</h3>
          <div className="space-y-2">
            {recentAlgorithms.map((algorithm) => {
              const Icon = algorithm.icon;
              
              return (
                <div
                  key={algorithm.name}
                  className="flex items-center p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  data-testid={`recent-${algorithm.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={cn(
                    "w-8 h-8 rounded flex items-center justify-center mr-3",
                    algorithm.color
                  )}>
                    <Icon className="text-gray-600 h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{algorithm.name}</p>
                    <ComplexityBadge 
                      complexity={algorithm.complexity} 
                      className="text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
