"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getPlateMaskedImageUrl } from "@/lib/vehicle-images";

export function VehicleGallery({ images, has360 }: { images: { url: string; alt: string }[]; has360?: boolean }) {
  const [active, setActive] = useState(0);
  const selected = images[active] || images[0];
  const selectedUrl = getPlateMaskedImageUrl(selected?.url) || "/brand/logo.jpeg";

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
        <AnimatePresence mode="wait">
          <motion.div key={selected?.url} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
            <Image src={selectedUrl} alt={selected?.alt || "Vehiculo"} fill className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
        <Badge className="absolute bottom-4 right-4 bg-white/90 text-primary">{active + 1}/{Math.max(images.length, 1)}</Badge>
        {has360 && <Badge className="absolute left-4 top-4 bg-accent text-primary">Vista 360 disponible</Badge>}
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {images.map((image, index) => (
          <button key={`${image.url}-${index}`} onClick={() => setActive(index)} className={`relative aspect-square overflow-hidden rounded-md border ${active === index ? "ring-2 ring-accent" : ""}`}>
            <Image src={getPlateMaskedImageUrl(image.url) || image.url} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
