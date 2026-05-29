import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-black">Vehículo no encontrado</h1>
      <p className="mt-2 text-muted-foreground">Puede que haya sido vendido o retirado del catálogo.</p>
      <Button asChild className="mt-6"><Link href="/catalogo">Volver al catálogo</Link></Button>
    </div>
  );
}
