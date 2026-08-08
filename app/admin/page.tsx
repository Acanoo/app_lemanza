import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Car,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  Inbox,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  Tags,
  UserPlus,
  Users
} from "lucide-react";
import { AdminBranchManager } from "@/components/admin-branch-manager";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { AdminSyncButton } from "@/components/admin-sync-button";
import { AdminUserActions } from "@/components/admin-user-actions";
import { AdminUserCreateForm } from "@/components/admin-user-create-form";
import { AdminVehicleActions } from "@/components/admin-vehicle-actions";
import { AdminVehicleCreateForm } from "@/components/admin-vehicle-create-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { formatGtq } from "@/lib/utils";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

type AdminData = Awaited<ReturnType<typeof getAdminData>>;

const statusTone: Record<string, string> = {
  DISPONIBLE: "bg-emerald-100 text-emerald-800",
  USADO: "bg-sky-100 text-sky-800",
  NUEVO: "bg-indigo-100 text-indigo-800",
  RESERVADO: "bg-amber-100 text-amber-800",
  VENDIDO: "bg-slate-200 text-slate-800"
};

function shortDate(value: Date) {
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

async function getAdminData() {
  try {
    const [
      totalVehicles,
      activeVehicles,
      soldVehicles,
      reservedVehicles,
      quotesCount,
      newsletterCount,
      branchesCount,
      vehicles,
      quotes,
      subscribers,
      branches,
      users,
      statusGroups,
      typeGroups,
      brandGroups,
      settings
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: { in: ["DISPONIBLE", "USADO", "NUEVO"] } } }),
      prisma.vehicle.count({ where: { status: "VENDIDO" } }),
      prisma.vehicle.count({ where: { status: "RESERVADO" } }),
      prisma.quoteRequest.count(),
      prisma.newsletterSubscriber.count(),
      prisma.branch.count(),
      prisma.vehicle.findMany({
        take: 12,
        orderBy: { updatedAt: "desc" },
        include: { images: { orderBy: { position: "asc" }, take: 1 }, branch: true }
      }),
      prisma.quoteRequest.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { vehicle: { select: { brand: true, model: true, year: true, slug: true } } }
      }),
      prisma.newsletterSubscriber.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
      prisma.branch.findMany({ include: { _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } }),
      prisma.user.findMany({ take: 20, orderBy: { createdAt: "desc" }, include: { role: true } }),
      prisma.vehicle.groupBy({ by: ["status"], _count: { status: true }, orderBy: { status: "asc" } }),
      prisma.vehicle.groupBy({ by: ["type"], _count: { type: true }, orderBy: { type: "asc" } }),
      prisma.vehicle.groupBy({ by: ["brand"], _count: { brand: true }, orderBy: { _count: { brand: "desc" } }, take: 8 }),
      getSiteSettings()
    ]);

    const totalInventoryValue = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.manualPriceGtq ?? vehicle.priceGtq), 0);
    const averagePrice = totalInventoryValue / Math.max(vehicles.length, 1);

    return {
      ok: true,
      totals: {
        totalVehicles,
        activeVehicles,
        soldVehicles,
        reservedVehicles,
        quotesCount,
        newsletterCount,
        branchesCount,
        averagePrice
      },
      vehicles,
      quotes,
      subscribers,
      branches,
      users,
      statusGroups,
      typeGroups,
      brandGroups,
      settings
    };
  } catch {
    return {
      ok: false,
      totals: {
        totalVehicles: 0,
        activeVehicles: 0,
        soldVehicles: 0,
        reservedVehicles: 0,
        quotesCount: 0,
        newsletterCount: 0,
        branchesCount: 0,
        averagePrice: 0
      },
      vehicles: [],
      quotes: [],
      subscribers: [],
      branches: [],
      users: [],
      statusGroups: [],
      typeGroups: [],
      brandGroups: [],
      settings: await getSiteSettings()
    };
  }
}

function StatBox({ label, value, detail, Icon, tone }: { label: string; value: string | number; detail: string; Icon: LucideIcon; tone: string }) {
  return (
    <div className="overflow-hidden rounded-md border bg-white shadow-sm">
      <div className="flex">
        <div className={`flex w-20 items-center justify-center ${tone} text-white`}>
          <Icon size={30} />
        </div>
        <div className="min-w-0 flex-1 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-black text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ data }: { data: AdminData }) {
  const nav = [
    ["Dashboard", "#dashboard", LayoutDashboard],
    ["Inventario", "#inventario", Car],
    ["Agregar vehiculo", "#nuevo-vehiculo", ClipboardList],
    ["Cotizaciones", "#cotizaciones", Inbox],
    ["Newsletter", "#newsletter", Mail],
    ["Sucursales", "#sucursales", Building2],
    ["Usuarios", "#usuarios", UserPlus],
    ["Ajustes", "#ajustes", Settings]
  ] satisfies [string, string, LucideIcon][];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-800 bg-[#343a40] text-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <Image src="/brand/logo-icon.png" alt="Lemanza" width={38} height={38} className="rounded bg-white object-cover" />
          <div>
            <p className="font-black leading-tight">Lemanza Admin</p>
            <p className="text-xs text-white/60">Panel de control</p>
          </div>
        </div>
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-sm font-semibold">Administrador</p>
          <p className="text-xs text-emerald-300">Conectado con Basic Auth</p>
        </div>
        <nav className="grid gap-1 p-3">
          {nav.map(([label, href, Icon]) => (
            <a key={href} href={href} className="flex items-center gap-3 rounded px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
              <Icon size={18} />
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Administracion del sitio</p>
            <h1 className="text-xl font-black">Dashboard Lemanza Motores</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline"><Link href="/" target="_blank">Ver sitio</Link></Button>
            <Button asChild size="sm"><Link href="/catalogo" target="_blank">Catalogo</Link></Button>
          </div>
        </header>

        <main id="dashboard" className="grid gap-6 p-4 lg:p-6">
          {!data.ok && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              No se pudo leer la base de datos. Revisa DATABASE_URL y Prisma antes de administrar contenido.
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatBox label="Vehiculos" value={data.totals.totalVehicles} detail={`${data.totals.activeVehicles} activos en catalogo`} Icon={Car} tone="bg-[#17a2b8]" />
            <StatBox label="Cotizaciones" value={data.totals.quotesCount} detail="Solicitudes recibidas" Icon={Inbox} tone="bg-[#28a745]" />
            <StatBox label="Reservados" value={data.totals.reservedVehicles} detail={`${percent(data.totals.reservedVehicles, data.totals.totalVehicles)}% del inventario`} Icon={Tags} tone="bg-[#ffc107]" />
            <StatBox label="Precio promedio" value={formatGtq(data.totals.averagePrice)} detail="Ultimas unidades revisadas" Icon={CircleDollarSign} tone="bg-[#dc3545]" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-md border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <h2 className="font-black">Resumen operativo</h2>
                  <p className="text-sm text-slate-500">Estado general del inventario y actividad comercial</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800"><ShieldCheck size={14} /> Protegido</Badge>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-3">
                <div className="rounded bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Vendidos</p>
                  <p className="text-3xl font-black">{data.totals.soldVehicles}</p>
                  <div className="mt-3 h-2 rounded bg-slate-200"><div className="h-2 rounded bg-slate-700" style={{ width: `${percent(data.totals.soldVehicles, data.totals.totalVehicles)}%` }} /></div>
                </div>
                <div className="rounded bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Newsletter</p>
                  <p className="text-3xl font-black">{data.totals.newsletterCount}</p>
                  <p className="mt-3 text-xs text-slate-500">Contactos para campanas y seguimiento.</p>
                </div>
                <div className="rounded bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Sucursales</p>
                  <p className="text-3xl font-black">{data.totals.branchesCount}</p>
                  <p className="mt-3 text-xs text-slate-500">Puntos de venta configurados.</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-black">Distribucion</h2>
                <p className="text-sm text-slate-500">Por estado y tipo</p>
              </div>
              <div className="grid gap-3 p-5">
                {data.statusGroups.map((item) => (
                  <div key={item.status}>
                    <div className="mb-1 flex justify-between text-xs font-bold"><span>{item.status}</span><span>{item._count.status}</span></div>
                    <div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-[#007bff]" style={{ width: `${percent(item._count.status, data.totals.totalVehicles)}%` }} /></div>
                  </div>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {data.typeGroups.slice(0, 6).map((item) => (
                    <div key={item.type} className="rounded bg-slate-50 px-3 py-2 text-xs font-bold">
                      {item.type}: {item._count.type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="inventario" className="rounded-md border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
              <div>
                <h2 className="font-black">Inventario administrable</h2>
                <p className="text-sm text-slate-500">Actualiza estado, precio, datos completos o elimina unidades del catalogo</p>
              </div>
              <Button asChild size="sm"><a href="#nuevo-vehiculo"><ClipboardList size={16} /> Agregar manual</a></Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Vehiculo</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Precio</th>
                    <th className="px-5 py-3">Ubicacion</th>
                    <th className="px-5 py-3">Actualizado</th>
                    <th className="px-5 py-3">Administrar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="align-middle">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 overflow-hidden rounded bg-slate-100">
                            <Image src={vehicle.images[0]?.url || "/brand/logo.jpeg"} alt={vehicle.model} fill className="object-cover" />
                          </div>
                          <div>
                            <Link href={`/catalogo/${vehicle.slug}`} target="_blank" className="font-black hover:text-primary">{vehicle.brand} {vehicle.model} {vehicle.year}</Link>
                            <p className="text-xs text-slate-500">{vehicle.internalCode} · {vehicle.mileage.toLocaleString("es-GT")} km</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Badge className={statusTone[vehicle.status] || "bg-slate-100"}>{vehicle.status}</Badge></td>
                      <td className="px-5 py-3 font-black">{formatGtq(vehicle.manualPriceGtq ?? vehicle.priceGtq)}</td>
                      <td className="px-5 py-3">{vehicle.branch.name}</td>
                      <td className="px-5 py-3 text-xs text-slate-500">{shortDate(vehicle.updatedAt)}</td>
                      <td className="px-5 py-3"><AdminVehicleActions id={vehicle.id} status={vehicle.status} priceGtq={Number(vehicle.manualPriceGtq ?? vehicle.priceGtq)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="nuevo-vehiculo" className="rounded-md border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-black">Agregar vehiculo manualmente</h2>
              <p className="text-sm text-slate-500">Crea una unidad con todos los campos actuales y publicala directamente en el catalogo.</p>
            </div>
            <div className="p-5">
              <AdminVehicleCreateForm branches={data.branches.map((branch) => ({ id: branch.id, name: branch.name }))} />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div id="cotizaciones" className="rounded-md border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-black">Cotizaciones recientes</h2>
                <p className="text-sm text-slate-500">Contactos entrantes desde formularios</p>
              </div>
              <div className="divide-y">
                {data.quotes.map((quote) => (
                  <div key={quote.id} className="grid gap-1 px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black">{quote.firstName} {quote.lastName}</p>
                      <span className="text-xs text-slate-500">{shortDate(quote.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{quote.phone} · {quote.email}</p>
                    <p className="text-sm font-semibold text-slate-800">{quote.vehicle ? `${quote.vehicle.brand} ${quote.vehicle.model} ${quote.vehicle.year}` : "Consulta general"}</p>
                    {quote.message && <p className="text-sm text-slate-500">{quote.message}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div id="newsletter" className="rounded-md border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-black">Newsletter</h2>
                <p className="text-sm text-slate-500">Ultimos suscriptores registrados</p>
              </div>
              <div className="divide-y">
                {data.subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <p className="font-black">{subscriber.name}</p>
                      <p className="text-sm text-slate-500">{subscriber.email}</p>
                    </div>
                    <Badge className={subscriber.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"}>{subscriber.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div id="sucursales" className="rounded-md border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-black">Sucursales</h2>
                <p className="text-sm text-slate-500">Crea, edita y elimina ubicaciones del sitio.</p>
              </div>
              <div className="p-5">
                <AdminBranchManager branches={data.branches} />
              </div>
            </div>

            <div id="usuarios" className="rounded-md border bg-white shadow-sm">
              <div className="border-b px-5 py-4">
                <h2 className="font-black">Trabajadores y accesos</h2>
                <p className="text-sm text-slate-500">Registra usuarios internos y asigna el acceso definido por el administrador.</p>
              </div>
              <div className="grid gap-5 p-5">
                <AdminUserCreateForm />
                <div className="overflow-x-auto rounded border">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Usuario</th>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Creado</th>
                        <th className="px-4 py-3">Acceso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3"><strong>{user.name}</strong><p className="text-xs text-slate-500">{user.email}</p></td>
                          <td className="px-4 py-3"><Badge>{user.role.name}</Badge></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{shortDate(user.createdAt)}</td>
                          <td className="px-4 py-3"><AdminUserActions id={user.id} role={user.role.name} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section id="ajustes" className="rounded-md border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-black">Ajustes</h2>
              <p className="text-sm text-slate-500">Contenido publico, herramientas operativas, integraciones y accesos del sitio.</p>
            </div>
            <div className="grid gap-6 p-5">
              <AdminSettingsForm settings={data.settings} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <AdminSyncButton />
                <Link href="/catalogo" target="_blank" className="rounded border p-4 transition hover:border-primary hover:bg-slate-50">
                  <Car className="text-primary" />
                  <p className="mt-3 font-black">Revisar catalogo publico</p>
                  <p className="mt-1 text-sm text-slate-500">Abre el inventario como lo ve el cliente.</p>
                </Link>
                <a href="/api/admin/vehicles" target="_blank" className="rounded border p-4 transition hover:border-primary hover:bg-slate-50">
                  <Gauge className="text-primary" />
                  <p className="mt-3 font-black">Exportar JSON</p>
                  <p className="mt-1 text-sm text-slate-500">Consulta rapida de unidades y metadatos.</p>
                </a>
                <a href="/api/admin/users" target="_blank" className="rounded border p-4 transition hover:border-primary hover:bg-slate-50">
                  <Users className="text-primary" />
                  <p className="mt-3 font-black">Usuarios JSON</p>
                  <p className="mt-1 text-sm text-slate-500">Consulta interna de usuarios registrados.</p>
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-primary" />
              <div>
                <h2 className="font-black">Marcas principales</h2>
                <p className="text-sm text-slate-500">Distribucion de las marcas con mayor inventario</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.brandGroups.map((item) => (
                <div key={item.brand} className="rounded bg-slate-50 p-4">
                  <div className="flex justify-between gap-3 text-sm font-black"><span>{item.brand}</span><span>{item._count.brand}</span></div>
                  <div className="mt-3 h-2 rounded bg-slate-200"><div className="h-2 rounded bg-[#17a2b8]" style={{ width: `${percent(item._count.brand, data.totals.totalVehicles)}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const data = await getAdminData();
  return <AdminShell data={data} />;
}
