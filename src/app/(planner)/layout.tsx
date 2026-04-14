import { AppShell } from "@/components/layout/app-shell";
import { getOverdueCount } from "@/lib/services/task-service";

export const dynamic = "force-dynamic";

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  const overdueCount = getOverdueCount();
  return <AppShell overdueCount={overdueCount}>{children}</AppShell>;
}
