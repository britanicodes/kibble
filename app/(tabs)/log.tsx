import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import { calculateDailyCalories } from '../../lib/calories';
import CalorieBar from '../../components/CalorieBar';
import MealEntry from '../../components/MealEntry';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function displayDate(dateStr: string): string {
  const today = formatDate(new Date());
  if (dateStr === today) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === formatDate(yesterday)) return 'Yesterday';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function LogScreen() {
  const { activePet, getLogForDate, getFoodById, deleteLogEntry } = usePetContext();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const dayLog = useMemo(() => getLogForDate(selectedDate), [getLogForDate, selectedDate]);
  const consumed = dayLog.reduce((sum, e) => sum + e.calories, 0);
  const target = activePet ? calculateDailyCalories(activePet) : 0;

  const meals = dayLog.filter((e) => {
    const food = getFoodById(e.food_id);
    return food && food.food_type !== 'treat';
  });
  const treats = dayLog.filter((e) => {
    const food = getFoodById(e.food_id);
    return food && food.food_type === 'treat';
  });

  const shiftDay = (offset: number) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + offset);
    setSelectedDate(formatDate(d));
  };

  if (!activePet) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add a pet to start logging meals.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date picker */}
      <View style={styles.datePicker}>
        <TouchableOpacity onPress={() => shiftDay(-1)}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{displayDate(selectedDate)}</Text>
        <TouchableOpacity
          onPress={() => shiftDay(1)}
          disabled={selectedDate === formatDate(new Date())}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={selectedDate === formatDate(new Date()) ? Colors.textLight : Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Budget bar */}
      <CalorieBar consumed={Math.round(consumed)} target={target} />

      {/* Meals */}
      <Text style={styles.sectionTitle}>Meals</Text>
      {meals.length === 0 ? (
        <Text style={styles.emptySection}>No meals logged.</Text>
      ) : (
        <View style={styles.card}>
          {meals.map((entry) => (
            <MealEntry
              key={entry.id}
              entry={entry}
              food={getFoodById(entry.food_id)}
              onDelete={() => deleteLogEntry(entry.id)}
            />
          ))}
        </View>
      )}

      {/* Treats */}
      <Text style={styles.sectionTitle}>Treats</Text>
      {treats.length === 0 ? (
        <Text style={styles.emptySection}>No treats logged.</Text>
      ) : (
        <View style={styles.card}>
          {treats.map((entry) => (
            <MealEntry
              key={entry.id}
              entry={entry}
              food={getFoodById(entry.food_id)}
              onDelete={() => deleteLogEntry(entry.id)}
            />
          ))}
          <View style={styles.treatSummary}>
            <Ionicons name="warning" size={16} color={Colors.treatWarning} />
            <Text style={styles.treatSummaryText}>
              {Math.round(treats.reduce((s, e) => s + e.calories, 0))} kcal from treats
              (aim for &lt;10% of daily budget)
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
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
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  dateText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    minWidth: 120,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptySection: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  treatSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  treatSummaryText: {
    fontSize: FontSize.xs,
    color: Colors.treatWarning,
    fontWeight: FontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
