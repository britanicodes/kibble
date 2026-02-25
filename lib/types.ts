export type Species = 'cat' | 'dog';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type WeightGoal = 'lose' | 'maintain' | 'gain';
export type FoodType = 'dry' | 'wet' | 'raw' | 'treat';
export type LifeStage = 'puppy' | 'kitten' | 'adult' | 'senior';
export type FoodDataSource = 'seed' | 'community' | 'admin' | 'external';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  weight_kg: number;
  age_years: number;
  activity_level: ActivityLevel;
  is_neutered: boolean;
  life_stage: LifeStage;
  goal: WeightGoal;
  target_weight_kg: number | null;
  created_at: string;
}

export interface Food {
  id: string;
  barcode?: string | null;
  brand: string;
  product_name: string;
  food_type: FoodType;
  species: Species | 'both';
  calories_per_serving: number;
  serving_size_g: number;
  serving_unit: string;
  protein_pct: number;
  fat_pct: number;
  fiber_pct: number;
  moisture_pct: number;
  kcal_per_kg?: number | null;
  kcal_per_cup?: number | null;
  kcal_per_can?: number | null;
  can_size_g?: number | null;
  package_size_g?: number | null;
  aafco_statement?: string | null;
  source?: FoodDataSource;
  moderation_status?: ModerationStatus;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
}

export interface FeedingLogEntry {
  id: string;
  pet_id: string;
  food_id: string;
  servings: number;
  calories: number;
  logged_at: string;
}

export interface FeedingAmount {
  amount: number;
  unit: string;
}

export interface FoodSubmission {
  id: string;
  submitted_by: string;
  barcode: string | null;
  brand: string;
  product_name: string;
  species: Species | 'both';
  food_type: FoodType;
  calories_per_serving: number | null;
  serving_size_g: number | null;
  serving_unit: string | null;
  protein_pct: number | null;
  fat_pct: number | null;
  fiber_pct: number | null;
  moisture_pct: number | null;
  notes: string | null;
  label_photo_url: string | null;
  nutrition_photo_url: string | null;
  status: ModerationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  linked_food_id: string | null;
  created_at: string;
}
