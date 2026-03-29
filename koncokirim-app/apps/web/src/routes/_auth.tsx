import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <header className="flex items-center justify-between px-8 py-6 z-10">
        <Link to="/" className="flex items-center space-x-2 no-underline">
          <span className="font-black text-2xl tracking-tighter text-foreground">
            Konco<span className="text-primary">Kirim</span>
          </span>
        </Link>
        <ModeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      <footer className="px-8 py-6 text-center text-sm text-muted-foreground z-10">
        &copy; {new Date().getFullYear()} KoncoKirim. All rights reserved.
      </footer>
    </div>
  );
}
