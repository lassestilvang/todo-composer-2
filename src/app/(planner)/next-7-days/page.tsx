import { PlannerView } from "@/components/tasks/planner-view";

export default async function Next7DaysPage({ searchParams }: { searchParams: Promise<{ showCompleted?: string; taskId?: string }> }) {
  const search = await searchParams;
  return <PlannerView view="next-7-days" showCompleted={search.showCompleted === "1"} taskId={search.taskId} />;
}
