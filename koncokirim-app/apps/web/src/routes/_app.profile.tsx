import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_app/profile")({
  component: ProfileLayout,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    return { session };
  },
});

function ProfileLayout() {
  return (
    <div className="flex flex-col h-full bg-background relative">
      <Outlet />
    </div>
  );
}
