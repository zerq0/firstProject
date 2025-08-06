/**
 * Считает хлебные единицы:
 * 1 ХЕ = 12 г углеводов
 * @param weightGrams — вес порции в граммах
 * @param carbsPer100g — кол-во углеводов на 100 г
 */
export function calculateBreadUnits(
  weightGrams: number,
  carbsPer100g: number
): number {
  return (weightGrams * carbsPer100g) / 100 / 12;
}
