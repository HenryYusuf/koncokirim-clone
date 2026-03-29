import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_main/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <div className="container max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.data?.user.name}! 
          Manage your deliveries and view your logistics overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground flex items-center justify-between">
            API Feedback
            <span className="h-2 w-2 rounded-full bg-green-500" />
          </h3>
          <p className="mt-2 text-xl font-bold tracking-tight">
            {privateData.isLoading ? "Loading..." : privateData.data?.message || "No data"}
          </p>
        </div>
      </div>
    </div>
  );
}

