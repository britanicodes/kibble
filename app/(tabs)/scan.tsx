import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetContext } from '../../context/PetContext';
import { fetchApprovedFoodByBarcode } from '../../lib/foodCatalog';
import { isLikelyBarcode, normalizeBarcode } from '../../lib/barcode';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';

export default function ScanScreen() {
  const router = useRouter();
  const { addFood, getFoodByBarcode } = usePetContext();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const normalized = useMemo(() => normalizeBarcode(barcodeInput), [barcodeInput]);
  const canSearch = isLikelyBarcode(normalized) && !isSearching;

  const searchBarcode = async () => {
    if (!isLikelyBarcode(normalized)) {
      Alert.alert('Invalid barcode', 'Enter a valid UPC/EAN barcode (8, 12, 13, or 14 digits).');
      return;
    }

    const localHit = getFoodByBarcode(normalized);
    if (localHit) {
      router.push(`/food/${localHit.id}`);
      return;
    }

    setIsSearching(true);
    try {
      const remoteHit = await fetchApprovedFoodByBarcode(normalized);
      if (remoteHit) {
        await addFood(remoteHit);
        router.push(`/food/${remoteHit.id}`);
        return;
      }

      Alert.alert(
        'Food not found',
        'No approved food found for this barcode yet. You can add submission flow in Phase 2 moderation work.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name="barcode-outline" size={38} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Scan Food</Text>
        <Text style={styles.subtitle}>
          Phase 1 scaffold: use barcode lookup now. Camera scanner wiring comes next.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Barcode (UPC/EAN)</Text>
        <TextInput
          style={styles.input}
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          placeholder="e.g. 012345678905"
          placeholderTextColor={Colors.textLight}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.primaryButton, !canSearch && styles.primaryButtonDisabled]}
          onPress={searchBarcode}
          disabled={!canSearch}
        >
          <Ionicons name="search-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>{isSearching ? 'Searching...' : 'Find Food'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.helperCard}>
        <Text style={styles.helperTitle}>Next in Phase 1</Text>
        <Text style={styles.helperItem}>1. Add camera scanning with `expo-camera`</Text>
        <Text style={styles.helperItem}>2. Add fallback matching by brand + product name</Text>
        <Text style={styles.helperItem}>3. Add submission screen for missing products</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  hero: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
  label: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  primaryButton: {
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  helperCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helperTitle: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  helperItem: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
