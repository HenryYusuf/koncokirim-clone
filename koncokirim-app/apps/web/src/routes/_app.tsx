import { Outlet, createFileRoute } from "@tanstack/react-router";
import BottomNavigation from "@/components/bottom-navigation";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex flex-col h-svh bg-background">
      <main className="flex-1 overflow-auto pb-24">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
