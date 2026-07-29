import { createContext, useContext, type ReactNode } from "react";
import {
  categories as staticCategories,
  allergenKey as staticAllergenKey,
  menuItems as staticMenuItems,
  restaurant as staticRestaurant,
  reviews as staticReviews,
  type MenuItem,
  type Category,
} from "./menu-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Restaurant = typeof staticRestaurant;
export type Review = (typeof staticReviews)[number];
export type AllergenKey = typeof staticAllergenKey;

export interface MenuData {
  menuItems: MenuItem[];
  categories: Category[];
  restaurant: Restaurant;
  reviews: Review[];
  allergenKey: AllergenKey;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const defaultData: MenuData = {
  menuItems: staticMenuItems,
  categories: staticCategories,
  restaurant: staticRestaurant,
  reviews: staticReviews,
  allergenKey: staticAllergenKey,
};

const MenuContext = createContext<MenuData>(defaultData);

export function MenuDataProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: MenuData;
}) {
  return <MenuContext.Provider value={data}>{children}</MenuContext.Provider>;
}

export function useMenuData(): MenuData {
  return useContext(MenuContext);
}
