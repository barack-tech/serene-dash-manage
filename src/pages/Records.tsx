import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DeceasedRecordForm, DeceasedRecord } from "@/components/records/DeceasedRecordForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, FileText } from "lucide-react";
import { toast } from "sonner";

// Mock data
const initialRecords: DeceasedRecord[] = [
  {
    id: "DR-001",
    fullName: "Robert Johnson",
    dateOfBirth: "1945-03-15",
    dateOfDeath: "2025-01-10",
    gender: "male",
    identification: "ID987654321",
    causeOfDeath: "Natural causes",
    nextOfKin: "Mary Johnson",
    contactNumber: "+1234567890",
    address: "456 Oak Avenue, Springfield",
    religion: "Christian",
    admissionDate: "2025-01-10",
    status: "processing",
    notes: "Funeral scheduled for next week",
  },
  {
    id: "DR-002",
    fullName: "Elizabeth Smith",
    dateOfBirth: "1952-07-22",
    dateOfDeath: "2025-01-08",
    gender: "female",
    identification: "ID123456789",
    causeOfDeath: "Heart failure",
    nextOfKin: "David Smith",
    contactNumber: "+1987654321",
    address: "789 Pine Street, Oakville",
    religion: "Catholic",
    admissionDate: "2025-01-08",
    status: "pending",
    notes: "Awaiting family approval",
  },
];

const Records = () => {
  const [records, setRecords] = useState<DeceasedRecord[]>(initialRecords);
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<DeceasedRecord | undefined>();

  const handleAddRecord = (data: Omit<DeceasedRecord, "id" | "admissionDate" | "status">) => {
    const newRecord: DeceasedRecord = {
      ...data,
      id: `DR-${String(records.length + 1).padStart(3, "0")}`,
      admissionDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setRecords([newRecord, ...records]);
    toast.success("Deceased record added successfully");
  };

  const handleEditRecord = (data: Omit<DeceasedRecord, "id" | "admissionDate" | "status">) => {
    if (selectedRecord) {
      setRecords(
        records.map((r) =>
          r.id === selectedRecord.id ? { ...selectedRecord, ...data } : r
        )
      );
      toast.success("Record updated successfully");
      setSelectedRecord(undefined);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.identification.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deceased Records</h1>
            <p className="text-muted-foreground">
              Manage and maintain comprehensive records of deceased individuals
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Record
          </Button>
        </div>

        <div className="dashboard-card space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or identification number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="released">Released</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Date of Death</TableHead>
                  <TableHead>Next of Kin</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.fullName}</TableCell>
                      <TableCell>{new Date(record.dateOfDeath).toLocaleDateString()}</TableCell>
                      <TableCell>{record.nextOfKin}</TableCell>
                      <TableCell>{record.contactNumber}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(record);
                              setFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </div>
      </div>

      <DeceasedRecordForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedRecord(undefined);
        }}
        onSubmit={selectedRecord ? handleEditRecord : handleAddRecord}
        initialData={selectedRecord}
      />
    </MainLayout>
  );
};

export default Records;