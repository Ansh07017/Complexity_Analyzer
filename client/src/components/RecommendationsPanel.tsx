import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, BookOpen, ExternalLink } from "lucide-react";
import type { 
  AnalysisWarningType, 
  RecommendationType, 
  LearningResourceType
} from "@shared/schema";
import {
  isAnalysisWarningArray,
  isRecommendationArray,
  isLearningResourceArray
} from "@shared/schema";

interface RecommendationsPanelProps {
  warnings?: AnalysisWarningType[] | null;
  recommendations?: RecommendationType[] | null;
  learningResources?: LearningResourceType[] | null;
}

export default function RecommendationsPanel({ 
  warnings, 
  recommendations, 
  learningResources 
}: RecommendationsPanelProps) {
  const warningsArray: AnalysisWarningType[] = isAnalysisWarningArray(warnings) ? warnings : [];
  const recommendationsArray: RecommendationType[] = isRecommendationArray(recommendations) ? recommendations : [];
  const resourcesArray: LearningResourceType[] = isLearningResourceArray(learningResources) ? learningResources : [];

  return (
    <Card data-testid="recommendations-panel">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Recommendations</h3>
      </div>
      <CardContent className="p-4 space-y-4">
        {/* Warnings */}
        {warningsArray.length > 0 && (
          <div className="space-y-3">
            {warningsArray.map((warning, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${getWarningStyles(warning.severity)}`}
                data-testid={`warning-${index}`}
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getWarningIconColor(warning.severity)}`} />
                  <div>
                    <p className={`font-medium ${getWarningTextColor(warning.severity)}`}>
                      {getWarningTitle(warning.type)}
                    </p>
                    <p className={`text-sm mt-1 ${getWarningDescriptionColor(warning.severity)}`}>
                      {warning.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {recommendationsArray.length > 0 && (
          <div className="space-y-3">
            {recommendationsArray.map((recommendation, index) => (
              <div 
                key={index} 
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                data-testid={`recommendation-${index}`}
              >
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{recommendation.title}</p>
                    <p className="text-blue-700 text-sm mt-1">{recommendation.description}</p>
                    {recommendation.links && recommendation.links.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {recommendation.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                            data-testid={`recommendation-link-${index}-${linkIndex}`}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Learn more
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Resources */}
        {resourcesArray.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span>Learning Resources</span>
            </h4>
            <div className="space-y-2">
              {resourcesArray.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid={`learning-resource-${index}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 ${getSourceColor(resource.source)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {warningsArray.length === 0 && recommendationsArray.length === 0 && resourcesArray.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Complete the analysis to see suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getWarningStyles(severity: string): string {
  switch (severity) {
    case "high":
      return "bg-red-50 border-red-200";
    case "medium":
      return "bg-amber-50 border-amber-200";
    case "low":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
}

function getWarningIconColor(severity: string): string {
  switch (severity) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-amber-600";
    case "low":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}

function getWarningTextColor(severity: string): string {
  switch (severity) {
    case "high":
      return "text-red-900";
    case "medium":
      return "text-amber-900";
    case "low":
      return "text-yellow-900";
    default:
      return "text-gray-900";
  }
}

function getWarningDescriptionColor(severity: string): string {
  switch (severity) {
    case "high":
      return "text-red-700";
    case "medium":
      return "text-amber-700";
    case "low":
      return "text-yellow-700";
    default:
      return "text-gray-700";
  }
}

function getWarningTitle(type: string): string {
  switch (type) {
    case "performance":
      return "Performance Warning";
    case "memory":
      return "Memory Warning";
    case "timeout":
      return "Execution Timeout";
    case "error":
      return "Execution Error";
    default:
      return "Warning";
  }
}

function getSourceColor(source: string): string {
  switch (source) {
    case "geeksforgeeks":
      return "bg-green-500";
    case "freecodecamp":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}
