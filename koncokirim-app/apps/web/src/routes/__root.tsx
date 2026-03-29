import { Toaster } from "@koncokirim-app/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import type { trpc } from "@/utils/trpc";

import "../index.css";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "KoncoKirim | Logistics Platform",
      },
      {
        name: "description",
        content: "KoncoKirim is the ultimate platform for seamless delivery and logistics management.",
      },
    ],

    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-svh flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <p className="text-xl font-bold font-body">Ops! Halaman tidak ditemukan.</p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black uppercase text-sm"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  ),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <Outlet />


        <Toaster richColors position="top-right" />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  );
}
