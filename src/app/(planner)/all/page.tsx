import { PlannerView } from "@/components/tasks/planner-view";

export default async function AllPage({ searchParams }: { searchParams: Promise<{ showCompleted?: string; taskId?: string }> }) {
  const search = await searchParams;
  return <PlannerView view="all" showCompleted={search.showCompleted === "1"} taskId={search.taskId} />;
}
