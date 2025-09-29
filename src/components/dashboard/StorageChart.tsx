import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const storageData = [
  { name: "Wing A", occupied: 12, available: 8, total: 20 },
  { name: "Wing B", occupied: 15, available: 5, total: 20 },
  { name: "Wing C", occupied: 8, available: 12, total: 20 },
  { name: "Wing D", occupied: 18, available: 2, total: 20 }
];

const utilizationData = [
  { name: "Occupied", value: 53, color: "hsl(var(--primary))" },
  { name: "Available", value: 27, color: "hsl(var(--success))" }
];

export function StorageChart() {
  const totalOccupied = storageData.reduce((sum, wing) => sum + wing.occupied, 0);
  const totalCapacity = storageData.reduce((sum, wing) => sum + wing.total, 0);
  const utilizationPercentage = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <Card className="dashboard-card col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Storage Utilization</CardTitle>
        <CardDescription>
          Current storage capacity across all wings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div>
            <h4 className="font-medium text-sm mb-4">Storage by Wing</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={storageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="occupied" 
                  fill="hsl(var(--primary))" 
                  name="Occupied"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="available" 
                  fill="hsl(var(--success))" 
                  name="Available"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="font-medium text-sm mb-4">Overall Utilization</h4>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{utilizationPercentage}%</p>
              <p className="text-sm text-muted-foreground">Capacity Used</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <p className="text-lg font-semibold text-foreground">{totalOccupied}</p>
            <p className="text-xs text-muted-foreground">Units Occupied</p>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <p className="text-lg font-semibold text-foreground">{totalCapacity - totalOccupied}</p>
            <p className="text-xs text-muted-foreground">Units Available</p>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <p className="text-lg font-semibold text-foreground">{totalCapacity}</p>
            <p className="text-xs text-muted-foreground">Total Capacity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}