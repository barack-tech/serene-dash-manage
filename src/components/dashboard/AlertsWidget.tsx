import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, FileWarning, Wrench } from "lucide-react";

const mockAlerts = [
  {
    id: 1,
    type: "maintenance",
    priority: "high",
    title: "Storage Unit Maintenance Due",
    description: "Unit A-12 requires scheduled maintenance within 24 hours",
    time: "2 hours ago",
    icon: Wrench
  },
  {
    id: 2,
    type: "documentation",
    priority: "medium",
    title: "Pending Documentation",
    description: "2 death certificates require completion and review",
    time: "4 hours ago",
    icon: FileWarning
  },
  {
    id: 3,
    type: "storage",
    priority: "low",
    title: "Storage Capacity Alert",
    description: "Storage capacity at 85% - consider expansion planning",
    time: "1 day ago",
    icon: AlertCircle
  },
  {
    id: 4,
    type: "schedule",
    priority: "medium",
    title: "Schedule Conflict",
    description: "Tomorrow's service requires time adjustment",
    time: "6 hours ago",
    icon: Clock
  }
];

export function AlertsWidget() {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Alerts & Notifications</CardTitle>
        <CardDescription>
          Important system alerts and pending actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 bg-accent/20 rounded-lg border border-border/50">
              <div className="p-2 bg-background rounded-md">
                <alert.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
                  {getPriorityBadge(alert.priority)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.time}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}