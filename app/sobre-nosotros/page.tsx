import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Eye, Gem, Handshake, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros",
  description: "Conoce la misión, visión y valores de Lemanza Motores."
};

const pillars: { title: string; copy: string; Icon: LucideIcon }[] = [
  {
    title: "Visión",
    Icon: Eye,
    copy: "Ser una importadora de vehículos reconocida a nivel nacional por su excelencia en servicio, variedad de automóviles y compromiso con la satisfacción del cliente, posicionándonos como una de las empresas líderes en el mercado automotriz."
  },
  {
    title: "Misión",
    Icon: Target,
    copy: "Brindar a nuestros clientes vehículos importados de alta calidad, garantizando confianza, transparencia y un excelente servicio antes, durante y después de cada compra, satisfaciendo sus necesidades de movilidad con precios competitivos y asesoría personalizada."
  }
];

const values: { title: string; copy: string; Icon: LucideIcon }[] = [
  {
    title: "Confianza",
    Icon: ShieldCheck,
    copy: "Construimos relaciones claras y seguras en cada etapa de la compra."
  },
  {
    title: "Transparencia",
    Icon: Handshake,
    copy: "Compartimos información honesta para que cada cliente decida con tranquilidad."
  },
  {
    title: "Calidad",
    Icon: Gem,
    copy: "Seleccionamos vehículos importados que respondan a altos estándares."
  },
  {
    title: "Servicio",
    Icon: HeartHandshake,
    copy: "Acompañamos antes, durante y después de cada entrega."
  },
  {
    title: "Compromiso",
    Icon: BadgeCheck,
    copy: "Trabajamos para superar expectativas y fortalecer la satisfacción del cliente."
  },
  {
    title: "Asesoría personalizada",
    Icon: Sparkles,
    copy: "Orientamos cada búsqueda según presupuesto, estilo de vida y necesidad de movilidad."
  }
];

export default function AboutPage() {
  return (
    <div className="bg-secondary/60">
      <section className="container-page section">
        <p className="font-bold text-accent">Sobre Nosotros</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
          Importamos vehículos con confianza, transparencia y servicio personalizado
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          En Lemanza Motores conectamos a nuestros clientes con automóviles importados de alta calidad, precios competitivos y un acompañamiento cercano en todo el proceso.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {pillars.map(({ title, copy, Icon }) => (
            <article key={title} className="rounded-lg bg-white p-7 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/12 text-accent">
                <Icon size={26} />
              </div>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <p className="font-bold text-accent">Nuestros principios</p>
          <h2 className="mt-2 text-3xl font-black">Valores que guían cada venta</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map(({ title, copy, Icon }) => (
              <article key={title} className="rounded-lg border bg-white p-6 shadow-soft">
                <Icon className="text-accent" />
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
