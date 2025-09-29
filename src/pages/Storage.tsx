import { MainLayout } from "@/components/layout/MainLayout";

const Storage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Body Storage Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage storage units and capacity
          </p>
        </div>
        
        <div className="dashboard-card text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Storage Management
          </h2>
          <p className="text-muted-foreground">
            Advanced storage management interface coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Storage;