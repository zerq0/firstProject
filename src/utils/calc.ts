// src/utils/calc.ts
/**
 * @param weight — вес порции в граммах
 * @param carbs100g — углеводы на 100 г
 * @param fiber100g — клетчатка на 100 г (необязательный)
 * @param gramsPerBU — сколько грамм чистых углеводов в 1 ХЕ
 */
export function calculateBreadUnits(
  weight: number,
  carbs100g: number,
  fiber100g = 0,
  gramsPerBU = 12
): number {
  const netCarbs = carbs100g - fiber100g;
  const carbsInPortion = (netCarbs * weight) / 100;
  return Math.round((carbsInPortion / gramsPerBU) * 2) / 2; // округление до 0.5
}
