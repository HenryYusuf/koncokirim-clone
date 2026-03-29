import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@koncokirim-app/ui/components/button";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createFileRoute("/_app/profile")({
  component: ProfileComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    return { session };
  },
});

function ProfileComponent() {
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

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary tracking-tight">Profil Saya</h1>
          <p className="text-base text-muted-foreground font-body">
            Atur identitas dan alamat pengiriman.
          </p>
        </div>
        <ModeToggle />
      </header>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama</label>
            <p className="text-lg font-black text-foreground">{session.data?.user.name}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
            <p className="text-lg font-black text-foreground">{session.data?.user.email}</p>
          </div>
        </div>
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
