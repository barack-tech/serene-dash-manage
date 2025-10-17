import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  FileText,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EventDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetailView({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}: EventDetailViewProps) {
  if (!event) return null;

  const serviceTypeLabels: Record<string, string> = {
    burial: "Burial Service",
    cremation: "Cremation Service",
    memorial: "Memorial Service",
    viewing: "Viewing/Wake",
    graveside: "Graveside Service",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-foreground">
              {event.deceasedName}
            </h3>
            <p className="text-lg text-muted-foreground mt-1">
              {serviceTypeLabels[event.serviceType] || event.serviceType}
            </p>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Date</p>
                <p className="text-muted-foreground">
                  {format(new Date(event.date), "PPPP")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Time</p>
                <p className="text-muted-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Location</p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>

            {event.officiant && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Officiant</p>
                  <p className="text-muted-foreground">{event.officiant}</p>
                </div>
              </div>
            )}

            {event.expectedAttendees && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Expected Attendees</p>
                  <p className="text-muted-foreground">{event.expectedAttendees}</p>
                </div>
              </div>
            )}

            {event.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Notes</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {event.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Service
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Service
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
