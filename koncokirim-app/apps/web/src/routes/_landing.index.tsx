import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_landing/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Konco<span className="text-primary">Kirim</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl mx-auto">
          The ultimate platform for seamless delivery and logistics management. 
          Ready to scale your business?
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="flex items-center gap-2 p-2 px-4 rounded-full border bg-card text-xs font-medium">
          <div
            className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          <span className="opacity-70">
            System Status: 
          </span>
          <span className={healthCheck.data ? "text-green-600 dark:text-green-400" : "text-red-500"}>
            {healthCheck.isLoading
              ? "Checking..."
              : healthCheck.data
                ? "Ready"
                : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}

