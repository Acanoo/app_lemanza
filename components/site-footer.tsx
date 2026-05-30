import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { contactPhoneDisplay } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <h2 className="text-2xl font-black">Lemanza Motores</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/75">Auténtico como tú.</p>
          <div className="mt-5 flex gap-3 text-white/80">
            <Phone size={18} /> PBX {process.env.PBX || contactPhoneDisplay}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Explorar</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/75">
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/sobre-nosotros">Sobre Nosotros</Link>
            <Link href="/servicios">Servicios</Link>
            <Link href="/beneficios">Beneficios</Link>
            <Link href="/sucursales">Sucursales</Link>
          </div>
          <div className="mt-5 flex gap-4">
            <Facebook size={20} />
            <Instagram size={20} />
            <Mail size={20} />
          </div>
        </div>
        <div>
          <h3 className="font-bold">Newsletter</h3>
          <NewsletterForm compact />
        </div>
      </div>
    </footer>
  );
}
