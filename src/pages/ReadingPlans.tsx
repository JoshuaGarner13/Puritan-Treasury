import { useState, useEffect } from "react";
import { Calendar, Clock, Book, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import readingPlansData from "@/data/readingPlans.json";
import booksData from "@/data/books.json";

interface PlanProgress {
  planId: string;
  completedDays: number[];
  startDate: string;
}

const ReadingPlans = () => {
  const [planProgress, setPlanProgress] = useState<PlanProgress[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('puritanTreasuryPlanProgress');
    if (savedProgress) {
      setPlanProgress(JSON.parse(savedProgress));
    }
  }, []);

  const getBookTitle = (bookId: string) => {
    const book = booksData.find(b => b.id === bookId);
    return book?.title || "Unknown Book";
  };

  const getPlanProgress = (planId: string) => {
    return planProgress.find(p => p.planId === planId) || { planId, completedDays: [], startDate: "" };
  };

  const startPlan = (planId: string) => {
    const existingProgress = planProgress.find(p => p.planId === planId);
    if (!existingProgress) {
      const newProgress: PlanProgress = {
        planId,
        completedDays: [],
        startDate: new Date().toISOString()
      };
      const updatedProgress = [...planProgress, newProgress];
      setPlanProgress(updatedProgress);
      localStorage.setItem('puritanTreasuryPlanProgress', JSON.stringify(updatedProgress));
    }
  };

  const toggleDay = (planId: string, day: number) => {
    const updatedProgress = planProgress.map(p => {
      if (p.planId === planId) {
        const completedDays = p.completedDays.includes(day)
          ? p.completedDays.filter(d => d !== day)
          : [...p.completedDays, day];
        return { ...p, completedDays };
      }
      return p;
    });
    setPlanProgress(updatedProgress);
    localStorage.setItem('puritanTreasuryPlanProgress', JSON.stringify(updatedProgress));
  };

  const getProgressPercentage = (plan: any) => {
    const progress = getPlanProgress(plan.id);
    return (progress.completedDays.length / plan.duration) * 100;
  };

  const isStarted = (planId: string) => {
    return planProgress.some(p => p.planId === planId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Reading Plans
        </h1>
        <p className="text-lg theological-text text-muted-foreground max-w-3xl mx-auto">
          Structured approaches to studying the great works of Reformed theology, 
          designed to guide your reading and deepen your understanding.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {readingPlansData.map((plan) => {
          const progress = getPlanProgress(plan.id);
          const progressPercentage = getProgressPercentage(plan);
          const started = isStarted(plan.id);

          return (
            <Card key={plan.id} className="parchment-bg">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-2xl font-heading text-primary">
                    {plan.title}
                  </CardTitle>
                  <Badge variant="secondary" className="font-ui">
                    {plan.duration} days
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="theological-text text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground font-ui">
                    <div className="flex items-center space-x-1">
                      <Book className="h-4 w-4" />
                      <span>{getBookTitle(plan.bookId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{plan.duration} days</span>
                    </div>
                  </div>
                </div>

                {started && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-ui">
                      <span>Progress</span>
                      <span>{progress.completedDays.length}/{plan.duration} days</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {!started ? (
                  <div className="space-y-4">
                    <p className="theological-text text-sm text-muted-foreground">
                      Start this reading plan to begin your structured study and track your progress.
                    </p>
                    <Button 
                      onClick={() => startPlan(plan.id)}
                      className="w-full btn-scholar"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Start Reading Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Daily Schedule */}
                    <div className="space-y-3">
                      <h4 className="font-heading font-semibold text-primary">Daily Schedule</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {plan.schedule.map((day) => {
                          const isCompleted = progress.completedDays.includes(day.day);
                          return (
                            <div 
                              key={day.day}
                              className={`
                                flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors
                                ${isCompleted 
                                  ? 'bg-accent/20 border-accent' 
                                  : 'bg-background border-border hover:bg-muted/50'
                                }
                              `}
                              onClick={() => toggleDay(plan.id, day.day)}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-ui text-sm font-medium">Day {day.day}</span>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <span className="theological-text text-sm text-muted-foreground truncate">
                                    {day.title}
                                  </span>
                                </div>
                                {day.reflection && (
                                  <p className="theological-text text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {day.reflection}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild variant="outline" className="flex-1 font-ui">
                        <Link to={`/read/${plan.bookId}`}>
                          <Book className="h-4 w-4 mr-2" />
                          Read Book
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 font-ui">
                        <Link to="/journal">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Journal
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Information */}
      <Card className="bg-accent/20 border-accent">
        <CardContent className="p-6 text-center">
          <h3 className="font-heading text-lg font-semibold text-accent-foreground mb-2">
            How Reading Plans Work
          </h3>
          <p className="theological-text text-accent-foreground/80 max-w-2xl mx-auto">
            Each reading plan provides daily readings with reflection questions to guide your study. 
            Click on each day to mark it complete as you progress through the material. 
            Use the journal feature to record your thoughts and insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingPlans;