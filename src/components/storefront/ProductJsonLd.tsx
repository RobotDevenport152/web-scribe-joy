interface Props {
  product: {
    name_en: string;
    name_zh: string;
    description_en: string | null;
    price_nzd: number;
    stock_quantity: number | null;
    images: { url: string; alt: string }[] | null;
    slug: string;
  };
}

export function ProductJsonLd({ product }: Props) {
  const images = (product.images as { url: string; alt: string }[] | null) || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_en,
    description: product.description_en || '',
    image: images.map(i => i.url),
    brand: { "@type": "Brand", name: "Pacific Alpaca" },
    offers: {
      "@type": "Offer",
      price: product.price_nzd.toString(),
      priceCurrency: "NZD",
      availability: (product.stock_quantity ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Pacific Alpaca" },
      url: `https://pacificalpaca.com/shop/${product.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
