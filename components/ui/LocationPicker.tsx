import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { getCurrentLocation, RADIUS_OPTIONS, LocationCoordinates } from '../../utils/location';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface LocationPickerProps {
  currentLocation?: LocationCoordinates | null;
  currentRadius?: number | null;
  onLocationChange: (location: LocationCoordinates | null) => void;
  onRadiusChange: (radius: number | null) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  currentLocation,
  currentRadius,
  onLocationChange,
  onRadiusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      onLocationChange(location);
      Alert.alert('Success', 'Location updated successfully!');
    } catch (error: any) {
      Alert.alert('Location Error', error.message || 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (!manualLocation.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    // In a real app, you would geocode the address here
    // For now, we'll use mock coordinates for demonstration
    const mockCoordinates = {
      latitude: 40.7128,
      longitude: -74.0060,
    };

    onLocationChange(mockCoordinates);
    Alert.alert('Success', `Location set to: ${manualLocation}`);
    setManualLocation('');
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    Alert.alert('Success', 'Location cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location Settings</Text>
      
      {/* Current Location Display */}
      {currentLocation && (
        <View style={styles.currentLocation}>
          <Text style={styles.currentLocationText}>
            Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {/* Location Actions */}
      <View style={styles.locationActions}>
        <Button
          title="Use Current Location"
          onPress={handleGetCurrentLocation}
          loading={loading}
          style={styles.locationButton}
        />
        
        <Button
          title="Clear Location"
          onPress={handleClearLocation}
          variant="outline"
          style={styles.locationButton}
          disabled={!currentLocation}
        />
      </View>

      {/* Manual Location Entry */}
      <View style={styles.manualLocationSection}>
        <TextInput
          label="Or Enter Location Manually"
          placeholder="Enter city, state or address"
          value={manualLocation}
          onChangeText={setManualLocation}
          hint="e.g., San Francisco, CA or 123 Main St, City, State"
        />
        <Button
          title="Set Location"
          onPress={handleManualLocation}
          variant="outline"
          disabled={!manualLocation.trim()}
        />
      </View>

      {/* Search Radius */}
      <View style={styles.radiusSection}>
        <Text style={styles.radiusTitle}>Search Radius</Text>
        <Text style={styles.radiusDescription}>
          Choose how far you're willing to travel for games and practices
        </Text>
        
        <View style={styles.radiusOptions}>
          {RADIUS_OPTIONS.map((option) => (
            <Button
              key={option.value || 'unlimited'}
              title={option.label}
              onPress={() => onRadiusChange(option.value)}
              variant={currentRadius === option.value ? 'primary' : 'outline'}
              size="sm"
              style={styles.radiusButton}
            />
          ))}
        </View>
        
        {currentRadius && (
          <Text style={styles.currentRadius}>
            Current radius: {currentRadius} miles
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  
  currentLocation: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  
  currentLocationText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  
  locationActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  
  locationButton: {
    flex: 1,
  },
  
  manualLocationSection: {
    marginBottom: Spacing.lg,
  },
  
  radiusSection: {
    marginTop: Spacing.lg,
  },
  
  radiusTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  
  radiusDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  
  radiusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  
  radiusButton: {
    minWidth: 80,
  },
  
  currentRadius: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary[800],
    textAlign: 'center',
  },
});