import { Pet, Food, FeedingAmount } from './types';

/**
 * Resting Energy Requirement (RER) in kcal/day
 * Standard veterinary formula: 70 × (weight_kg)^0.75
 */
export function calculateRER(weight_kg: number): number {
  return 70 * Math.pow(weight_kg, 0.75);
}

/**
 * Get the DER multiplier based on pet attributes.
 */
function getDERFactor(pet: Pet): number {
  const { species, life_stage, goal, is_neutered } = pet;

  if (species === 'cat') {
    if (life_stage === 'kitten') return 2.5;
    if (goal === 'lose') return 0.8;
    if (goal === 'gain') return 1.3;
    if (is_neutered) return 1.0;
    return 1.2; // intact adult maintain
  }

  // dog
  if (life_stage === 'puppy') return 2.5;
  if (goal === 'lose') return 1.0;
  if (goal === 'gain') return 1.9;
  if (is_neutered) return 1.6;
  return 1.8; // intact adult maintain
}

/**
 * Daily Energy Requirement (DER) in kcal/day = RER × factor
 */
export function calculateDailyCalories(pet: Pet): number {
  const rer = calculateRER(pet.weight_kg);
  const factor = getDERFactor(pet);
  return Math.round(rer * factor);
}

/**
 * How much of a given food to feed per day to hit target calories.
 * Returns amount in the food's serving unit.
 */
export function calculateFeedingAmount(
  dailyCalories: number,
  food: Food
): FeedingAmount {
  if (food.calories_per_serving <= 0) {
    return { amount: 0, unit: food.serving_unit };
  }
  const servingsNeeded = dailyCalories / food.calories_per_serving;
  const amount = Math.round(servingsNeeded * food.serving_size_g);
  return { amount, unit: 'g' };
}
