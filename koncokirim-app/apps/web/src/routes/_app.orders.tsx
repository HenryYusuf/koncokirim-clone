import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersComponent,
});

function OrdersComponent() {
  return (
    <div className="max-w-md mx-auto px-6 pt-12 pb-8 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <h1 className="text-2xl font-black text-primary">Status Pesanan</h1>
      <p className="text-muted-foreground font-body">
        Belum ada pesanan aktif. Mulai belanja di Dashboard!
      </p>
    </div>
  );
}
