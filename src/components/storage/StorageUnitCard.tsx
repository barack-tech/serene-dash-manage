import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Calendar, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StorageUnit {
  id: string;
  unitNumber: string;
  wing: string;
  floor: number;
  status: "occupied" | "available" | "maintenance";
  temperature: number;
  occupant?: {
    recordId: string;
    name: string;
    dateAdmitted: string;
    storageDeadline: string;
  };
  lastMaintenance: string;
  capacity: "single" | "double";
}

interface StorageUnitCardProps {
  unit: StorageUnit;
  onAssign: (unit: StorageUnit) => void;
  onRelease: (unit: StorageUnit) => void;
  onViewDetails: (unit: StorageUnit) => void;
  onMaintenance: (unit: StorageUnit) => void;
}

export function StorageUnitCard({ 
  unit, 
  onAssign, 
  onRelease, 
  onViewDetails,
  onMaintenance 
}: StorageUnitCardProps) {
  const getStatusColor = (status: StorageUnit["status"]) => {
    switch (status) {
      case "occupied":
        return "bg-primary/10 text-primary border-primary/20";
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "maintenance":
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getCardBorderColor = (status: StorageUnit["status"]) => {
    switch (status) {
      case "occupied":
        return "border-primary/30";
      case "available":
        return "border-success/30";
      case "maintenance":
        return "border-warning/30";
    }
  };

  return (
    <Card className={cn("dashboard-card hover:shadow-md transition-shadow", getCardBorderColor(unit.status))}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{unit.unitNumber}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{unit.wing} - Floor {unit.floor}</span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(unit.status)}>
            {unit.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className="h-4 w-4" />
            <span>{unit.temperature}°C</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {unit.capacity}
          </Badge>
        </div>

        {unit.occupant && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium truncate">{unit.occupant.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Admitted: {unit.occupant.dateAdmitted}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Deadline: {unit.occupant.storageDeadline}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {unit.status === "available" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onAssign(unit)}
            >
              Assign
            </Button>
          )}
          {unit.status === "occupied" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onViewDetails(unit)}
              >
                Details
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => onRelease(unit)}
              >
                Release
              </Button>
            </>
          )}
          {unit.status === "maintenance" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onMaintenance(unit)}
            >
              Maintenance
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}