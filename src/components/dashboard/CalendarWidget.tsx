import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockEvents = [
  {
    date: new Date(2024, 0, 16),
    title: "Memorial Service - Smith Family",
    time: "10:00 AM"
  },
  {
    date: new Date(2024, 0, 17),
    title: "Body Release - Johnson",
    time: "2:00 PM"
  },
  {
    date: new Date(2024, 0, 18),
    title: "Funeral Service - Davis Family",
    time: "11:00 AM"
  },
  {
    date: new Date(2024, 0, 19),
    title: "Documentation Review",
    time: "9:00 AM"
  }
];

export function CalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const hasEventsForDate = (date: Date) => {
    return mockEvents.some(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Funeral Schedule</CardTitle>
        <CardDescription>
          Upcoming services and important dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvents: (date) => hasEventsForDate(date)
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))'
              }
            }}
          />
          
          {selectedEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                Events for {selectedDate?.toLocaleDateString()}
              </h4>
              {selectedEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-accent/20 rounded border border-border/50">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Scheduled
                  </Badge>
                </div>
              ))}
            </div>
          )}
          
          {selectedEvents.length === 0 && selectedDate && (
            <div className="text-center p-4 text-muted-foreground">
              <p className="text-sm">No events scheduled for this date</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}