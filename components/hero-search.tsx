"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brands } from "@/lib/constants";

export function HeroSearch() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function search() {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/catalogo?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-lg bg-white p-4 shadow-soft md:grid-cols-[1fr_1fr_auto]">
      <select className="h-11 rounded-md border px-3 text-sm" value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="">Marca</option>
        {brands.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <Input placeholder="Precio máximo en Q" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <Button onClick={search} variant="accent"><Search size={17} /> Buscar</Button>
    </div>
  );
}
