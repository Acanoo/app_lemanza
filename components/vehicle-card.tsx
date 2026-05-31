"use client";

import Image from "next/image";
import Link from "next/link";
import { Gauge, MapPin, Settings, Calculator, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VehiclePlateMask } from "@/components/vehicle-plate-mask";
import { formatGtq } from "@/lib/utils";

type VehicleCardProps = {
  vehicle: {
    id: string;
    slug: string;
    internalCode: string;
    brand: string;
    model: string;
    year: number;
    motor: string;
    transmission: string;
    mileage: number;
    status: string;
    priceGtq: unknown;
    images: { url: string; alt: string }[];
    branch?: { name: string };
  };
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, ease: "easeOut" }}>
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image src={vehicle.images[0]?.url || "/brand/logo.jpeg"} alt={vehicle.images[0]?.alt || vehicle.model} fill className="object-cover transition duration-500 hover:scale-105" />
          <VehiclePlateMask />
          <Badge className="absolute left-3 top-3 bg-white/92 text-primary">{vehicle.status}</Badge>
        </div>
        <CardContent>
          <p className="text-2xl font-black text-primary">{formatGtq(vehicle.priceGtq)}</p>
          <h3 className="mt-2 text-lg font-black">{vehicle.brand} {vehicle.model} {vehicle.year}</h3>
          <p className="text-sm font-semibold text-accent">{vehicle.internalCode}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <span className="flex items-center gap-2"><Settings size={16} /> {vehicle.motor} · {vehicle.transmission}</span>
            <span className="flex items-center gap-2"><Gauge size={16} /> {vehicle.mileage.toLocaleString("es-GT")} km</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> {vehicle.branch?.name}</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <Button asChild size="sm"><Link href={`/catalogo/${vehicle.slug}`}>Ver más</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/catalogo/${vehicle.slug}#cotizar`}><FileText size={15} /> Cotizar</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/catalogo/${vehicle.slug}#cuotas`}><Calculator size={15} /></Link></Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
