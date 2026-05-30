import type { Metadata } from "next";
import { FinancingPartners } from "@/components/financing-partners";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lemanza Motores | Autos nuevos y usados en Guatemala",
    template: "%s | Lemanza Motores"
  },
  description: "Marketplace automotriz premium en Guatemala con catálogo, financiamiento, cotización y sucursales.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/brand/logo-icon.png",
    shortcut: "/brand/logo-icon.png",
    apple: "/brand/logo-icon.png"
  },
  openGraph: {
    title: "Lemanza Motores",
    description: "Autos nuevos y usados para Guatemala.",
    images: ["/brand/logo.jpeg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT">
      <body>
        <QueryProvider>
          <SiteHeader />
          <main>{children}</main>
          <FinancingPartners />
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
