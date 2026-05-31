import { cn } from "@/lib/utils";

const variants = {
  card: "left-[12%] top-[52%] h-[12%] w-[14%] rotate-[8deg] rounded-[2px]",
  gallery: "left-[12%] top-[52%] h-[11%] w-[13%] rotate-[8deg] rounded",
  thumbnail: "left-[12%] top-[52%] h-[12%] w-[14%] rotate-[8deg] rounded-[2px]"
};

export function VehiclePlateMask({ variant = "card" }: { variant?: keyof typeof variants }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 bg-white/70 shadow-sm backdrop-blur-md backdrop-saturate-0",
        variants[variant]
      )}
    />
  );
}
