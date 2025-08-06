import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Send,
  Lightbulb
} from "lucide-react";
import { useBillPayData } from "@/hooks/useBillPayData";

export const BillPayAIAssistant: React.FC = () => {
  const { bills, analytics } = useBillPayData();
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // AI Suggestions based on bill data
  const generateSuggestions = () => {
    const suggestions = [];
    
    // Overdue bills alert
    const overdueBills = bills.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate < new Date() && bill.status !== 'paid';
    });
    
    if (overdueBills.length > 0) {
      suggestions.push({
        type: "warning",
        title: "Overdue Bills Detected",
        description: `You have ${overdueBills.length} overdue bill${overdueBills.length > 1 ? 's' : ''}.`,
        action: "Review overdue bills",
        icon: AlertTriangle
      });
    }

    // High spending category
    const categoryTotals = bills.reduce((acc, bill) => {
      acc[bill.category] = (acc[bill.category] || 0) + Number(bill.amount);
      return acc;
    }, {} as Record<string, number>);
    
    const highestCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
    if (highestCategory && highestCategory[1] > 500) {
      suggestions.push({
        type: "insight",
        title: "High Spending Category",
        description: `Your ${highestCategory[0]} bills total $${highestCategory[1].toFixed(2)} monthly.`,
        action: "Explore savings opportunities",
        icon: TrendingUp
      });
    }

    // Auto-pay suggestion
    const nonAutoBills = bills.filter(bill => !bill.is_auto_pay && bill.frequency === 'monthly');
    if (nonAutoBills.length >= 3) {
      suggestions.push({
        type: "suggestion",
        title: "Setup Auto-Pay",
        description: `${nonAutoBills.length} recurring bills could be automated.`,
        action: "Setup auto-payments",
        icon: Sparkles
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  const quickQueries = [
    "How much do I spend on utilities monthly?",
    "When is my next bill due?",
    "Which bills can I automate?",
    "Show my bill payment history",
    "What are my largest monthly expenses?"
  ];

  const handleQuery = async (question: string) => {
    setQuery(question);
    setIsThinking(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsThinking(false);
      // In a real app, this would call an AI service
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Insights
          </h3>
          
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Alert key={index} className="border-l-4 border-l-primary">
                <Icon className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      {suggestion.action}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      {/* AI Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Ask AI About Your Bills
          </CardTitle>
          <CardDescription>
            Get instant insights about your spending, due dates, and optimization opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Query Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQueries.map((quickQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuery(quickQuery)}
                  className="text-xs"
                >
                  {quickQuery}
                </Button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your bills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery(query)}
            />
            <Button 
              onClick={() => handleQuery(query)}
              disabled={!query.trim() || isThinking}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Response Area */}
          {isThinking && (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Bot className="h-5 w-5 animate-pulse text-primary" />
              <span className="text-sm">Analyzing your bill data...</span>
            </div>
          )}

          {/* Sample AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Monthly Total</span>
              </div>
              <p className="text-2xl font-bold">${analytics.monthlyTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">All active bills</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Next Due</span>
              </div>
              <p className="text-2xl font-bold">
                {bills.find(b => b.status !== 'paid') ? 
                  new Date(bills.find(b => b.status !== 'paid')!.due_date).getDate() : 'None'
                }
              </p>
              <p className="text-xs text-muted-foreground">Days from now</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold">${analytics.potentialSavings.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Through optimization</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};