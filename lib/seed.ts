import { Food } from './types';

function makeId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = new Date().toISOString();

export const seedFoods: Food[] = [
  // ── Dog Dry Food ──
  {
    id: makeId(), brand: 'Purina Pro Plan', product_name: 'Adult Chicken & Rice',
    barcode: '017800123451',
    food_type: 'dry', species: 'dog', calories_per_serving: 378, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 26, fat_pct: 16, fiber_pct: 3, moisture_pct: 12, created_at: now,
  },
  {
    id: makeId(), brand: 'Hill\'s Science Diet', product_name: 'Adult Perfect Weight',
    barcode: '052742111112',
    food_type: 'dry', species: 'dog', calories_per_serving: 291, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 25, fat_pct: 9, fiber_pct: 12, moisture_pct: 10, created_at: now,
  },
  {
    id: makeId(), brand: 'Royal Canin', product_name: 'Medium Adult',
    barcode: '030111222233',
    food_type: 'dry', species: 'dog', calories_per_serving: 355, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 23, fat_pct: 14, fiber_pct: 3.2, moisture_pct: 10, created_at: now,
  },
  {
    id: makeId(), brand: 'Blue Buffalo', product_name: 'Life Protection Chicken & Brown Rice',
    barcode: '840243333344',
    food_type: 'dry', species: 'dog', calories_per_serving: 357, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 24, fat_pct: 14, fiber_pct: 5, moisture_pct: 10, created_at: now,
  },
  {
    id: makeId(), brand: 'Wellness', product_name: 'Complete Health Adult Deboned Chicken',
    food_type: 'dry', species: 'dog', calories_per_serving: 360, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 24, fat_pct: 12, fiber_pct: 4, moisture_pct: 10, created_at: now,
  },
  // ── Dog Wet Food ──
  {
    id: makeId(), brand: 'Purina Pro Plan', product_name: 'Adult Chicken & Vegetable Entree',
    food_type: 'wet', species: 'dog', calories_per_serving: 95, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 10, fat_pct: 5, fiber_pct: 1.5, moisture_pct: 78, created_at: now,
  },
  {
    id: makeId(), brand: 'Hill\'s Science Diet', product_name: 'Adult Savory Stew Chicken',
    food_type: 'wet', species: 'dog', calories_per_serving: 83, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 5, fat_pct: 3, fiber_pct: 1, moisture_pct: 82, created_at: now,
  },
  {
    id: makeId(), brand: 'Royal Canin', product_name: 'Adult Loaf in Sauce',
    food_type: 'wet', species: 'dog', calories_per_serving: 100, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 7, fat_pct: 5, fiber_pct: 1.5, moisture_pct: 80, created_at: now,
  },
  // ── Dog Treats ──
  {
    id: makeId(), brand: 'Milk-Bone', product_name: 'Original Biscuits Medium',
    food_type: 'treat', species: 'dog', calories_per_serving: 40, serving_size_g: 12,
    serving_unit: 'g', protein_pct: 20, fat_pct: 8, fiber_pct: 3, moisture_pct: 12, created_at: now,
  },
  {
    id: makeId(), brand: 'Greenies', product_name: 'Original Dental Treats Regular',
    food_type: 'treat', species: 'dog', calories_per_serving: 90, serving_size_g: 27,
    serving_unit: 'g', protein_pct: 30, fat_pct: 5, fiber_pct: 16, moisture_pct: 15, created_at: now,
  },
  {
    id: makeId(), brand: 'Blue Buffalo', product_name: 'Blue Bits Chicken Training Treats',
    food_type: 'treat', species: 'dog', calories_per_serving: 5, serving_size_g: 2,
    serving_unit: 'g', protein_pct: 20, fat_pct: 10, fiber_pct: 4, moisture_pct: 24, created_at: now,
  },
  // ── Cat Dry Food ──
  {
    id: makeId(), brand: 'Purina Pro Plan', product_name: 'Adult Chicken & Rice',
    food_type: 'dry', species: 'cat', calories_per_serving: 398, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 36, fat_pct: 16, fiber_pct: 2.5, moisture_pct: 12, created_at: now,
  },
  {
    id: makeId(), brand: 'Hill\'s Science Diet', product_name: 'Adult Indoor Chicken Recipe',
    food_type: 'dry', species: 'cat', calories_per_serving: 362, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 31, fat_pct: 12, fiber_pct: 7, moisture_pct: 8, created_at: now,
  },
  {
    id: makeId(), brand: 'Royal Canin', product_name: 'Indoor Adult',
    food_type: 'dry', species: 'cat', calories_per_serving: 358, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 27, fat_pct: 13, fiber_pct: 5.1, moisture_pct: 8, created_at: now,
  },
  {
    id: makeId(), brand: 'Blue Buffalo', product_name: 'Tastefuls Indoor Chicken',
    food_type: 'dry', species: 'cat', calories_per_serving: 370, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 32, fat_pct: 15, fiber_pct: 5, moisture_pct: 9, created_at: now,
  },
  {
    id: makeId(), brand: 'Wellness', product_name: 'Complete Health Indoor Deboned Chicken',
    food_type: 'dry', species: 'cat', calories_per_serving: 368, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 32, fat_pct: 12, fiber_pct: 5, moisture_pct: 10, created_at: now,
  },
  // ── Cat Wet Food ──
  {
    id: makeId(), brand: 'Purina Fancy Feast', product_name: 'Classic Pate Chicken',
    barcode: '050000444455',
    food_type: 'wet', species: 'cat', calories_per_serving: 90, serving_size_g: 85,
    serving_unit: 'g', protein_pct: 11, fat_pct: 4, fiber_pct: 1.5, moisture_pct: 78, created_at: now,
  },
  {
    id: makeId(), brand: 'Hill\'s Science Diet', product_name: 'Adult Tender Chicken Dinner',
    food_type: 'wet', species: 'cat', calories_per_serving: 72, serving_size_g: 79,
    serving_unit: 'g', protein_pct: 8, fat_pct: 3.5, fiber_pct: 1, moisture_pct: 80, created_at: now,
  },
  {
    id: makeId(), brand: 'Royal Canin', product_name: 'Adult Instinctive Loaf',
    food_type: 'wet', species: 'cat', calories_per_serving: 85, serving_size_g: 85,
    serving_unit: 'g', protein_pct: 9, fat_pct: 4, fiber_pct: 1.2, moisture_pct: 80, created_at: now,
  },
  {
    id: makeId(), brand: 'Wellness', product_name: 'Complete Health Chicken Pate',
    food_type: 'wet', species: 'cat', calories_per_serving: 108, serving_size_g: 85,
    serving_unit: 'g', protein_pct: 10, fat_pct: 7, fiber_pct: 1, moisture_pct: 78, created_at: now,
  },
  // ── Cat Treats ──
  {
    id: makeId(), brand: 'Temptations', product_name: 'Classic Chicken Flavor',
    barcode: '022000555566',
    food_type: 'treat', species: 'cat', calories_per_serving: 2, serving_size_g: 1,
    serving_unit: 'g', protein_pct: 30, fat_pct: 17, fiber_pct: 1.5, moisture_pct: 15, created_at: now,
  },
  {
    id: makeId(), brand: 'Greenies', product_name: 'Feline Dental Treats Chicken',
    food_type: 'treat', species: 'cat', calories_per_serving: 12, serving_size_g: 5,
    serving_unit: 'g', protein_pct: 32, fat_pct: 10, fiber_pct: 5, moisture_pct: 12, created_at: now,
  },
  {
    id: makeId(), brand: 'Churu', product_name: 'Chicken Puree Lickable Treat',
    food_type: 'treat', species: 'cat', calories_per_serving: 6, serving_size_g: 14,
    serving_unit: 'g', protein_pct: 7, fat_pct: 0.1, fiber_pct: 0.5, moisture_pct: 91, created_at: now,
  },
  // ── Both species ──
  {
    id: makeId(), brand: 'Stella & Chewy\'s', product_name: 'Freeze-Dried Raw Chicken Dinner Patties',
    food_type: 'raw', species: 'dog', calories_per_serving: 435, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 42, fat_pct: 25, fiber_pct: 4, moisture_pct: 5, created_at: now,
  },
  {
    id: makeId(), brand: 'Stella & Chewy\'s', product_name: 'Freeze-Dried Raw Chicken Dinner Morsels',
    food_type: 'raw', species: 'cat', calories_per_serving: 445, serving_size_g: 100,
    serving_unit: 'g', protein_pct: 45, fat_pct: 25, fiber_pct: 3, moisture_pct: 5, created_at: now,
  },
];
