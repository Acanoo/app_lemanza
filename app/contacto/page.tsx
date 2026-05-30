import { Mail, MessageCircle, Phone } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { QuoteForm } from "@/components/quote-form";
import { Button } from "@/components/ui/button";
import { contactPhoneDisplay } from "@/lib/contact";
import { whatsappUrl } from "@/lib/utils";

export const metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <div className="bg-secondary/60">
      <div className="container-page section grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-bold text-accent">Hablemos</p>
          <h1 className="mt-2 text-4xl font-black">Contacto</h1>
          <div className="mt-8 grid gap-4">
            <p className="flex items-center gap-3"><Phone className="text-accent" /> PBX {process.env.PBX || contactPhoneDisplay}</p>
            <p className="flex items-center gap-3"><Mail className="text-accent" /> ventas@lemanzamotores.gt</p>
            <Button asChild variant="accent"><a href={whatsappUrl("Hola, quiero contactar a Lemanza Motores.")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a></Button>
          </div>
          <div className="mt-8"><NewsletterForm /></div>
        </div>
        <QuoteForm />
      </div>
    </div>
  );
}
