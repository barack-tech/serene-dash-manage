import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StorageChart } from "@/components/dashboard/StorageChart";
import { StorageUnitCard, StorageUnit } from "@/components/storage/StorageUnitCard";
import { AssignBodyDialog } from "@/components/storage/AssignBodyDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { fetchStorageUnits, assignToUnit, releaseUnit, setMaintenance } from "@/lib/api";

// Mock storage units data
const generateMockUnits = (): StorageUnit[] => {
  const wings = ["Wing A", "Wing B", "Wing C", "Wing D"];
  const units: StorageUnit[] = [];
  
  wings.forEach((wing, wingIndex) => {
    for (let floor = 1; floor <= 2; floor++) {
      for (let unit = 1; unit <= 10; unit++) {
        const unitNumber = `${wing.split(' ')[1]}-${floor}${unit.toString().padStart(2, '0')}`;
        const statuses: StorageUnit["status"][] = ["occupied", "available", "maintenance"];
        const status = statuses[Math.floor(Math.random() * (unit % 5 === 0 ? 3 : 2))];
        
        units.push({
          id: `unit-${wingIndex}-${floor}-${unit}`,
          unitNumber,
          wing,
          floor,
          status,
          temperature: -4 + Math.random() * 2,
          capacity: unit % 3 === 0 ? "double" : "single",
          lastMaintenance: "2025-01-10",
          ...(status === "occupied" && {
            occupant: {
              recordId: `REC${(wingIndex * 20 + floor * 10 + unit).toString().padStart(3, '0')}`,
              name: ["John Doe", "Mary Smith", "Robert Johnson", "Sarah Williams"][Math.floor(Math.random() * 4)],
              dateAdmitted: `2025-01-${10 + Math.floor(Math.random() * 5)}`,
              storageDeadline: `2025-02-${10 + Math.floor(Math.random() * 20)}`,
            }
          })
        });
      }
    }
  });
  
  return units;
};

const Storage = () => {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  useEffect(() => {
  async function loadUnits() {
    try {
      const data = await fetchStorageUnits();
      // Map backend fields to the frontend StorageUnit shape
      const formatted = data.map((u: any) => ({
        id: String(u.id),
        unitNumber: u.unit_number,
        wing: u.wing,
        floor: u.floor,
        status: u.status,
        temperature: u.temperature ?? -4,
        capacity: u.capacity ?? "single",
        lastMaintenance: u.last_maintenance ?? null,
        occupant: u.occupant_id ? {
          recordId: String(u.occupant_id),
          name: u.occupant_name,
          dateAdmitted: u.date_admitted ? u.date_admitted.split("T")[0] : undefined,
          storageDeadline: u.storage_deadline ? u.storage_deadline.split("T")[0] : undefined,
        } : undefined
      }));
      setUnits(formatted);
    } catch (err) {
      console.error("Failed to fetch storage units", err);
    }
  }
  loadUnits();
}, []);


  const [searchQuery, setSearchQuery] = useState("");
  const [wingFilter, setWingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const { toast } = useToast();

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = 
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.occupant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.occupant?.recordId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWing = wingFilter === "all" || unit.wing === wingFilter;
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
    
    return matchesSearch && matchesWing && matchesStatus;
  });

  const handleAssign = async (unitId: string, recordId: string, deadline: string) => {
  try {
    const res = await fetch("/api/storage/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unit_id: unitId, record_id: recordId, deadline }),
    });
    if (res.ok) {
      toast({ title: "Success", description: "Body assigned to unit" });
    } else {
      const data = await res.json();
      toast({ title: "Error", description: data.detail || "Assignment failed", variant: "destructive" });
    }
  } catch (error) {
    toast({ title: "Error", description: "Assignment failed", variant: "destructive" });
  }
};


  const handleAssignConfirm = async (unitId: string, recordId: string, deadline: string) => {
  try {
    const updated = await assignToUnit(Number(unitId.replace("unit-", "")) || Number(unitId), Number(recordId.replace(/\D/g,'')) || Number(recordId), deadline);
    // Map backend returned unit to frontend format then update state
    const formatted = {
      id: String(updated.id),
      unitNumber: updated.unit_number,
      wing: updated.wing,
      floor: updated.floor,
      status: updated.status,
      temperature: updated.temperature,
      capacity: updated.capacity,
      lastMaintenance: updated.last_maintenance,
      occupant: updated.occupant_id ? {
        recordId: String(updated.occupant_id),
        name: updated.occupant_name,
        dateAdmitted: updated.date_admitted?.split("T")[0],
        storageDeadline: updated.storage_deadline?.split("T")[0],
      } : undefined
    };
    setUnits(prev => prev.map(u => u.id === formatted.id ? formatted : u));
    setAssignDialogOpen(false);
    toast({ title: "Body Assigned", description: `Assigned to ${formatted.unitNumber}` });
  } catch (err) {
    console.error(err);
    toast({ title: "Assignment failed", description: "See console for details", variant: "destructive" });
  }
};


  const handleRelease = async (unit: StorageUnit) => {
  try {
    const updated = await releaseUnit(Number(unit.id));
    const formatted = { /* map updated as above */ };
    setUnits(prev => prev.map(u => String(u.id) === String(formatted.id) ? formatted : u));
    toast({ title: "Unit Released", description: `${unit.unitNumber} is now available` });
  } catch (err) {
    console.error(err);
    toast({ title: "Release failed", description: "See console", variant: "destructive" });
  }
};


  const handleViewDetails = (unit: StorageUnit) => {
    toast({
      title: "Unit Details",
      description: `Viewing details for ${unit.unitNumber}`,
    });
  };

  const handleMaintenance = async (unit: StorageUnit) => {
  try {
    const updated = await setMaintenance(Number(unit.id), true);
    const formatted = { /* map */ };
    setUnits(prev => prev.map(u => u.id === formatted.id ? formatted : u));
    toast({ title: "Maintenance Mode", description: `${unit.unitNumber} set to maintenance` });
  } catch (err) {
    console.error(err);
    toast({ title: "Failed", description: "See console", variant: "destructive" });
  }
};


  const stats = {
    total: units.length,
    occupied: units.filter(u => u.status === "occupied").length,
    available: units.filter(u => u.status === "available").length,
    maintenance: units.filter(u => u.status === "maintenance").length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Body Storage Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage storage units and capacity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="dashboard-card p-4">
            <div className="text-sm text-muted-foreground">Total Units</div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="dashboard-card p-4">
            <div className="text-sm text-muted-foreground">Occupied</div>
            <div className="text-2xl font-bold text-primary">{stats.occupied}</div>
          </div>
          <div className="dashboard-card p-4">
            <div className="text-sm text-muted-foreground">Available</div>
            <div className="text-2xl font-bold text-success">{stats.available}</div>
          </div>
          <div className="dashboard-card p-4">
            <div className="text-sm text-muted-foreground">Maintenance</div>
            <div className="text-2xl font-bold text-warning">{stats.maintenance}</div>
          </div>
        </div>

        {/* Storage Chart */}
        <StorageChart />

        {/* Filters and Search */}
        <div className="dashboard-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by unit number, record ID, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={wingFilter} onValueChange={setWingFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wings</SelectItem>
                <SelectItem value="Wing A">Wing A</SelectItem>
                <SelectItem value="Wing B">Wing B</SelectItem>
                <SelectItem value="Wing C">Wing C</SelectItem>
                <SelectItem value="Wing D">Wing D</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {filteredUnits.length} units
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="bg-accent/20">
                Search: {searchQuery}
              </Badge>
            )}
            {wingFilter !== "all" && (
              <Badge variant="outline" className="bg-accent/20">
                {wingFilter}
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="bg-accent/20">
                Status: {statusFilter}
              </Badge>
            )}
          </div>
        </div>

        {/* Storage Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <StorageUnitCard
              key={unit.id}
              unit={unit}
              onAssign={handleAssign}
              onRelease={handleRelease}
              onViewDetails={handleViewDetails}
              onMaintenance={handleMaintenance}
            />
          ))}
        </div>

        {filteredUnits.length === 0 && (
          <div className="dashboard-card text-center py-12">
            <p className="text-muted-foreground">No storage units found matching your criteria</p>
          </div>
        )}
      </div>

      <AssignBodyDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        unit={selectedUnit}
        onAssign={handleAssignConfirm}
      />
    </MainLayout>
  );
};

export default Storage;