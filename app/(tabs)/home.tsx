import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import { calculateDailyCalories } from '../../lib/calories';
import CalorieBar from '../../components/CalorieBar';
import MealEntry from '../../components/MealEntry';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { activePet, pets, getTodayLog, getFoodById, deleteLogEntry } = usePetContext();

  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="paw" size={64} color={Colors.primary} />
        <Text style={styles.emptyTitle}>Welcome to Kibble!</Text>
        <Text style={styles.emptySubtitle}>
          Add your first pet to start tracking their nutrition.
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/pet/add')}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activePet) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptySubtitle}>Select an active pet in the Pets tab.</Text>
      </View>
    );
  }

  const dailyTarget = calculateDailyCalories(activePet);
  const todayLog = getTodayLog();
  const consumed = todayLog.reduce((sum, e) => sum + e.calories, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Pet header */}
      <View style={styles.petHeader}>
        <View style={styles.petAvatar}>
          <Ionicons
            name={activePet.species === 'cat' ? 'logo-octocat' : 'paw'}
            size={32}
            color={Colors.primary}
          />
        </View>
        <View>
          <Text style={styles.petName}>{activePet.name}</Text>
          <Text style={styles.petMeta}>
            {activePet.weight_kg} kg &middot; Goal: {activePet.goal}
          </Text>
        </View>
      </View>

      {/* Calorie budget */}
      <CalorieBar consumed={Math.round(consumed)} target={dailyTarget} />

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <Ionicons name="barcode-outline" size={24} color={Colors.primary} />
          <Text style={styles.quickBtnText}>Scan Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="heart-circle" size={24} color={Colors.treatWarning} />
          <Text style={styles.quickBtnText}>Log Treat</Text>
        </TouchableOpacity>
      </View>

      {/* Today's meals */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {todayLog.length === 0 ? (
        <View style={styles.emptyMeals}>
          <Text style={styles.emptyMealsText}>No meals logged yet today.</Text>
        </View>
      ) : (
        <View style={styles.mealsCard}>
          {todayLog.map((entry) => (
            <MealEntry
              key={entry.id}
              entry={entry}
              food={getFoodById(entry.food_id)}
              onDelete={() => deleteLogEntry(entry.id)}
            />
          ))}
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
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  petName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  petMeta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  mealsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyMeals: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyMealsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  addButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
