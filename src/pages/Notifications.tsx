import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, FileWarning, Wrench, Check, X, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: "maintenance" | "documentation" | "storage" | "schedule";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: typeof Wrench;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "maintenance",
    priority: "high",
    title: "Storage Unit Maintenance Due",
    description: "Unit A-12 requires scheduled maintenance within 24 hours",
    time: "2 hours ago",
    read: false,
    icon: Wrench
  },
  {
    id: 2,
    type: "documentation",
    priority: "medium",
    title: "Pending Documentation",
    description: "2 death certificates require completion and review",
    time: "4 hours ago",
    read: false,
    icon: FileWarning
  },
  {
    id: 3,
    type: "storage",
    priority: "low",
    title: "Storage Capacity Alert",
    description: "Storage capacity at 85% - consider expansion planning",
    time: "1 day ago",
    read: false,
    icon: AlertCircle
  },
  {
    id: 4,
    type: "schedule",
    priority: "medium",
    title: "Schedule Conflict",
    description: "Tomorrow's service requires time adjustment",
    time: "6 hours ago",
    read: true,
    icon: Clock
  },
  {
    id: 5,
    type: "maintenance",
    priority: "medium",
    title: "Equipment Inspection Complete",
    description: "Refrigeration unit B-5 has passed routine inspection",
    time: "1 day ago",
    read: true,
    icon: Wrench
  },
  {
    id: 6,
    type: "documentation",
    priority: "high",
    title: "Urgent: Missing Documentation",
    description: "Cremation authorization form required for case #2847",
    time: "3 hours ago",
    read: false,
    icon: FileWarning
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

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

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications marked as read.`,
    });
  };

  const dismissNotification = (id: number) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification dismissed",
      description: notification?.title,
    });
  };

  const clearAll = () => {
    const count = filteredNotifications.length;
    if (filter === "all") {
      setNotifications([]);
    } else {
      setNotifications(prev => prev.filter(n => n.read));
    }
    toast({
      title: "Notifications cleared",
      description: `${count} notifications cleared.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
            {filteredNotifications.length > 0 && (
              <Button onClick={clearAll} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear {filter === "all" ? "all" : "unread"}
              </Button>
            )}
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    No notifications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === "all" 
                      ? "You're all caught up! No notifications to display."
                      : "No unread notifications. Great job staying on top of things!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary bg-accent/20' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                          <notification.icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-primary rounded-full" />
                                )}
                              </div>
                              {getPriorityBadge(notification.priority)}
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </p>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.description}
                          </p>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark as read
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
