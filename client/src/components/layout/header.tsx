import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, BarChart3 } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Algorithms", href: "/sorting" },
  { name: "Examples", href: "/examples" },
  { name: "Guide", href: "/guide" }
];

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Complexity Analyzer</h1>
              <p className="text-sm text-muted-foreground">Enhanced Algorithm Visualization</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                <Button
                  variant={location === item.href ? "default" : "ghost"}
                  size="sm"
                  className={location === item.href ? "nav-active" : ""}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
          
          <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
