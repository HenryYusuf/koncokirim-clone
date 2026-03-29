import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import * as React from "react";

import { authClient } from "@/lib/auth-client";
import { Input } from "@koncokirim-app/ui/components/input";
import { Badge } from "@koncokirim-app/ui/components/badge";
import { Skeleton } from "@koncokirim-app/ui/components/skeleton";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_app/dashboard")({
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

const MOCK_MERCHANTS = [
  { id: 1, name: "Warung Bu Sumi", distance: "Dekat SDN 01", isOpen: true },
  { id: 2, name: "Angkringan Mas Boy", distance: "300m", isOpen: true },
  { id: 3, name: "Warung Sembako Abadi", distance: "500m", isOpen: false },
  { id: 4, name: "Pecel Lele Barokah", distance: "800m", isOpen: true },
];

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const [isOnline, setIsOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8 min-h-screen">
      <header className="space-y-2">
        {!isOnline && (
          <Badge variant="outline" className="bg-accent/15 text-accent border-accent/20 font-medium mb-1">
            Bekerja Luring
          </Badge>
        )}
        <h1 className="text-4xl font-black text-primary tracking-tight">
          Makan apa hari ini?
        </h1>
        <p className="text-base text-muted-foreground font-body">
          Cari warung favorit di sekitarmu.
        </p>
      </header>

      <section className="relative">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Cari nama warung..."
            className="h-14 pl-14 pr-14 rounded-2xl bg-card border-2 border-border focus-visible:ring-primary shadow-sm text-base placeholder:text-muted-foreground"
          />
          <button className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start" >
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          MOCK_MERCHANTS.map((merchant) => (
            <div
              key={merchant.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group hover:border-primary/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                    {merchant.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1 opacity-70" />
                    <span className="font-body">{merchant.distance}</span>
                  </div>
                </div>
                <Badge variant={merchant.isOpen ? "success" : "outline"} className={merchant.isOpen ? "" : "bg-muted text-muted-foreground"}>
                  {merchant.isOpen ? "BUKA" : "TUTUP"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

