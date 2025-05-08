// src/utils/api.js
/**
 * Ищет продукт по названию и возвращает первый результат
 * @param {string} name — текст для поиска
 * @returns {Promise<Object>} — объект product
 */
export async function fetchProductByName(name) {
  const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
  url.searchParams.set('search_terms', name);
  url.searchParams.set('search_simple', '1');
  url.searchParams.set('action', 'process');
  url.searchParams.set('json', '1');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка сети: ${res.statusText}`);
  const data = await res.json();
  if (!data.products || data.products.length === 0) {
    throw new Error('Продукт с таким именем не найден');
  }
  return data.products[0];
}
