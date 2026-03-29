import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import { Button } from "@koncokirim-app/ui/components/button";
import { Input } from "@koncokirim-app/ui/components/input";
import { Label } from "@koncokirim-app/ui/components/label";
import { useState } from "react";
import { toast } from "sonner";
import { Check, MapPin, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/profile/addresses")({
  component: ProfileAddressesComponent,
});

function ProfileAddressesComponent() {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    fullAddress: "",
    receiverName: "",
    receiverPhone: "",
    isDefault: false,
  });

  const { data: addresses, isLoading } = useQuery(trpc.profile.getAddresses.queryOptions());

  const addMutation = useMutation(trpc.profile.addAddress.mutationOptions({
    onSuccess: () => {
      toast.success("Alamat berhasil ditambahkan");
      setIsAdding(false);
      setFormData({ label: "", fullAddress: "", receiverName: "", receiverPhone: "", isDefault: false });
      queryClient.invalidateQueries(trpc.profile.getAddresses.queryFilter());
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const deleteMutation = useMutation(trpc.profile.deleteAddress.mutationOptions({
    onSuccess: () => {
      toast.success("Alamat dihapus");
      queryClient.invalidateQueries(trpc.profile.getAddresses.queryFilter());
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const setDefaultMutation = useMutation(trpc.profile.setDefaultAddress.mutationOptions({
    onSuccess: () => {
      toast.success("Alamat utama diperbarui");
      queryClient.invalidateQueries(trpc.profile.getAddresses.queryFilter());
    },
    onError: (e: any) => toast.error(e.message),
  }));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 space-y-8 w-full">
      <header className="flex items-center space-x-4">
        <Link to="/profile" className="text-muted-foreground hover:text-primary">
          &larr;
        </Link>
        <h1 className="text-2xl font-black text-primary tracking-tight">Buku Alamat</h1>
      </header>
      
      {!isAdding ? (
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm text-center py-8">Memuat alamat...</p>
          ) : addresses?.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <MapPin className="w-12 h-12 text-muted mx-auto" />
              <p className="text-sm text-muted-foreground">Belum ada alamat tersimpan.</p>
            </div>
          ) : (
            addresses?.map((addr) => (
              <div key={addr.id} className={`bg-card border ${addr.isDefault ? "border-primary" : "border-border"} rounded-2xl p-4 shadow-sm relative space-y-2`}>
                {addr.isDefault && (
                  <div className="absolute top-4 right-4 flex items-center text-xs font-bold text-primary">
                    <Check className="w-4 h-4 mr-1" /> Utama
                  </div>
                )}
                
                <h3 className="font-bold text-foreground text-lg">{addr.label}</h3>
                <div className="text-sm text-foreground/80 space-y-1">
                  <p className="font-semibold">{addr.receiverName} - {addr.receiverPhone}</p>
                  <p className="text-muted-foreground">{addr.fullAddress}</p>
                </div>
                
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-border mt-3">
                  {!addr.isDefault && (
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex-1 text-xs" 
                       onClick={() => setDefaultMutation.mutate({ id: addr.id })}
                     >
                       Jadikan Utama
                     </Button>
                  )}
                  <Button 
                    variant={addr.isDefault ? "outline" : "ghost"}
                    size="icon" 
                    className="text-destructive shrink-0" 
                    onClick={() => deleteMutation.mutate({ id: addr.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          <Button 
            className="w-full mt-4" 
            onClick={() => setIsAdding(true)}
            disabled={addresses && addresses.length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Alamat Baru
          </Button>
          {(addresses && addresses.length >= 3) && (
             <p className="text-xs text-center text-muted-foreground pt-2">Maksimal 3 alamat diperbolehkan.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleAddSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-lg mb-4">Alamat Baru</h2>
          
          <div className="space-y-2">
             <Label>Label (Mis. Rumah, Kantor)</Label>
             <Input required value={formData.label} onChange={e => setFormData(f => ({...f, label: e.target.value}))} />
          </div>
          
          <div className="space-y-2">
             <Label>Nama Penerima</Label>
             <Input required value={formData.receiverName} onChange={e => setFormData(f => ({...f, receiverName: e.target.value}))} />
          </div>

          <div className="space-y-2">
             <Label>No. Telepon Penerima</Label>
             <Input required type="tel" value={formData.receiverPhone} onChange={e => setFormData(f => ({...f, receiverPhone: e.target.value}))} />
          </div>

          <div className="space-y-2">
             <Label>Alamat Lengkap</Label>
             <Input required value={formData.fullAddress} onChange={e => setFormData(f => ({...f, fullAddress: e.target.value}))} />
          </div>

          <div className="pt-4 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
              Simpan
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
