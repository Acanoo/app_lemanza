"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { contactPhoneDisplay } from "@/lib/contact";
import { promoSlides } from "@/lib/vehicle-visuals";

export function PromoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % promoSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  function move(direction: 1 | -1) {
    setActive((value) => (value + direction + promoSlides.length) % promoSlides.length);
  }

  const slide = promoSlides[active];

  return (
    <div className="relative mt-4 overflow-hidden rounded-lg bg-slate-950">
      <div className="relative min-h-[280px] sm:min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-70" priority />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-slate-950/20" />
        <div className="relative flex min-h-[280px] flex-col justify-center px-8 py-10 text-white sm:min-h-[360px] lg:px-16">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-accent">Lemanza Motores</p>
          <h2 className="mt-3 max-w-2xl text-5xl font-black leading-none sm:text-7xl">{slide.title}</h2>
          <p className="mt-5 max-w-xl text-lg text-white/85">{slide.subtitle}</p>
        </div>
      </div>
      <button className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25" onClick={() => move(-1)} aria-label="Anterior">
        <ChevronLeft />
      </button>
      <button className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25" onClick={() => move(1)} aria-label="Siguiente">
        <ChevronRight />
      </button>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-black/55 px-6 py-4 text-sm font-semibold text-white">
        <span className="flex items-center gap-2"><MapPin size={17} /> Roosevelt · Avia · Carretera a El Salvador · Majadas · Zona 9</span>
        <span>Agenda tu cita: {contactPhoneDisplay}</span>
      </div>
    </div>
  );
}
