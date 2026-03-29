import { Outlet, createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";

export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
});

function LandingLayout() {
  return (
    <div className="flex flex-col h-svh">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
