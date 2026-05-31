import { cn } from "@/lib/utils";

const variants = {
  card: "left-[30%] top-[58%] h-[5%] w-[16%] rotate-[7deg] rounded-[2px]",
  gallery: "left-[30%] top-[58%] h-[4.5%] w-[15%] rotate-[7deg] rounded-[2px]",
  thumbnail: "left-[29%] top-[58%] h-[6%] w-[18%] rotate-[7deg] rounded-[2px]"
};

export function VehiclePlateMask({ variant = "card" }: { variant?: keyof typeof variants }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 bg-slate-100/90 shadow-sm ring-1 ring-white/70",
        variants[variant]
      )}
    />
  );
}
