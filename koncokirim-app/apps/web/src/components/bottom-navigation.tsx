import { Link, useLocation } from "@tanstack/react-router";
import { Home, ClipboardList, User } from "lucide-react";
import { cn } from "@koncokirim-app/ui/lib/utils";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    to: "/orders",
    label: "Status",
    icon: ClipboardList,
  },
  {
    to: "/profile",
    label: "Profil",
    icon: User,
  },
] as const;

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-6 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-body">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
