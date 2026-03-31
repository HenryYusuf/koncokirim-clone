import { Button } from "@koncokirim-app/ui/components/button";
import { Input } from "@koncokirim-app/ui/components/input";
import { Label } from "@koncokirim-app/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/auth-validation";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          phoneNumber: value.phoneNumber,
        } as any, // Cast to any to bypass temporary type issues with better-auth additional fields
        {
          onSuccess: () => {
            toast.success("Akun berhasil dibuat!");
            navigate({ to: "/dashboard" });
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Gagal membuat akun");
          },
        },
      );
    },
  });

  if (isPending) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-3xl shadow-2xl border p-10 transition-all">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Daftar Akun</h1>
        <p className="text-muted-foreground mt-3 text-lg">Gabung dengan KoncoKirim sekarang</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="font-semibold">Nama Lengkap</Label>
              <Input
                id={field.name}
                placeholder="Masukkan nama Anda"
                className="rounded-xl focus-visible:ring-primary transition-all border-input"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error, i) => (
                <p key={`${field.name}-error-${i}`} className="text-sm font-medium text-destructive">
                  {typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error)}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="phoneNumber">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="font-semibold">Nomor WhatsApp</Label>
              <Input
                id={field.name}
                placeholder="Contoh: 081234567890"
                type="tel"
                className="rounded-xl focus-visible:ring-primary transition-all border-input"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Gunakan 08xx atau +628xx (Min. 10 digit)</p>
              {field.state.meta.errors.map((error, i) => (
                <p key={`${field.name}-error-${i}`} className="text-sm font-medium text-destructive">
                  {typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error)}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="font-semibold">Email</Label>
              <Input
                id={field.name}
                type="email"
                placeholder="nama@email.com"
                className="rounded-xl focus-visible:ring-primary transition-all border-input"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error, i) => (
                <p key={`${field.name}-error-${i}`} className="text-sm font-medium text-destructive">
                  {typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error)}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="font-semibold">Password</Label>
              <Input
                id={field.name}
                type="password"
                placeholder="Min. 8 karakter"
                className="rounded-xl focus-visible:ring-primary transition-all border-input"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error, i) => (
                <p key={`${field.name}-error-${i}`} className="text-sm font-medium text-destructive">
                  {typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error)}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 active:scale-95 font-bold h-12"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-8 text-center border-t pt-6 bg-muted/20 -mx-8 -mb-8 rounded-b-2xl p-6">
        <p className="text-sm text-muted-foreground mb-1">Sudah punya akun?</p>
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-primary font-bold hover:no-underline hover:text-primary/80 transition-colors p-0"
        >
          Masuk di sini
        </Button>
      </div>
    </div>
  );
}
