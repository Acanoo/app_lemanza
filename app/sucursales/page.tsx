import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactPhoneDisplay } from "@/lib/contact";

export const metadata = { title: "Sucursales" };

const branches = [
  {
    id: "lemanza-roosevelt",
    name: "Sucursal Lemanza Motores",
    address: "Km 14.5 Calz. Roosevelt Mixco, Calzada Roosevelt, Cdad. de Guatemala",
    mapsUrl: "https://maps.google.com/?q=Km+14.5+Calz.+Roosevelt+Mixco+Calzada+Roosevelt+Ciudad+de+Guatemala",
    wazeUrl: "https://waze.com/ul?q=Km%2014.5%20Calz.%20Roosevelt%20Mixco%20Calzada%20Roosevelt%20Ciudad%20de%20Guatemala"
  },
  {
    id: "lemanza-avia",
    name: "Centro Comercial Avia",
    address: "AVIA, 11 Calle 2-25, Cdad. de Guatemala 01010",
    mapsUrl: "https://maps.google.com/?q=AVIA+11+Calle+2-25+Ciudad+de+Guatemala+01010",
    wazeUrl: "https://waze.com/ul?q=AVIA%2011%20Calle%202-25%20Ciudad%20de%20Guatemala%2001010"
  },
  {
    id: "lemanza-carretera-salvador",
    name: "Sucursal Carretera a El Salvador",
    address: "Km. 15.8 Carretera a El Salvador",
    mapsUrl: "https://maps.google.com/?q=Km.+15.8+Carretera+a+El+Salvador+Guatemala",
    wazeUrl: "https://waze.com/ul?q=Km.%2015.8%20Carretera%20a%20El%20Salvador%20Guatemala"
  },
  {
    id: "lemanza-majadas",
    name: "Sucursal Majadas",
    address: "28av 5-20 Zona 11",
    mapsUrl: "https://maps.google.com/?q=28av+5-20+Zona+11+Guatemala",
    wazeUrl: "https://waze.com/ul?q=28av%205-20%20Zona%2011%20Guatemala"
  },
  {
    id: "lemanza-zona-9-mazda",
    name: "Sucursal Zona 9 Edificio Mazda",
    address: "1a. Calle 7-69, Zona 9. Edificio Mazda",
    mapsUrl: "https://maps.google.com/?q=1a.+Calle+7-69+Zona+9+Edificio+Mazda+Guatemala",
    wazeUrl: "https://waze.com/ul?q=1a.%20Calle%207-69%20Zona%209%20Edificio%20Mazda%20Guatemala"
  }
];

export default function BranchesPage() {
  return (
    <div className="container-page section">
      <p className="font-bold text-accent">Cobertura Guatemala</p>
      <h1 className="mt-2 text-4xl font-black">Sucursales</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
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
