import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface LocationSetupFormProps {
  onLocationSet: (latitude: number, longitude: number, searchRadius: number) => Promise<void>;
}

export function LocationSetupForm({ onLocationSet }: LocationSetupFormProps) {
  const [location, setLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState('25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!location.trim()) {
      setError('Please enter a city or zip code');
      return;
    }

    const radius = parseInt(searchRadius, 10);
    if (isNaN(radius) || radius <= 0 || radius > 500) {
      setError('Search radius must be between 1 and 500 miles');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const coords = await geocodeLocation(location.trim());

      if (!coords) {
        setError('Location not found. Please try a different city or zip code.');
        setLoading(false);
        return;
      }

      await onLocationSet(coords.latitude, coords.longitude, radius);
    } catch (error) {
      console.error('Error setting location:', error);
      setError('Failed to set location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MapPin size={48} color={Colors.primary[500]} />
      </View>

      <Text style={styles.title}>Set Your Location</Text>
      <Text style={styles.description}>
        Enter your city or zip code to discover league conversations near you.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.form}>
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

        <Button
          title={loading ? 'Finding Location...' : 'Continue'}
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          disabled={loading}
        />
      </View>

      <Text style={styles.helpText}>
        Examples: "Forney, TX", "Mesquite, Texas", "75126", "Dallas County"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.neutral[50],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.neutral[400],
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  form: {
    width: '100%',
    gap: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error[500],
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  helpText: {
    ...Typography.body,
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
