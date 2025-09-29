import { MainLayout } from "@/components/layout/MainLayout";

const Records = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deceased Records</h1>
          <p className="text-muted-foreground">
            Manage and maintain comprehensive records of deceased individuals
          </p>
        </div>
        
        <div className="dashboard-card text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Records Management
          </h2>
          <p className="text-muted-foreground">
            Comprehensive deceased records management interface coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Records;