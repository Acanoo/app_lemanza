import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactPhoneDisplay } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Sucursales" };
export const dynamic = "force-dynamic";

async function getBranches() {
  try {
    return await prisma.branch.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function BranchesPage() {
  const branches = await getBranches();

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
            <p className="mt-2 font-semibold">PBX {branch.phone || contactPhoneDisplay}</p>
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
