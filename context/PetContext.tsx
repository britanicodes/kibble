import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Food, FeedingLogEntry } from '../lib/types';
import { seedFoods } from '../lib/seed';
import { normalizeBarcode } from '../lib/barcode';
import { fetchApprovedFoods } from '../lib/foodCatalog';

const STORAGE_KEYS = {
  PETS: '@kibble/pets',
  FOODS: '@kibble/foods',
  LOG: '@kibble/feeding_log',
  ACTIVE_PET: '@kibble/active_pet_id',
};

interface PetContextType {
  pets: Pet[];
  foods: Food[];
  feedingLog: FeedingLogEntry[];
  activePetId: string | null;
  activePet: Pet | null;
  isLoading: boolean;
  setActivePetId: (id: string | null) => void;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  addFood: (food: Food) => Promise<void>;
  addLogEntry: (entry: FeedingLogEntry) => Promise<void>;
  deleteLogEntry: (id: string) => Promise<void>;
  getTodayLog: () => FeedingLogEntry[];
  getLogForDate: (dateStr: string) => FeedingLogEntry[];
  getFoodById: (id: string) => Food | undefined;
  getFoodByBarcode: (barcode: string) => Food | undefined;
}

const PetContext = createContext<PetContextType | null>(null);

function isSameFood(a: Food, b: Food): boolean {
  if (a.id === b.id) return true;
  if (!a.barcode || !b.barcode) return false;
  return normalizeBarcode(a.barcode) === normalizeBarcode(b.barcode);
}

function mergeFoods(base: Food[], incoming: Food[]): Food[] {
  const merged = [...base];
  for (const next of incoming) {
    const idx = merged.findIndex((existing) => isSameFood(existing, next));
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...next };
    } else {
      merged.push(next);
    }
  }
  return merged;
}

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [feedingLog, setFeedingLog] = useState<FeedingLogEntry[]>([]);
  const [activePetId, setActivePetIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [petsJson, foodsJson, logJson, activeId] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PETS),
          AsyncStorage.getItem(STORAGE_KEYS.FOODS),
          AsyncStorage.getItem(STORAGE_KEYS.LOG),
          AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PET),
        ]);
        const parsedPets = petsJson ? JSON.parse(petsJson) : [];
        const parsedFoods = foodsJson ? JSON.parse(foodsJson) : seedFoods;
        const parsedLog = logJson ? JSON.parse(logJson) : [];

        setPets(parsedPets);
        setFoods(parsedFoods);
        setActivePetIdState(activeId);

        // Phase 1 scaffold: opportunistically sync approved foods from Supabase.
        const remoteFoods = await fetchApprovedFoods();
        if (remoteFoods.length > 0) {
          const merged = mergeFoods(parsedFoods, remoteFoods);
          setFoods(merged);
          await persist(STORAGE_KEYS.FOODS, merged);
        }
        setFeedingLog(parsedLog);
      } catch (e) {
        console.error('Failed to load data:', e);
        setFoods(seedFoods);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist helpers
  const persist = async (key: string, data: unknown) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  };

  const setActivePetId = useCallback(async (id: string | null) => {
    setActivePetIdState(id);
    if (id) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PET, id);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_PET);
    }
  }, []);

  const addPet = useCallback(async (pet: Pet) => {
    const updated = [...pets, pet];
    setPets(updated);
    await persist(STORAGE_KEYS.PETS, updated);
    if (!activePetId) setActivePetId(pet.id);
  }, [pets, activePetId, setActivePetId]);

  const updatePet = useCallback(async (pet: Pet) => {
    const updated = pets.map((p) => (p.id === pet.id ? pet : p));
    setPets(updated);
    await persist(STORAGE_KEYS.PETS, updated);
  }, [pets]);

  const deletePet = useCallback(async (id: string) => {
    const updated = pets.filter((p) => p.id !== id);
    setPets(updated);
    await persist(STORAGE_KEYS.PETS, updated);
    if (activePetId === id) {
      setActivePetId(updated.length > 0 ? updated[0].id : null);
    }
  }, [pets, activePetId, setActivePetId]);

  const addFood = useCallback(async (food: Food) => {
    const updated = mergeFoods(foods, [food]);
    setFoods(updated);
    await persist(STORAGE_KEYS.FOODS, updated);
  }, [foods]);

  const addLogEntry = useCallback(async (entry: FeedingLogEntry) => {
    const updated = [...feedingLog, entry];
    setFeedingLog(updated);
    await persist(STORAGE_KEYS.LOG, updated);
  }, [feedingLog]);

  const deleteLogEntry = useCallback(async (id: string) => {
    const updated = feedingLog.filter((e) => e.id !== id);
    setFeedingLog(updated);
    await persist(STORAGE_KEYS.LOG, updated);
  }, [feedingLog]);

  const getLogForDate = useCallback((dateStr: string) => {
    return feedingLog.filter((e) => {
      return e.logged_at.startsWith(dateStr) && (!activePetId || e.pet_id === activePetId);
    });
  }, [feedingLog, activePetId]);

  const getTodayLog = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getLogForDate(today);
  }, [getLogForDate]);

  const getFoodById = useCallback((id: string) => {
    return foods.find((f) => f.id === id);
  }, [foods]);

  const getFoodByBarcode = useCallback((rawBarcode: string) => {
    const barcode = normalizeBarcode(rawBarcode);
    if (!barcode) return undefined;
    return foods.find((food) => {
      if (!food.barcode) return false;
      return normalizeBarcode(food.barcode) === barcode;
    });
  }, [foods]);

  const activePet = pets.find((p) => p.id === activePetId) ?? null;

  return (
    <PetContext.Provider
      value={{
        pets,
        foods,
        feedingLog,
        activePetId,
        activePet,
        isLoading,
        setActivePetId,
        addPet,
        updatePet,
        deletePet,
        addFood,
        addLogEntry,
        deleteLogEntry,
        getTodayLog,
        getLogForDate,
        getFoodById,
        getFoodByBarcode,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePetContext() {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePetContext must be used within PetProvider');
  return ctx;
}
