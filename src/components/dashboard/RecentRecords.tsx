import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

const mockRecords = [
  {
    id: "D-2024-001",
    name: "John Anderson Smith",
    age: 78,
    dateAdded: "2024-01-15",
    status: "Processing",
    storage: "Unit A-12"
  },
  {
    id: "D-2024-002", 
    name: "Margaret Rose Johnson",
    age: 65,
    dateAdded: "2024-01-15",
    status: "Complete",
    storage: "Unit B-08"
  },
  {
    id: "D-2024-003",
    name: "William Robert Davis",
    age: 82,
    dateAdded: "2024-01-14",
    status: "Pending",
    storage: "Unit C-15"
  },
  {
    id: "D-2024-004",
    name: "Elizabeth Anne Wilson",
    age: 91,
    dateAdded: "2024-01-14",
    status: "Processing",
    storage: "Unit A-07"
  }
];

export function RecentRecords() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Complete":
        return <Badge className="bg-success text-success-foreground">Complete</Badge>;
      case "Processing":
        return <Badge className="bg-warning text-warning-foreground">Processing</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Records</CardTitle>
        <CardDescription>
          Recently added deceased records requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-border/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-medium text-foreground">{record.name}</h4>
                  {getStatusBadge(record.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>ID: {record.id}</span>
                  <span className="mx-2">•</span>
                  <span>Age: {record.age}</span>
                  <span className="mx-2">•</span>
                  <span>Storage: {record.storage}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Added: {new Date(record.dateAdded).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}