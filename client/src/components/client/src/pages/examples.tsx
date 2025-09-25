import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { RealWorldExample } from "@/types/algorithm";
import { Route, Truck, Users, BookOpen, ArrowRight } from "lucide-react";

const realWorldExamples: RealWorldExample[] = [
  {
    id: "gps-navigation",
    title: "GPS Navigation",
    algorithm: "Dijkstra's Algorithm",
    description: "Apps like Google Maps use Dijkstra's algorithm to find the shortest route between locations, considering traffic and road conditions.",
    icon: "route",
    imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    complexity: "O(V²)",
    category: "graph"
  },
  {
    id: "social-media",
    title: "Friend Suggestions",
    algorithm: "BFS Algorithm",
    description: "Social platforms use BFS to suggest friends by exploring mutual connections and finding people within your network.",
    icon: "users",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    complexity: "O(V + E)",
    category: "graph"
  },
  {
    id: "library-search",
    title: "Library Search",
    algorithm: "Binary Search",
    description: "Library systems use binary search to quickly locate books in their sorted catalog databases by ISBN or title.",
    icon: "book",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    complexity: "O(log n)",
    category: "searching"
  },
  {
    id: "package-delivery",
    title: "Package Delivery",
    algorithm: "TSP Algorithm",
    description: "Delivery companies use TSP algorithms to optimize delivery routes, minimizing travel time and fuel costs.",
    icon: "truck",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
    complexity: "O(n!)",
    category: "graph"
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "route":
      return Route;
    case "users":
      return Users;
    case "book":
      return BookOpen;
    case "truck":
      return Truck;
    default:
      return Route;
  }
};

const getGradientClass = (category: string) => {
  switch (category) {
    case "graph":
      return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900";
    case "searching":
      return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900";
    default:
      return "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900";
  }
};

const getIconColor = (category: string) => {
  switch (category) {
    case "graph":
      return "text-blue-600 dark:text-blue-400";
    case "searching":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-purple-600 dark:text-purple-400";
  }
};

export default function ExamplesPage() {
  const handleTryDemo = (exampleId: string) => {
    // Navigate to the appropriate algorithm page
    const example = realWorldExamples.find(ex => ex.id === exampleId);
    if (example) {
      window.location.href = `/${example.category}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Real-World Applications</h1>
        <p className="text-muted-foreground">
          Discover how algorithms power the technology you use every day
        </p>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {realWorldExamples.map((example) => {
          const Icon = getIcon(example.icon);
          
          return (
            <Card 
              key={example.id} 
              className={`${getGradientClass(example.category)} border overflow-hidden`}
              data-testid={`example-card-${example.id}`}
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={example.imageUrl} 
                  alt={example.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Icon className={`text-xl mr-3 h-6 w-6 ${getIconColor(example.category)}`} />
                  <h3 className="text-lg font-semibold">{example.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {example.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <ComplexityBadge complexity={example.complexity} />
                    <span className="text-xs text-muted-foreground">
                      {example.algorithm}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleTryDemo(example.id)}
                    variant="outline"
                    size="sm"
                    className="transition-colors"
                    data-testid={`button-try-demo-${example.id}`}
                  >
                    Try Demo
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Content */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Why These Algorithms Matter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Pathfinding algorithms save millions of hours by finding optimal routes in real-time.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold mb-2">Social Networks</h4>
                <p className="text-sm text-muted-foreground">
                  Graph algorithms connect billions of people and help discover new relationships.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2">Information Retrieval</h4>
                <p className="text-sm text-muted-foreground">
                  Search algorithms make finding information instantaneous across vast databases.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-semibold mb-2">Logistics</h4>
                <p className="text-sm text-muted-foreground">
                  Optimization algorithms reduce costs and environmental impact in delivery systems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
