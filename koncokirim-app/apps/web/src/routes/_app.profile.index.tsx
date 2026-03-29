import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@koncokirim-app/ui/components/button";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_app/profile/")({
  component: ProfileHubComponent,
});

function ProfileHubComponent() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      },
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "KK";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8 w-full">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary tracking-tight">Profil Saya</h1>
          <p className="text-base text-muted-foreground font-body">
            Atur identitas dan alamat pengiriman.
          </p>
        </div>
        <ModeToggle />
      </header>

      {/* Avatar & Profile Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
        <div className="h-16 w-16 min-w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
          {getInitials(session.data?.user.name)}
        </div>
        <div className="overflow-hidden">
          <p className="text-lg font-black text-foreground truncate">{session.data?.user.name}</p>
          <p className="text-sm font-semibold text-muted-foreground truncate">{session.data?.user.email}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <Link to="/profile/edit" className="p-4 border-b border-border hover:bg-muted transition-colors flex justify-between items-center group">
          <div className="font-bold text-foreground group-hover:text-primary transition-colors">Edit Profil</div>
          <div className="text-muted-foreground">&rarr;</div>
        </Link>
        <Link to="/profile/addresses" className="p-4 border-b border-border hover:bg-muted transition-colors flex justify-between items-center group">
          <div className="font-bold text-foreground group-hover:text-primary transition-colors">Buku Alamat</div>
          <div className="text-muted-foreground">&rarr;</div>
        </Link>
        <Link to="/profile/security" className="p-4 hover:bg-muted transition-colors flex justify-between items-center group">
          <div className="font-bold text-foreground group-hover:text-primary transition-colors">Keamanan Akun</div>
          <div className="text-muted-foreground">&rarr;</div>
        </Link>
      </div>

      <div className="pt-4">
        <Button 
          variant="destructive" 
          className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
