import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactPhoneDisplay } from "@/lib/contact";
import { getBranches } from "@/lib/vehicles";

export const metadata = { title: "Sucursales" };
export const dynamic = "force-dynamic";

const fallbackBranches = [
  { id: "1", name: "Agencia Yurrita", address: "Ruta 6, 9-18, Zona 4, Guatemala", phone: contactPhoneDisplay, mapsUrl: "https://maps.google.com/?q=Ruta+6+9-18+Zona+4+Guatemala", wazeUrl: "https://waze.com/ul?q=Ruta%206%209-18%20Zona%204%20Guatemala" },
  { id: "2", name: "Agencia Roosevelt", address: "Km. 14 Calzada Roosevelt, 5-25 Zona 3 de Mixco, Guatemala", phone: contactPhoneDisplay, mapsUrl: "https://maps.google.com/?q=Km+14+Calzada+Roosevelt+Mixco", wazeUrl: "https://waze.com/ul?q=Km%2014%20Calzada%20Roosevelt%20Mixco" },
  { id: "3", name: "Agencia Zona 10", address: "10 avenida 14-73, zona 10 Guatemala", phone: contactPhoneDisplay, mapsUrl: "https://maps.google.com/?q=10+avenida+14-73+zona+10+Guatemala", wazeUrl: "https://waze.com/ul?q=10%20avenida%2014-73%20zona%2010%20Guatemala" }
];

export default async function BranchesPage() {
  const dbBranches = await getBranches();
  const branches = dbBranches.length ? dbBranches : fallbackBranches;
  return (
    <div className="container-page section">
      <p className="font-bold text-accent">Cobertura Guatemala</p>
      <h1 className="mt-2 text-4xl font-black">Sucursales</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {branches.filter((branch) => branch.name !== "Agencia Virtual").map((branch) => (
          <div key={branch.id} className="rounded-lg border bg-white p-6 shadow-soft">
            <MapPin className="text-accent" />
            <h2 className="mt-4 text-xl font-black">{branch.name}</h2>
            <p className="mt-2 text-slate-600">{branch.address}</p>
            <p className="mt-2 font-semibold">PBX {contactPhoneDisplay}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild><a href={branch.mapsUrl} target="_blank" rel="noreferrer">Google Maps</a></Button>
              <Button asChild variant="outline"><a href={branch.wazeUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Waze</a></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
