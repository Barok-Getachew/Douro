import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import {
  categories,
  allergenKey,
  restaurant as staticRestaurant,
  reviews as staticReviews,
  menuItems as staticMenuItems,
  type MenuItem,
  type Tag,
} from "./menu-data";

// ─── Supabase helpers ────────────────────────────────────────────────────────

function getDb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAdminDb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

function getSessionToken(): string {
  const pwd = process.env.ADMIN_PASSWORD ?? "changeme";
  return Buffer.from(`douro-admin:${pwd}`).toString("base64url");
}

function validateToken(token: string): void {
  if (token !== getSessionToken()) throw new Error("Unauthorized");
}

// ─── Type transforms ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMenuItem(row: Record<string, any>): MenuItem {
  return {
    id: String(row.id),
    category: String(row.category),
    price: Number(row.price),
    image: row.image ?? undefined,
    allergens: (row.allergens as string[]) ?? [],
    tags: (row.tags as Tag[]) ?? [],
    popular: Boolean(row.popular),
    available: row.available === null || row.available === undefined ? true : Boolean(row.available),
    name: { en: row.name_en, de: row.name_de, pt: row.name_pt },
    desc: { en: row.desc_en, de: row.desc_de, pt: row.desc_pt },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRestaurant(row: Record<string, any>) {
  return {
    name: row.name ?? staticRestaurant.name,
    tagline: {
      en: row.tagline_en ?? staticRestaurant.tagline.en,
      de: row.tagline_de ?? staticRestaurant.tagline.de,
      pt: row.tagline_pt ?? staticRestaurant.tagline.pt,
    },
    street: row.street ?? staticRestaurant.street,
    city: row.city ?? staticRestaurant.city,
    phone: row.phone ?? staticRestaurant.phone,
    phoneHref: row.phone_href ?? staticRestaurant.phoneHref,
    whatsapp: row.whatsapp ?? staticRestaurant.whatsapp,
    email: row.email ?? staticRestaurant.email,
    maps: row.maps ?? staticRestaurant.maps,
    googleReview: row.google_review ?? staticRestaurant.googleReview,
    instagram: row.instagram ?? staticRestaurant.instagram,
    facebook: row.facebook ?? staticRestaurant.facebook,
    tripadvisor: row.tripadvisor ?? staticRestaurant.tripadvisor,
    order: row.order_url ?? staticRestaurant.order,
    rating: Number(row.rating ?? staticRestaurant.rating),
    reviewCount: Number(row.review_count ?? staticRestaurant.reviewCount),
    hours: {
      en: row.hours_en ?? staticRestaurant.hours.en,
      de: row.hours_de ?? staticRestaurant.hours.de,
      pt: row.hours_pt ?? staticRestaurant.hours.pt,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(row: Record<string, any>) {
  return {
    quote: { en: row.quote_en, de: row.quote_de, pt: row.quote_pt },
    author: row.author,
    source: row.source,
  };
}

// ─── Public server functions ──────────────────────────────────────────────────

/** Fetch all menu data. Falls back to static data if Supabase is not configured. */
export const getMenuDataFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseConfigured()) {
    return {
      menuItems: staticMenuItems,
      restaurant: staticRestaurant,
      reviews: staticReviews,
      categories,
      allergenKey,
    };
  }
  try {
    const db = getDb();
    const [itemsRes, restaurantRes, reviewsRes] = await Promise.all([
      db.from("menu_items").select("*").order("sort_order"),
      db.from("restaurant").select("*").eq("id", 1).single(),
      db.from("reviews").select("*").order("sort_order"),
    ]);

    const liveItems = itemsRes.data?.map(rowToMenuItem) ?? staticMenuItems;
    const liveRestaurant = restaurantRes.data ? rowToRestaurant(restaurantRes.data) : staticRestaurant;
    const liveReviews = reviewsRes.data?.map(rowToReview) ?? staticReviews;

    return {
      menuItems: liveItems,
      restaurant: liveRestaurant,
      reviews: liveReviews,
      categories,
      allergenKey,
    };
  } catch {
    return {
      menuItems: staticMenuItems,
      restaurant: staticRestaurant,
      reviews: staticReviews,
      categories,
      allergenKey,
    };
  }
});

// ─── Auth server functions ────────────────────────────────────────────────────

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(({ data }) => {
    if (!process.env.ADMIN_PASSWORD || data.password !== process.env.ADMIN_PASSWORD) {
      throw new Error("Invalid password");
    }
    return { token: getSessionToken() };
  });

export const checkAuthFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(({ data }) => {
    return { authenticated: isSupabaseConfigured() && data.token === getSessionToken() };
  });

// ─── Admin CRUD server functions ──────────────────────────────────────────────

export const upsertMenuItemFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; item: MenuItem; sortOrder?: number }) => data)
  .handler(async ({ data }) => {
    validateToken(data.token);
    const db = getAdminDb();
    const { item, sortOrder = 0 } = data;
    const row = {
      id: item.id,
      category: item.category,
      price: item.price,
      image: item.image ?? null,
      allergens: item.allergens,
      tags: item.tags,
      popular: item.popular ?? false,
      available: item.available ?? true,
      name_en: item.name.en,
      name_de: item.name.de,
      name_pt: item.name.pt,
      desc_en: item.desc.en,
      desc_de: item.desc.de,
      desc_pt: item.desc.pt,
      sort_order: sortOrder,
    };
    const { error } = await db.from("menu_items").upsert(row, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMenuItemFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    validateToken(data.token);
    const db = getAdminDb();
    const { error } = await db.from("menu_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateRestaurantFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      restaurant: ReturnType<typeof rowToRestaurant>;
    }) => data,
  )
  .handler(async ({ data }) => {
    validateToken(data.token);
    const db = getAdminDb();
    const r = data.restaurant;
    const row = {
      id: 1,
      name: r.name,
      tagline_en: r.tagline.en,
      tagline_de: r.tagline.de,
      tagline_pt: r.tagline.pt,
      street: r.street,
      city: r.city,
      phone: r.phone,
      phone_href: r.phoneHref,
      whatsapp: r.whatsapp,
      email: r.email,
      maps: r.maps,
      google_review: r.googleReview,
      instagram: r.instagram,
      facebook: r.facebook,
      tripadvisor: r.tripadvisor,
      order_url: r.order,
      rating: r.rating,
      review_count: r.reviewCount,
      hours_en: r.hours.en,
      hours_de: r.hours.de,
      hours_pt: r.hours.pt,
    };
    const { error } = await db.from("restaurant").upsert(row, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadMenuImageFn = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; base64: string; filename: string; mimeType: string }) => data,
  )
  .handler(async ({ data }) => {
    validateToken(data.token);
    const db = getAdminDb();
    const buffer = Buffer.from(data.base64, "base64");
    const ext = data.filename.split(".").pop() ?? "webp";
    const storagePath = `menu/${Date.now()}.${ext}`;
    const { error } = await db.storage
      .from("menu-images")
      .upload(storagePath, buffer, {
        contentType: data.mimeType,
        upsert: true,
      });
    if (error) throw new Error(error.message);
    const { data: urlData } = db.storage.from("menu-images").getPublicUrl(storagePath);
    return { url: urlData.publicUrl };
  });

// ─── Public review submission ─────────────────────────────────────────────────

/** Submit a customer review. Saved to the reviews table with pending status. */
export const submitReviewFn = createServerFn({ method: "POST" })
  .validator(
    (data: { author: string; rating: number; comment: string }) => data,
  )
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      // In dev/static mode just return success — no DB to write to
      return { ok: true };
    }
    const db = getAdminDb();
    const row = {
      quote_en: data.comment,
      quote_de: data.comment,
      quote_pt: data.comment,
      author: data.author,
      source: "In-App",
      rating: data.rating,
      pending: true,
      sort_order: 9999,
    };
    const { error } = await db.from("reviews").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
