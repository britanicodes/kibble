import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePetContext } from '../../context/PetContext';
import { Pet, Species, ActivityLevel, WeightGoal, LifeStage } from '../../lib/types';
import { calculateDailyCalories } from '../../lib/calories';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<T, string>;
}) {
  return (
    <View style={segStyles.row}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[segStyles.seg, value === opt && segStyles.segActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[segStyles.segText, value === opt && segStyles.segTextActive]}>
            {labels?.[opt] ?? opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const segStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.xs },
  seg: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  segTextActive: { color: '#fff' },
});

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pets, updatePet } = usePetContext();

  const pet = pets.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [neutered, setNeutered] = useState(true);
  const [lifeStage, setLifeStage] = useState<LifeStage>('adult');
  const [goal, setGoal] = useState<WeightGoal>('maintain');
  const [targetWeight, setTargetWeight] = useState('');

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setSpecies(pet.species);
      setBreed(pet.breed);
      setWeight(String(pet.weight_kg));
      setAge(String(pet.age_years));
      setActivity(pet.activity_level);
      setNeutered(pet.is_neutered);
      setLifeStage(pet.life_stage);
      setGoal(pet.goal);
      setTargetWeight(pet.target_weight_kg ? String(pet.target_weight_kg) : '');
    }
  }, [pet]);

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pet not found.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required');
      return;
    }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Valid weight required');
      return;
    }

    const updated: Pet = {
      ...pet,
      name: name.trim(),
      species,
      breed: breed.trim(),
      weight_kg: Number(weight),
      age_years: Number(age) || 1,
      activity_level: activity,
      is_neutered: neutered,
      life_stage: lifeStage,
      goal,
      target_weight_kg: targetWeight ? Number(targetWeight) : null,
    };

    await updatePet(updated);
    router.back();
  };

  const previewCals = calculateDailyCalories({
    ...pet,
    weight_kg: Number(weight) || pet.weight_kg,
    species,
    is_neutered: neutered,
    life_stage: lifeStage,
    goal,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.preview}>
        <Text style={styles.previewLabel}>Daily Calorie Target</Text>
        <Text style={styles.previewValue}>{previewCals} kcal</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Species</Text>
      <SegmentedControl
        options={['dog', 'cat'] as Species[]}
        value={species}
        onChange={setSpecies}
        labels={{ dog: 'Dog', cat: 'Cat' }}
      />

      <Text style={styles.label}>Breed</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Age (years)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Life Stage</Text>
      <SegmentedControl
        options={
          species === 'dog'
            ? (['puppy', 'adult', 'senior'] as LifeStage[])
            : (['kitten', 'adult', 'senior'] as LifeStage[])
        }
        value={lifeStage}
        onChange={setLifeStage}
        labels={{ puppy: 'Puppy', kitten: 'Kitten', adult: 'Adult', senior: 'Senior' }}
      />

      <Text style={styles.label}>Neutered / Spayed</Text>
      <SegmentedControl
        options={['yes', 'no']}
        value={neutered ? 'yes' : 'no'}
        onChange={(v) => setNeutered(v === 'yes')}
        labels={{ yes: 'Yes', no: 'No' }}
      />

      <Text style={styles.label}>Activity Level</Text>
      <SegmentedControl
        options={['low', 'moderate', 'high'] as ActivityLevel[]}
        value={activity}
        onChange={setActivity}
        labels={{ low: 'Low', moderate: 'Moderate', high: 'High' }}
      />

      <Text style={styles.label}>Weight Goal</Text>
      <SegmentedControl
        options={['lose', 'maintain', 'gain'] as WeightGoal[]}
        value={goal}
        onChange={setGoal}
        labels={{ lose: 'Lose', maintain: 'Maintain', gain: 'Gain' }}
      />

      {goal !== 'maintain' && (
        <>
          <Text style={styles.label}>Target Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="decimal-pad"
            placeholder="e.g. 10.0"
            placeholderTextColor={Colors.textLight}
          />
        </>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.error,
  },
  preview: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  previewLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  previewValue: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
