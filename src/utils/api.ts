// src/utils/api.ts
export async function fetchProductByName(name: string) {
  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("search_terms", name);
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Ошибка сети: ${res.statusText}`);
  const data = await res.json();
  if (!data.products?.length) {
    throw new Error("Продукт не найден");
  }
  return data.products[0];
}
