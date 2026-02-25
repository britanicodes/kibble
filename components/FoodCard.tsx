import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Food, FoodType } from '../lib/types';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface FoodCardProps {
  food: Food;
  onPress?: () => void;
}

const foodTypeIcons: Record<FoodType, keyof typeof Ionicons.glyphMap> = {
  dry: 'cube-outline',
  wet: 'water-outline',
  raw: 'leaf-outline',
  treat: 'heart-outline',
};

const foodTypeColors: Record<FoodType, string> = {
  dry: '#D97706',
  wet: '#2563EB',
  raw: '#059669',
  treat: '#DC2626',
};

export default function FoodCard({ food, onPress }: FoodCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: foodTypeColors[food.food_type] + '15' }]}>
        <Ionicons
          name={foodTypeIcons[food.food_type]}
          size={24}
          color={foodTypeColors[food.food_type]}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{food.brand}</Text>
        <Text style={styles.name} numberOfLines={1}>{food.product_name}</Text>
        <Text style={styles.meta}>
          {food.calories_per_serving} kcal / {food.serving_size_g}{food.serving_unit}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: 2,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
