import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleFuneralForm } from "@/components/scheduling/ScheduleFuneralForm";
import { EventDetailView } from "@/components/scheduling/EventDetailView";
import { Plus, Search, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";

// Mock scheduled events
const mockScheduledEvents = [
  {
    id: 1,
    deceasedName: "John Smith",
    serviceType: "burial",
    date: new Date(2025, 9, 20, 10, 0),
    time: "10:00 AM",
    location: "St. Mary's Church",
    officiant: "Father Michael Brown",
    expectedAttendees: "150",
    notes: "Family has requested traditional hymns",
  },
  {
    id: 2,
    deceasedName: "Mary Johnson",
    serviceType: "cremation",
    date: new Date(2025, 9, 22, 14, 0),
    time: "2:00 PM",
    location: "Memorial Chapel",
    officiant: "Rev. Sarah Williams",
    expectedAttendees: "80",
    notes: "Celebration of life ceremony",
  },
  {
    id: 3,
    deceasedName: "Robert Davis",
    serviceType: "memorial",
    date: new Date(2025, 9, 18, 11, 0),
    time: "11:00 AM",
    location: "Community Center",
    officiant: "",
    expectedAttendees: "200",
    notes: "Military honors requested",
  },
];

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(mockScheduledEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const hasEventsOnDate = (date: Date) => {
    return events.some((event) => isSameDay(new Date(event.date), date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.deceasedName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || event.serviceType === filterType;
    return matchesSearch && matchesType;
  });

  const upcomingEvents = filteredEvents
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setDetailOpen(false);
    setFormOpen(true);
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      toast.success("Service deleted successfully");
      setDetailOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? data : e)));
    } else {
      setEvents([...events, data]);
    }
  };

  const serviceTypeLabels: Record<string, string> = {
    burial: "Burial",
    cremation: "Cremation",
    memorial: "Memorial",
    viewing: "Viewing",
    graveside: "Graveside",
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Funeral Scheduling</h1>
            <p className="text-muted-foreground">
              Schedule and coordinate funeral services and ceremonies
            </p>
          </div>
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Service
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <Card className="dashboard-card">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
                modifiers={{
                  hasEvents: (date) => hasEventsOnDate(date),
                }}
                modifiersStyles={{
                  hasEvents: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                  },
                }}
              />
              {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                <div className="mt-4 p-4 border-t">
                  <h3 className="font-semibold text-foreground mb-3">
                    Events on {format(selectedDate, "MMM d, yyyy")}
                  </h3>
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleViewEvent(event)}
                        className="w-full text-left p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                      >
                        <p className="font-medium text-foreground">{event.deceasedName}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Events List Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="dashboard-card">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by deceased name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="burial">Burial</SelectItem>
                    <SelectItem value="cremation">Cremation</SelectItem>
                    <SelectItem value="memorial">Memorial</SelectItem>
                    <SelectItem value="viewing">Viewing</SelectItem>
                    <SelectItem value="graveside">Graveside</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Upcoming Services ({upcomingEvents.length})
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleViewEvent(event)}
                      className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {event.deceasedName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {serviceTypeLabels[event.serviceType]}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </button>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming services scheduled
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ScheduleFuneralForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingEvent}
      />

      <EventDetailView
        open={detailOpen}
        onOpenChange={setDetailOpen}
        event={selectedEvent}
        onEdit={() => handleEditEvent(selectedEvent)}
        onDelete={handleDeleteEvent}
      />
    </MainLayout>
  );
};

export default Scheduling;