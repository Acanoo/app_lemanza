import { cn } from "@/lib/utils";

const variants = {
  card: "left-[6%] top-[38%] h-[18%] w-[28%] rotate-[7deg] rounded-sm",
  gallery: "left-[6%] top-[40%] h-[16%] w-[26%] rotate-[7deg] rounded-md",
  thumbnail: "left-[6%] top-[40%] h-[18%] w-[30%] rotate-[7deg] rounded-[3px]"
};

export function VehiclePlateMask({ variant = "card" }: { variant?: keyof typeof variants }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 bg-white/45 shadow-sm backdrop-blur-xl backdrop-saturate-0",
        variants[variant]
      )}
    />
  );
}
