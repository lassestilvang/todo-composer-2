import { PlannerView } from "@/components/tasks/planner-view";

export default async function UpcomingPage({ searchParams }: { searchParams: Promise<{ showCompleted?: string; taskId?: string }> }) {
  const search = await searchParams;
  return <PlannerView view="upcoming" showCompleted={search.showCompleted === "1"} taskId={search.taskId} />;
}
