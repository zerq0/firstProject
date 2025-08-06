// utils/api.ts
export async function fetchProductsByName(query: string) {
  const url = `https://ru.openfoodfacts.org/cgi/search.pl` +
    `?search_terms=${encodeURIComponent(query)}` +
    `&search_simple=1&action=process&json=1&lc=ru`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Не удалось найти продукт");
  const data = await res.json();
  return data.products as Array<{
    product_name: string;
    nutriments: { carbohydrates_100g: number };
  }>;
}
