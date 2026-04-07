import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardPageFeedback } from "@/components/dashboard/DashboardPageFeedback";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardRecentTasksPanel } from "@/components/dashboard/DashboardRecentTasksPanel";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { DashboardPageProvider } from "@/lib/dashboard/dashboard-page-context";
import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types";
import { getDashboardData } from "@/services/dashboard-service";

export default async function DashboardPage() {
  let initialStats: DashboardStat[] = [];
  let initialRecentTasks: RecentTaskItem[] = [];
  let initialError: string | null = null;

  try {
    const data = await getDashboardData();
    initialStats = data.stats;
    initialRecentTasks = data.recentTasks;
  } catch {
    initialError =
      "Não foi possível carregar os dados do dashboard na inicialização.";
  }

  return (
    <DashboardPageProvider
      initialStats={initialStats}
      initialRecentTasks={initialRecentTasks}
      initialError={initialError}
    >
      <DashboardLayout>
        <div className="flex flex-col gap-6 md:gap-8">
          <DashboardPageFeedback />
          <DashboardPageHeader />
          <DashboardStatsGrid />
          <DashboardRecentTasksPanel />
        </div>
      </DashboardLayout>
    </DashboardPageProvider>
  );
}
