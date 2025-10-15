import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeceasedRecord } from "./DeceasedRecordForm";

interface RecordDetailViewProps {
  record: DeceasedRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordDetailView({ record, open, onOpenChange }: RecordDetailViewProps) {
  if (!record) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "secondary",
      processing: "default",
      released: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Record Details - {record.id}</span>
            {getStatusBadge(record.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{record.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{record.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(record.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Death</p>
                <p className="font-medium">{new Date(record.dateOfDeath).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID/Passport Number</p>
                <p className="font-medium">{record.identification}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Religion</p>
                <p className="font-medium">{record.religion || "Not specified"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
            <div>
              <p className="text-sm text-muted-foreground">Cause of Death</p>
              <p className="font-medium">{record.causeOfDeath}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Next of Kin</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{record.nextOfKin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="font-medium">{record.contactNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{record.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Administrative</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Admission Date</p>
                <p className="font-medium">{new Date(record.admissionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{record.status}</p>
              </div>
            </div>
          </div>

          {record.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                <p className="text-sm">{record.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
