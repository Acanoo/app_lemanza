"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";

const nav = [
  ["Inicio", "/"],
  ["Catálogo", "/catalogo"],
  ["Sobre Nosotros", "/sobre-nosotros"],
  ["Servicios", "/servicios"],
  ["Beneficios", "/beneficios"],
  ["Sucursales", "/sucursales"],
  ["Contacto", "/contacto"]
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/92 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo.jpeg" alt="Lemanza Motores" width={58} height={58} className="h-14 w-14 rounded-md object-cover" priority />
          <div>
            <p className="text-lg font-black leading-none tracking-wide text-primary">Lemanza Motores</p>
            <p className="text-xs font-medium text-muted-foreground">Auténtico como tú</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-slate-700 transition hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="accent">
            <a href={whatsappUrl("Hola, quiero información sobre vehículos disponibles en Lemanza Motores.")} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="container-page grid gap-4 py-5">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="font-semibold text-slate-700">
                {label}
              </Link>
            ))}
            <Button asChild variant="accent">
              <a href={whatsappUrl("Hola, quiero información sobre vehículos disponibles en Lemanza Motores.")} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
