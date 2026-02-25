import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import { FoodType } from '../../lib/types';
import FoodCard from '../../components/FoodCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

const FOOD_TYPES: (FoodType | 'all')[] = ['all', 'dry', 'wet', 'raw', 'treat'];

export default function SearchScreen() {
  const router = useRouter();
  const { foods, activePet } = usePetContext();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FoodType | 'all'>('all');

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      const matchesQuery =
        !query ||
        f.brand.toLowerCase().includes(query.toLowerCase()) ||
        f.product_name.toLowerCase().includes(query.toLowerCase()) ||
        (f.barcode ?? '').includes(query);
      const matchesType = activeFilter === 'all' || f.food_type === activeFilter;
      const matchesSpecies =
        !activePet ||
        f.species === 'both' ||
        f.species === activePet.species;
      return matchesQuery && matchesType && matchesSpecies;
    });
  }, [foods, query, activeFilter, activePet]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor={Colors.textLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.chips}>
        {FOOD_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.chip, activeFilter === type && styles.chipActive]}
            onPress={() => setActiveFilter(type)}
          >
            <Text style={[styles.chipText, activeFilter === type && styles.chipTextActive]}>
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodCard
            food={item}
            onPress={() => router.push(`/food/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No foods found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    height: 48,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  chipTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
