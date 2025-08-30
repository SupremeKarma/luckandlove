import Script from "next/script";

export default function ProductJsonLd({
  id, name, description, image, price, currency = "USD", availability = "https://schema.org/InStock"
}: {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  currency?: string;
  availability?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${id}`,
    name,
    description: description ?? "",
    image: image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: currency.toUpperCase(),
      price: Number(price).toFixed(2),
      availability,
      url: typeof window === "undefined" ? undefined : window.location.href,
    }
  };
  return (
    <Script id={`ld-product-${id}`} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
