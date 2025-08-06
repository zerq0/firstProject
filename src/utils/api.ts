export interface Product {
  name: string;
  nutriments: {
    carbohydrates_100g: number;
  };
}

/**
 * Ищет продукты по русскоязычному названию на ru.openfoodfacts.org
 */
export async function fetchProductByName(query: string): Promise<Product[]> {
  const url =
    `https://ru.openfoodfacts.org/cgi/search.pl` +
    `?search_terms=${encodeURIComponent(query)}` +
    `&search_simple=1&action=process&json=1&lc=ru`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Не удалось запросить OpenFoodFacts");
  }
  const data = await res.json();
  return (data.products || []).map((p: any) => ({
    name: p.product_name || p.name || "—",
    nutriments: {
      carbohydrates_100g: Number(p.nutriments?.carbohydrates_100g) || 0,
    },
  }));
}
