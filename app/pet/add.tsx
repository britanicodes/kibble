import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePetContext } from '../../context/PetContext';
import { Pet, Species, ActivityLevel, WeightGoal, LifeStage } from '../../lib/types';
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

export default function AddPetScreen() {
  const router = useRouter();
  const { addPet } = usePetContext();

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your pet\'s name.');
      return;
    }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Weight required', 'Please enter a valid weight in kg.');
      return;
    }

    const pet: Pet = {
      id: Date.now().toString(),
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
      created_at: new Date().toISOString(),
    };

    await addPet(pet);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Buddy"
        placeholderTextColor={Colors.textLight}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Species</Text>
      <SegmentedControl
        options={['dog', 'cat'] as Species[]}
        value={species}
        onChange={setSpecies}
        labels={{ dog: 'Dog', cat: 'Cat' }}
      />

      <Text style={styles.label}>Breed (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Golden Retriever"
        placeholderTextColor={Colors.textLight}
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 12.5"
        placeholderTextColor={Colors.textLight}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Age (years)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 3"
        placeholderTextColor={Colors.textLight}
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
            placeholder="e.g. 10.0"
            placeholderTextColor={Colors.textLight}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="decimal-pad"
          />
        </>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Pet</Text>
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
