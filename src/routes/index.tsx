import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/i18n";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { MenuBrowser } from "@/components/site/MenuBrowser";
import { Reviews } from "@/components/site/Reviews";
import { VisitFooter } from "@/components/site/VisitFooter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { MenuDataProvider } from "@/lib/menu-context";
import { getMenuDataFn } from "@/lib/server-fns";
import { restaurant } from "@/lib/menu-data";

const title = "D'ouro Soul Food Salzburg — Digital Menu";
const description =
  "Scan, browse, enjoy: the digital menu of D'ouro Soul Food in Salzburg. Brazilian and West African soul food, tacos, bowls, feijoada, caipirinha. No app required.";

export const Route = createFileRoute("/")({
  loader: () => getMenuDataFn(),
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "D'ouro Soul Food",
          servesCuisine: ["Brazilian", "African", "Latin American"],
          priceRange: "€€",
          telephone: restaurant.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: restaurant.street,
            addressLocality: "Salzburg",
            postalCode: "5020",
            addressCountry: "AT",
          },
          openingHours: "Mo-Sa 11:00-20:00",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: restaurant.rating,
            reviewCount: restaurant.reviewCount,
          },
          sameAs: [restaurant.instagram, restaurant.facebook, restaurant.tripadvisor],
        }),
      },
    ],
  }),
});

function Index() {
  const data = Route.useLoaderData();
  return (
    <LanguageProvider>
      <MenuDataProvider data={data}>
        <main>
          <Hero />
          <Story />
          <MenuBrowser />
          <Reviews />
          <VisitFooter />
        </main>
        <FloatingActions />
      </MenuDataProvider>
    </LanguageProvider>
  );
}
