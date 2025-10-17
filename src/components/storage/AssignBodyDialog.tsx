import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StorageUnit } from "./StorageUnitCard";
import { useToast } from "@/hooks/use-toast";

interface AssignBodyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: StorageUnit | null;
  onAssign: (unitId: string, recordId: string, deadline: string) => void;
}

// Mock deceased records for assignment
const mockRecords = [
  { id: "REC001", name: "John Smith", dateAdmitted: "2025-01-10" },
  { id: "REC002", name: "Mary Johnson", dateAdmitted: "2025-01-12" },
  { id: "REC003", name: "Robert Williams", dateAdmitted: "2025-01-15" },
];

export function AssignBodyDialog({ 
  open, 
  onOpenChange, 
  unit, 
  onAssign 
}: AssignBodyDialogProps) {
  const [selectedRecord, setSelectedRecord] = useState("");
  const [deadline, setDeadline] = useState("");
  const { toast } = useToast();

  const handleAssign = () => {
    if (!selectedRecord || !deadline || !unit) {
      toast({
        title: "Missing Information",
        description: "Please select a record and set a storage deadline.",
        variant: "destructive",
      });
      return;
    }

    onAssign(unit.id, selectedRecord, deadline);
    setSelectedRecord("");
    setDeadline("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Body to Storage Unit</DialogTitle>
          <DialogDescription>
            Assign a deceased record to {unit?.unitNumber} in {unit?.wing}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="record">Deceased Record</Label>
            <Select value={selectedRecord} onValueChange={setSelectedRecord}>
              <SelectTrigger id="record">
                <SelectValue placeholder="Select a record" />
              </SelectTrigger>
              <SelectContent>
                {mockRecords.map((record) => (
                  <SelectItem key={record.id} value={record.id}>
                    {record.id} - {record.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Storage Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="rounded-lg bg-accent/20 p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit:</span>
              <span className="font-medium">{unit?.unitNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{unit?.wing} - Floor {unit?.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-medium">{unit?.temperature}°C</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign to Unit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}