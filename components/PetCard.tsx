import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '../lib/types';
import { calculateDailyCalories } from '../lib/calories';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface PetCardProps {
  pet: Pet;
  isActive?: boolean;
  onPress?: () => void;
}

export default function PetCard({ pet, isActive, onPress }: PetCardProps) {
  const dailyCals = calculateDailyCalories(pet);

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.activeCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Ionicons
          name={pet.species === 'cat' ? 'logo-octocat' : 'paw-outline'}
          size={28}
          color={isActive ? Colors.primary : Colors.textSecondary}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>
          {pet.breed || pet.species} &middot; {pet.weight_kg} kg &middot; {pet.age_years}y
        </Text>
        <Text style={styles.calories}>
          {dailyCals} kcal/day &middot; Goal: {pet.goal}
        </Text>
      </View>
      {isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCard: {
    borderColor: Colors.primary,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  details: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calories: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  activeBadgeText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
