import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface CalorieBarProps {
  consumed: number;
  target: number;
}

export default function CalorieBar({ consumed, target }: CalorieBarProps) {
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Daily Calories</Text>
        <Text style={[styles.count, isOver && styles.overCount]}>
          {consumed} / {target} kcal
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${pct * 100}%` },
            isOver && styles.barOver,
          ]}
        />
      </View>
      <Text style={[styles.remaining, isOver && styles.overText]}>
        {isOver
          ? `${consumed - target} kcal over budget`
          : `${remaining} kcal remaining`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  count: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  overCount: {
    color: Colors.error,
  },
  barBackground: {
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.calorieBarBackground,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.calorieBar,
  },
  barOver: {
    backgroundColor: Colors.error,
  },
  remaining: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  overText: {
    color: Colors.error,
  },
});
