import { useCallback, useMemo, useState } from "react";
import type { DashboardStat, RecentTaskItem } from "@/lib/dashboard/types";
import { getErrorMessage } from "@/lib/get-error-message";
import { getDashboardData } from "@/services/dashboard-service";

interface UseDashboardPageControllerParams {
  initialStats: DashboardStat[];
  initialRecentTasks: RecentTaskItem[];
  initialError?: string | null;
}

export function useDashboardPageController({
  initialStats,
  initialRecentTasks,
  initialError = null,
}: UseDashboardPageControllerParams) {
  const [stats, setStats] = useState<DashboardStat[]>(initialStats);
  const [recentTasks, setRecentTasks] =
    useState<RecentTaskItem[]>(initialRecentTasks);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [infoMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const data = await getDashboardData();
      setStats(data.stats);
      setRecentTasks(data.recentTasks);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Não foi possível carregar os dados do dashboard.",
        ),
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const viewState = useMemo(
    () => ({
      hasError: errorMessage !== null,
      hasInfo: infoMessage !== null,
      isRefreshing,
    }),
    [errorMessage, infoMessage, isRefreshing],
  );

  return {
    stats,
    recentTasks,
    errorMessage,
    infoMessage,
    isRefreshing,
    refreshDashboard,
    viewState,
  };
}
