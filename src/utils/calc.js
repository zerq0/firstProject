/**
 * @param {number} weight    — вес порции в граммах
 * @param {number} carbs100g — углеводы на 100 г
 * @param {number} fiber100g — клетчатка на 100 г
 * @param {number} gramsPerBU — грамм углеводов в 1 ХЕ
 * @returns {number} хлебные единицы, округлённые до 0.5
 */
export function calculateBreadUnits(
    weight,
    carbs100g,
    fiber100g = 0,
    gramsPerBU = 12
  ) {
    const netCarbs = carbs100g - fiber100g;
    const carbsInPortion = (netCarbs * weight) / 100;
    const bu = carbsInPortion / gramsPerBU;
    return Math.round(bu * 2) / 2;
  }
  