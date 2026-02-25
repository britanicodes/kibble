import { supabase } from './supabase';
import { normalizeBarcode } from './barcode';
import { Food } from './types';

export async function fetchApprovedFoods(): Promise<Food[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('moderation_status', 'approved')
    .eq('is_active', true)
    .order('brand', { ascending: true })
    .order('product_name', { ascending: true });

  if (error) {
    console.warn('[foods] Failed to fetch approved foods:', error.message);
    return [];
  }

  return ((data ?? []) as unknown) as Food[];
}

export async function fetchApprovedFoodByBarcode(rawBarcode: string): Promise<Food | null> {
  if (!supabase) return null;

  const barcode = normalizeBarcode(rawBarcode);
  if (!barcode) return null;

  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('barcode', barcode)
    .eq('moderation_status', 'approved')
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.warn('[foods] Failed barcode lookup:', error.message);
    return null;
  }

  return data ? (((data as unknown) as Food) ?? null) : null;
}
