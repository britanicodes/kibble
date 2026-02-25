import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import PetCard from '../../components/PetCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { pets, activePetId, setActivePetId, deletePet } = usePetContext();

  const handlePetPress = (id: string) => {
    if (activePetId === id) {
      router.push(`/pet/${id}`);
    } else {
      setActivePetId(id);
    }
  };

  const handleLongPress = (id: string, name: string) => {
    Alert.alert('Delete Pet', `Remove ${name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePet(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Pets</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/pet/add')}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="paw" size={48} color={Colors.textLight} />
          <Text style={styles.emptyText}>No pets yet. Add your first one!</Text>
        </View>
      ) : (
        <>
          <Text style={styles.hint}>Tap to make active. Tap the active pet to edit. Long-press to delete.</Text>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              onLongPress={() => handleLongPress(pet.id, pet.name)}
              activeOpacity={1}
            >
              <PetCard
                pet={pet}
                isActive={pet.id === activePetId}
                onPress={() => handlePetPress(pet.id)}
              />
            </TouchableOpacity>
          ))}
        </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
