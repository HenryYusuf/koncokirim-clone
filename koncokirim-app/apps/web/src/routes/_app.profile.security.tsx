import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@koncokirim-app/ui/components/button";
import { Input } from "@koncokirim-app/ui/components/input";
import { Label } from "@koncokirim-app/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/security")({
  component: ProfileSecurityComponent,
});

function ProfileSecurityComponent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Konfirmasi sandi baru tidak cocok.");
    }
    
    setIsChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      }, {
        onSuccess: () => {
          toast.success("Sandi berhasil diubah");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal mengubah sandi");
        }
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);
    try {
      await authClient.changeEmail({
        newEmail,
      }, {
        onSuccess: () => {
          toast.success("Tautan verifikasi telah dikirim ke email baru");
          setNewEmail("");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal mengubah email");
        }
      });
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8 w-full">
      <header className="flex items-center space-x-4">
        <Link to="/profile" className="text-muted-foreground hover:text-primary">
          &larr;
        </Link>
        <h1 className="text-2xl font-black text-primary tracking-tight">Keamanan</h1>
      </header>
      
      <form onSubmit={handleEmailSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg border-b border-border pb-2 mb-4">Ubah Email</h2>
        
        <div className="space-y-2">
           <Label htmlFor="newEmail">Email Baru</Label>
           <Input 
             id="newEmail"
             name="email"
             type="email" 
             required 
             autoComplete="email"
             value={newEmail} 
             onChange={e => setNewEmail(e.target.value)} 
             placeholder="Masukkan email baru"
           />
        </div>

        <Button type="submit" disabled={isChangingEmail} variant="secondary" className="w-full">
          Ubah Email
        </Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg border-b border-border pb-2 mb-4">Ubah Kata Sandi</h2>
        
        <div className="space-y-2">
           <Label htmlFor="currentPassword">Sandi Saat Ini</Label>
           <Input 
             id="currentPassword"
             name="password"
             type="password" 
             required 
             autoComplete="current-password"
             value={currentPassword} 
             onChange={e => setCurrentPassword(e.target.value)} 
           />
        </div>

        <div className="space-y-2">
           <Label htmlFor="newPassword">Sandi Baru</Label>
           <Input 
             id="newPassword"
             name="new-password"
             type="password" 
             required 
             autoComplete="new-password"
             value={newPassword} 
             onChange={e => setNewPassword(e.target.value)} 
           />
        </div>

        <div className="space-y-2">
           <Label htmlFor="confirmPassword">Konfirmasi Sandi Baru</Label>
           <Input 
             id="confirmPassword"
             name="confirm-password"
             type="password" 
             required 
             autoComplete="new-password"
             value={confirmPassword} 
             onChange={e => setConfirmPassword(e.target.value)} 
           />
        </div>

        <Button type="submit" disabled={isChangingPassword} className="w-full">
          Simpan Sandi
        </Button>
      </form>
    </div>
  );
}
