import { PlannerView } from "@/components/tasks/planner-view";

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ showCompleted?: string; taskId?: string }> }) {
  const search = await searchParams;
  return <PlannerView view="today" showCompleted={search.showCompleted === "1"} taskId={search.taskId} />;
}
