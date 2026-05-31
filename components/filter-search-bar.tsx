"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { brands, transmissions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { vehicleTypeVisuals } from "@/lib/vehicle-visuals";

type FilterSearchBarProps = {
  compact?: boolean;
  typeOptions?: string[];
};

export function FilterSearchBar({ compact = false, typeOptions }: FilterSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [openTypes, setOpenTypes] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!typeRef.current?.contains(event.target as Node)) setOpenTypes(false);
    }
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  function submit() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (brand) params.set("brand", brand);
    if (transmission) params.set("transmission", transmission);
    router.push(`/catalogo?${params.toString()}`);
  }

  const availableTypes = useMemo(() => new Set(typeOptions ?? vehicleTypeVisuals.map((item) => item.value).filter(Boolean)), [typeOptions]);
  const visibleTypeOptions = useMemo(() => vehicleTypeVisuals.filter((item) => item.value === "" || availableTypes.has(item.value)), [availableTypes]);
  const selectedType = visibleTypeOptions.find((item) => item.value === type) || vehicleTypeVisuals[0];

  useEffect(() => {
    if (type && !availableTypes.has(type)) setType("");
  }, [availableTypes, type]);

  return (
    <div className={cn("relative z-20 rounded-lg border bg-white p-3 shadow-soft", compact && "rounded-none border-x-0 shadow-none")}>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_auto_auto]">
        <div className="flex h-12 items-center gap-3 rounded-md border border-input px-4">
          <Search size={20} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            placeholder="¿Qué estás buscando?"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div ref={typeRef} className="relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setOpenTypes((value) => !value);
            }}
            className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-4 text-left text-sm font-medium"
          >
            <span>{selectedType.label === "Todos" ? "Tipo de auto" : selectedType.label}</span>
            {openTypes ? <ChevronUp size={18} className="text-sky-600" /> : <ChevronDown size={18} className="text-sky-600" />}
          </button>
          <AnimatePresence>
            {openTypes && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-0 top-[calc(100%+8px)] z-40 max-h-96 w-full min-w-72 overflow-y-auto rounded-lg border bg-white p-2 shadow-2xl"
            >
              {visibleTypeOptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setType(item.value);
                    setOpenTypes(false);
                  }}
                  className={cn("mb-2 flex h-12 w-full items-center justify-between rounded-md border px-4 text-left text-sm font-semibold transition hover:bg-secondary", type === item.value && "border-accent bg-amber-50")}
                >
                  <span>{item.label}</span>
                  <Image src={item.image} alt={item.label} width={82} height={42} className="h-10 w-20 object-contain" />
                </button>
              ))}
            </motion.div>
            )}
          </AnimatePresence>
        </div>

        <select className="h-12 rounded-md border border-input bg-white px-4 text-sm" value={brand} onChange={(event) => setBrand(event.target.value)}>
          <option value="">Marca</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <select className="h-12 rounded-md border border-input bg-white px-4 text-sm" value={transmission} onChange={(event) => setTransmission(event.target.value)}>
          <option value="">Transmisión</option>
          {transmissions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <Button type="button" variant="outline" className="h-12 px-4" aria-label="Filtros avanzados">
          <SlidersHorizontal size={20} />
        </Button>
        <Button type="button" onClick={submit} className="h-12 min-w-40">Ver resultados</Button>
      </div>
    </div>
  );
}
