import { create } from "zustand";

type CatalogState = {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
};

export const useCatalogStore = create<CatalogState>((set) => ({
  mobileFiltersOpen: false,
  setMobileFiltersOpen: (mobileFiltersOpen) => set({ mobileFiltersOpen })
}));
