"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Banco Industrial", initials: "Bi", color: "text-blue-900", mark: "bg-blue-900" },
  { name: "BAC Credomatic", initials: "BAC", color: "text-red-600", mark: "bg-red-600" },
  { name: "G&T Continental", initials: "G&T", color: "text-blue-700", mark: "bg-amber-400" },
  { name: "Bam", initials: "Bam", color: "text-slate-900", mark: "bg-slate-900" },
  { name: "Arrend Leasing", initials: "AL", color: "text-slate-600", mark: "bg-red-500" },
  { name: "InterBanco", initials: "IB", color: "text-blue-800", mark: "bg-orange-500" }
];

export function FinancingPartners() {
  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="overflow-hidden rounded-lg border bg-white px-6 py-10 shadow-soft"
      >
        <h2 className="text-center text-xl font-black text-primary sm:text-2xl">
          Contamos con los mejores planes de financiamiento.
        </h2>
        <div className="mt-10 grid items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="flex min-h-20 items-center justify-center gap-3 rounded-md border border-transparent px-3 transition hover:border-slate-200 hover:bg-secondary/70"
              aria-label={partner.name}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-md ${partner.mark} text-sm font-black text-white`}>
                {partner.initials}
              </span>
              <span className={`text-lg font-black leading-tight ${partner.color}`}>
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
          Logotipos referenciales en formato propio. Sustituye por marcas oficiales solo si cuentas con autorización comercial.
        </p>
      </motion.div>
    </section>
  );
}
