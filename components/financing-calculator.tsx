"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateFinancing } from "@/lib/financing";
import { formatGtq } from "@/lib/utils";

export function FinancingCalculator({ price, vehicleId }: { price: number; vehicleId?: string }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [annualRate, setAnnualRate] = useState(12);
  const [termMonths, setTermMonths] = useState(60);
  const result = useMemo(() => calculateFinancing({ price, downPayment, annualRate, termMonths }), [price, downPayment, annualRate, termMonths]);

  async function saveSimulation() {
    await fetch("/api/financing", {
      method: "POST",
      body: JSON.stringify({ priceGtq: price, downPayment, annualRate, termMonths, monthlyFee: result.monthlyFee, vehicleId })
    });
  }

  return (
    <div id="cuotas" className="rounded-lg border bg-white p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-xl font-black"><Calculator size={20} /> Calculadora de cuotas</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><Label>Precio del vehículo</Label><Input type="number" value={price} readOnly /></div>
        <div><Label>Enganche sugerido 20%</Label><Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} /></div>
        <div><Label>Tasa anual</Label><Input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} /></div>
        <div>
          <Label>Plazo</Label>
          <select className="h-11 w-full rounded-md border px-3" value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))}>
            {[12, 24, 36, 48, 60].map((term) => <option key={term} value={term}>{term} meses</option>)}
          </select>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md bg-secondary p-4">
        <div>
          <p className="text-sm text-muted-foreground">Cuota mensual estimada</p>
          <p className="text-3xl font-black text-primary">{formatGtq(result.monthlyFee)}</p>
        </div>
        <Button variant="accent" onClick={saveSimulation}>Guardar simulación</Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">No incluye seguro ni gastos de escrituración. Es una estimación.</p>
      <div className="mt-5 max-h-80 overflow-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-primary text-white">
            <tr><th className="p-2 text-left">No.</th><th className="p-2 text-left">Cuota</th><th className="p-2 text-left">Interés</th><th className="p-2 text-left">Capital</th><th className="p-2 text-left">Saldo</th></tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.number} className="border-t">
                <td className="p-2">{row.number}</td>
                <td className="p-2">{formatGtq(row.payment)}</td>
                <td className="p-2">{formatGtq(row.interest)}</td>
                <td className="p-2">{formatGtq(row.capital)}</td>
                <td className="p-2">{formatGtq(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
