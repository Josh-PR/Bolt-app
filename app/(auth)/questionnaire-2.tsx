import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Typography } from '../../constants/Typography';
import { MapPin } from 'lucide-react-native';
import { TextInput } from '../../components/ui/TextInput';

export default function Questionnaire2() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState('25');

  const geocodeLocation = async (locationQuery: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&countrycodes=us&limit=1`,
        {
          headers: {
            'User-Agent': 'SoftballLeagueApp/1.0',
          },
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  const handleNext = async () => {
    setError('');

    if (!location.trim()) {
      setError('Please enter a city or zip code');
      return;
    }

    const radius = parseInt(searchRadius, 10);
    if (isNaN(radius) || radius <= 0 || radius > 500) {
      setError('Search radius must be between 1 and 500 miles');
      return;
    }

    setLoading(true);
    try {
      const coords = await geocodeLocation(location.trim());

      if (!coords) {
        setError('Location not found. Please try a different city or zip code.');
        setLoading(false);
        return;
      }

      await updateProfile({
        location_latitude: coords.latitude,
        location_longitude: coords.longitude,
        search_radius_miles: radius,
      });
      router.push('/(auth)/questionnaire-3');
    } catch (err) {
      setError('Failed to save location. Please try again.');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin size={48} color={Colors.primary[500]} />
        </View>

        <Text style={styles.title}>Set Your Location</Text>
        <Text style={styles.subtitle}>Step 2 of 3</Text>

        {error && <Text style={styles.errorMessage}>{error}</Text>}

        <TextInput
          label="City or Zip Code"
          placeholder="e.g., Forney, TX or 75126"
          value={location}
          onChangeText={setLocation}
          autoCapitalize="words"
          editable={!loading}
        />

        <TextInput
          label="Search Radius (miles)"
          placeholder="25"
          value={searchRadius}
          onChangeText={setSearchRadius}
          keyboardType="number-pad"
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Finding Location...' : 'Next'}
            onPress={handleNext}
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },

  subtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },

  errorMessage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
  },

  buttonContainer: {
    marginTop: Spacing.lg,
  },

  iconContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
});
