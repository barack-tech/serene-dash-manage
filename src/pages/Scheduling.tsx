import { MainLayout } from "@/components/layout/MainLayout";

const Scheduling = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funeral Scheduling</h1>
          <p className="text-muted-foreground">
            Schedule and coordinate funeral services and ceremonies
          </p>
        </div>
        
        <div className="dashboard-card text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Scheduling System
          </h2>
          <p className="text-muted-foreground">
            Comprehensive scheduling interface coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Scheduling;