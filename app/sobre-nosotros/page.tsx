import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, ClipboardCheck, Eye, HandHeart, ShieldCheck, Target, TimerReset, Users } from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros",
  description: "Conoce quiénes somos, misión, visión, valores y equipo de Lemanza Motores."
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

const values: { title: string; Icon: LucideIcon }[] = [
  { title: "Actitud de servicio", Icon: HandHeart },
  { title: "Cumplimiento", Icon: BadgeCheck },
  { title: "Disciplina", Icon: TimerReset },
  { title: "Respeto", Icon: ShieldCheck }
];

const team = [
  { name: "Dary López", role: "Gerente General", level: "top" },
  { name: "Emerson Santizo", role: "Jefe de operaciones", level: "lead" },
  { name: "Nancy Escobar", role: "Jefa de logística y comercio exterior", level: "lead" },
  { name: "Alisson Turuy", role: "Jefe de Administración de Personal y Finanzas Corporativas", level: "lead" },
  { name: "Marco Cano", role: "Jefe de servicio técnico", level: "lead" },
  { name: "Jennifer Marroquín", role: "Jefe de departamento Comercial y Marketing", level: "lead" }
];

export default function AboutPage() {
  const [manager, ...leaders] = team;

  return (
    <div className="bg-secondary/60">
      <section className="relative overflow-hidden bg-primary text-white">
        <Image src="/brand/integrantes.png" alt="Equipo Lemanza Motores" fill className="object-cover opacity-70" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/20" />
        <div className="container-page relative grid min-h-[620px] content-center py-20">
          <div className="max-w-3xl">
            <p className="font-bold text-accent">Sobre Nosotros</p>
            <h1 className="mt-3 text-5xl font-black leading-tight md:text-6xl">¿Quiénes somos?</h1>
            <div className="mt-8 max-w-2xl rounded-lg border border-accent/70 bg-primary/78 p-6 shadow-soft backdrop-blur">
              <p className="text-lg leading-8 text-white/90">
                Somos una empresa local comprometida con la excelencia en logística y transporte. Nos especializamos en diseñar soluciones integrales de movilidad para diversos sectores industriales y comerciales, sin descuidar la calidez y eficiencia que el público general merece.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page section">
        <div className="grid gap-5 lg:grid-cols-2">
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
          <h2 className="mt-2 text-3xl font-black">Nuestros valores</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, Icon }) => (
              <article key={title} className="rounded-lg bg-primary p-6 text-white shadow-soft">
                <Icon className="text-accent" />
                <h3 className="mt-6 text-xl font-black uppercase">{title}</h3>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="font-bold text-accent">Equipo Lemanza</p>
          <h2 className="mt-2 text-3xl font-black">Organigrama</h2>
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-soft">
            <div className="relative aspect-[16/7] min-h-[260px]">
              <Image src="/brand/integrantes.png" alt="Integrantes de Lemanza Motores" fill className="object-cover" />
            </div>
          </div>

          <div className="mt-8 grid justify-items-center gap-6">
            <article className="w-full max-w-md rounded-lg border-2 border-accent bg-white p-6 text-center shadow-soft">
              <Users className="mx-auto text-accent" />
              <h3 className="mt-3 text-2xl font-black">{manager.name}</h3>
              <p className="mt-1 font-semibold text-primary">{manager.role}</p>
            </article>
            <div className="h-8 w-px bg-border" />
            <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-5">
              {leaders.map((member) => (
                <article key={member.name} className="rounded-lg border bg-white p-5 text-center shadow-soft">
                  <ClipboardCheck className="mx-auto text-accent" />
                  <h3 className="mt-3 text-lg font-black">{member.name}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{member.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
