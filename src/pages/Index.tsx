import { Users, Archive, Calendar, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRecords } from "@/components/dashboard/RecentRecords";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { StorageChart } from "@/components/dashboard/StorageChart";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of mortuary operations and key metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Bodies"
            value={53}
            icon={Users}
            description="Currently in facility"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Available Storage"
            value={27}
            icon={Archive}
            description="Units available"
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="Scheduled Funerals"
            value={8}
            icon={Calendar}
            description="Next 7 days"
          />
          <StatsCard
            title="Pending Documentation"
            value={3}
            icon={FileText}
            description="Requires attention"
            trend={{ value: 25, isPositive: false }}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Records */}
          <div className="lg:col-span-2">
            <RecentRecords />
          </div>

          {/* Calendar Widget */}
          <div>
            <CalendarWidget />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Chart */}
          <div className="lg:col-span-2">
            <StorageChart />
          </div>

          {/* Alerts */}
          <div>
            <AlertsWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
