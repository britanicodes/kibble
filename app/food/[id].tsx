import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import { calculateDailyCalories, calculateFeedingAmount } from '../../lib/calories';
import { FeedingLogEntry } from '../../lib/types';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getFoodById, activePet, addLogEntry } = usePetContext();

  const food = getFoodById(id);

  if (!food) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Food not found.</Text>
      </View>
    );
  }

  const dailyCals = activePet ? calculateDailyCalories(activePet) : null;
  const feedingAmount = dailyCals ? calculateFeedingAmount(dailyCals, food) : null;

  const logFeeding = (servings: number) => {
    if (!activePet) {
      Alert.alert('No active pet', 'Please add a pet first.');
      return;
    }
    const entry: FeedingLogEntry = {
      id: Date.now().toString(),
      pet_id: activePet.id,
      food_id: food.id,
      servings,
      calories: food.calories_per_serving * servings,
      logged_at: new Date().toISOString(),
    };
    addLogEntry(entry);
    Alert.alert('Logged!', `${Math.round(entry.calories)} kcal added.`);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>{food.brand}</Text>
      <Text style={styles.name}>{food.product_name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {food.food_type.toUpperCase()} &middot; {food.species === 'both' ? 'Cat & Dog' : food.species.toUpperCase()}
        </Text>
      </View>
      {food.barcode ? (
        <Text style={styles.metaLine}>Barcode: {food.barcode}</Text>
      ) : null}
      <Text style={styles.metaLine}>
        Source: {food.source ?? 'seed'}{food.is_verified ? ' (verified)' : ''}
      </Text>

      {/* Nutrition grid */}
      <View style={styles.grid}>
        <NutrientBox label="Calories" value={`${food.calories_per_serving}`} unit={`kcal/${food.serving_size_g}g`} />
        <NutrientBox label="Protein" value={`${food.protein_pct}`} unit="%" />
        <NutrientBox label="Fat" value={`${food.fat_pct}`} unit="%" />
        <NutrientBox label="Fiber" value={`${food.fiber_pct}`} unit="%" />
        <NutrientBox label="Moisture" value={`${food.moisture_pct}`} unit="%" />
        <NutrientBox label="Serving" value={`${food.serving_size_g}`} unit={food.serving_unit} />
      </View>

      {/* Feeding recommendation */}
      {activePet && feedingAmount && (
        <View style={styles.recommendation}>
          <Ionicons name="calculator-outline" size={22} color={Colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recTitle}>Daily Recommendation for {activePet.name}</Text>
            <Text style={styles.recValue}>
              {feedingAmount.amount} {feedingAmount.unit}/day ({dailyCals} kcal target)
            </Text>
          </View>
        </View>
      )}

      {/* Log buttons */}
      <TouchableOpacity style={styles.logBtn} onPress={() => logFeeding(1)}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.logBtnText}>Log 1 Serving ({food.calories_per_serving} kcal)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logBtnHalf} onPress={() => logFeeding(0.5)}>
        <Text style={styles.logBtnHalfText}>Log Half Serving ({Math.round(food.calories_per_serving * 0.5)} kcal)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function NutrientBox({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.nutrientBox}>
      <Text style={styles.nutrientValue}>{value}</Text>
      <Text style={styles.nutrientUnit}>{unit}</Text>
      <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.error,
  },
  brand: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  metaLine: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  nutrientBox: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutrientValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  nutrientUnit: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  nutrientLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.secondary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  recTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  recValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
    marginTop: 2,
  },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xl,
  },
  logBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  logBtnHalf: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  logBtnHalfText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
