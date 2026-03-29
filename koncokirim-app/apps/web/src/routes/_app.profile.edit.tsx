import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import { Button } from "@koncokirim-app/ui/components/button";
import { Input } from "@koncokirim-app/ui/components/input";
import { Label } from "@koncokirim-app/ui/components/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/_app/profile/edit")({
  component: ProfileEditComponent,
});

function ProfileEditComponent() {
  const { data: profile, isLoading } = useQuery(trpc.profile.getProfile.queryOptions());

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const nameChanged = profile ? name !== profile.name : false;
  const phoneChanged = profile ? phone !== profile.phoneNumber : false;

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phoneNumber || "");
    }
  }, [profile]);

  const updateMutation = useMutation(trpc.profile.updateProfile.mutationOptions({
    onSuccess: () => {
      toast.success("Nama berhasil diperbarui");
      queryClient.invalidateQueries(trpc.profile.getProfile.queryFilter());
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const sendOtpMutation = useMutation(trpc.profile.sendOtp.mutationOptions({
    onSuccess: () => {
      toast.success("Kode OTP telah dikirim melalui WhatsApp!");
      setOtpMode(true);
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const verifyOtpMutation = useMutation(trpc.profile.verifyOtp.mutationOptions({
    onSuccess: () => {
      toast.success("Nomor telepon berhasil diverifikasi dan disimpan!");
      setOtpMode(false);
      setOtpCode("");
      queryClient.invalidateQueries(trpc.profile.getProfile.queryFilter());
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameChanged) return toast.info("Tidak ada perubahan nama.");
    updateMutation.mutate({ name });
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneChanged) return toast.info("Tidak ada perubahan nomor.");
    sendOtpMutation.mutate({ phoneNumber: phone });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return toast.error("Kode OTP harus 6 digit");
    verifyOtpMutation.mutate({ phoneNumber: phone, code: otpCode });
  };

  if (isLoading) return <div className="text-center py-12">Memuat...</div>;

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8 w-full relative">
      <header className="flex items-center space-x-4">
        <Link to="/profile" className="text-muted-foreground hover:text-primary">
          &larr;
        </Link>
        <h1 className="text-2xl font-black text-primary tracking-tight">Edit Profil</h1>
      </header>

      {/* Form: Edit Name */}
      <form onSubmit={handleNameSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg border-b border-border pb-2 mb-4">Ubah Nama</h2>

        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Masukkan nama"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!nameChanged || updateMutation.isPending}
        >
          Simpan Nama
        </Button>
      </form>

      {/* Form: Edit Phone */}
      <form onSubmit={handlePhoneSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg border-b border-border pb-2 mb-4">Ubah Nomor WhatsApp</h2>

        <div className="space-y-2">
          <Label>Nomor WhatsApp</Label>
          <Input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Contoh: 08123456789"
            type="tel"
          />
          <p className="text-xs text-muted-foreground pt-1">
            Perubahan nomor WhatsApp akan membutuhkan verifikasi OTP.
          </p>
        </div>

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={!phoneChanged || sendOtpMutation.isPending}
        >
          Verifikasi & Simpan Nomor
        </Button>
      </form>

      {/* OTP Overlay */}
      {otpMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl w-full max-w-sm relative space-y-6">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              onClick={() => setOtpMode(false)}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center pt-2">
              <h2 className="text-2xl font-black text-primary">Verifikasi OTP</h2>
              <p className="text-sm text-muted-foreground">
                Masukkan 6-digit kode OTP yang kami kirim ke <strong>{phone}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="text-center text-2xl font-bold tracking-[0.5em] h-14"
                autoFocus
                maxLength={6}
              />

              <Button type="submit" className="w-full" disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}>
                Konfirmasi OTP
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
