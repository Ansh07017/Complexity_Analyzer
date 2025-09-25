import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplexityBadge } from "@/components/algorithm/complexity-badge";
import { getCategoryIcon, getCategoryColor } from "@/lib/algorithms";
import { Search, TrendingUp } from "lucide-react";
import { Algorithm } from "@shared/schema";

const categories = [
  { id: "sorting", name: "Sorting Algorithms", description: "Quick Sort, Merge Sort, Bubble Sort, and more" },
  { id: "searching", name: "Searching Algorithms", description: "Binary Search, Linear Search, Hash Search" },
  { id: "graph", name: "Graph Algorithms", description: "BFS, DFS, Dijkstra, TSP, and more" },
  { id: "dynamic-programming", name: "Dynamic Programming", description: "Fibonacci, Knapsack, Longest Subsequence" }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: algorithms = [], isLoading } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });

  const filteredAlgorithms = algorithms.filter(algorithm => {
    const matchesSearch = algorithm.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || algorithm.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularAlgorithms = algorithms.filter(algorithm => algorithm.isPopular);

  const getCategoryStats = (categoryId: string) => {
    return algorithms.filter(alg => alg.category === categoryId).length;
  };

  const getCategoryComplexities = (categoryId: string) => {
    const categoryAlgorithms = algorithms.filter(alg => alg.category === categoryId);
    const complexities = Array.from(new Set(categoryAlgorithms.map(alg => alg.timeComplexity)));
    return complexities.slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading algorithms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Algorithm Dashboard</h2>
            <p className="text-muted-foreground">Explore and visualize algorithm complexities</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
                data-testid="input-search-algorithms"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sorting">Sorting</SelectItem>
                <SelectItem value="searching">Searching</SelectItem>
                <SelectItem value="graph">Graph</SelectItem>
                <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Algorithm Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => {
            const algorithmCount = getCategoryStats(category.id);
            const complexities = getCategoryComplexities(category.id);
            
            return (
              <Link
                key={category.id}
                href={`/${category.id === "dynamic-programming" ? "dynamic" : category.id}`}
                data-testid={`category-card-${category.id}`}
              >
                <div className="algorithm-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${getCategoryColor(category.id)} rounded-lg flex items-center justify-center`}>
                      <i className={`${getCategoryIcon(category.id)} text-gray-600 text-xl`} />
                    </div>
                    <span className="complexity-badge px-2 py-1 bg-muted text-muted-foreground rounded">
                      {algorithmCount} algorithms
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {complexities.map((complexity) => (
                      <ComplexityBadge key={complexity} complexity={complexity} />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Popular Algorithms Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Popular Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularAlgorithms.map((algorithm) => (
                <Link
                  key={algorithm.id}
                  href={`/${algorithm.category}`}
                  data-testid={`popular-algorithm-${algorithm.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                    <div className={`w-10 h-10 ${getCategoryColor(algorithm.category)} rounded-lg flex items-center justify-center mr-4`}>
                      <i className={`${getCategoryIcon(algorithm.category)} text-gray-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{algorithm.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {algorithm.description}
                      </p>
                    </div>
                    <ComplexityBadge complexity={algorithm.timeComplexity} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filtered Results */}
      {(searchQuery || selectedCategory !== "all") && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                Search Results ({filteredAlgorithms.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAlgorithms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No algorithms found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAlgorithms.map((algorithm) => (
                    <Link
                      key={algorithm.id}
                      href={`/${algorithm.category}`}
                      data-testid={`search-result-${algorithm.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                        <div className={`w-10 h-10 ${getCategoryColor(algorithm.category)} rounded-lg flex items-center justify-center mr-4`}>
                          <i className={`${getCategoryIcon(algorithm.category)} text-gray-600`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{algorithm.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {algorithm.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <ComplexityBadge complexity={algorithm.timeComplexity} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {algorithm.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
