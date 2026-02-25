import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedingLogEntry, Food } from '../lib/types';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface MealEntryProps {
  entry: FeedingLogEntry;
  food: Food | undefined;
  onDelete?: () => void;
}

export default function MealEntry({ entry, food, onDelete }: MealEntryProps) {
  const time = new Date(entry.logged_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.foodName} numberOfLines={1}>
          {food ? `${food.brand} ${food.product_name}` : 'Unknown food'}
        </Text>
        <Text style={styles.detail}>
          {entry.servings} serving{entry.servings !== 1 ? 's' : ''} &middot;{' '}
          {food?.food_type === 'treat' ? '🦴 Treat' : '🍽 Meal'}
        </Text>
      </View>
      <Text style={styles.calories}>{Math.round(entry.calories)} kcal</Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle-outline" size={22} color={Colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  timeCol: {
    width: 56,
    marginRight: Spacing.sm,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  info: {
    flex: 1,
  },
  foodName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  detail: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calories: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
});
