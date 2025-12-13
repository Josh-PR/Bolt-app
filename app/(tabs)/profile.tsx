import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Image, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { Badge } from '../../components/ui/Badge';
import { LocationPicker } from '../../components/ui/LocationPicker';
import { Header } from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { LocationCoordinates } from '../../utils/location';
import { X } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

export default function Profile() {
  const { profile, signOut, updateProfile, bypassAuth } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location_latitude && profile?.location_longitude 
      ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
      : null,
    searchRadius: profile?.search_radius_miles || null,
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.fullName,
        phone: formData.phone,
        location_latitude: formData.location?.latitude || null,
        location_longitude: formData.location?.longitude || null,
        search_radius_miles: formData.searchRadius,
      });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleSignOutClick = () => {
    console.log('Sign out button clicked for role:', profile?.role);
    setShowSignOutModal(true);
  };

  const handleConfirmSignOut = async () => {
    console.log('Sign out button clicked for role:', profile?.role);
    setSigningOut(true);
    
    try {
      console.log('Starting sign out process for role:', profile?.role);
      await signOut();
      console.log('Sign out completed, navigating to welcome...');
      
      // Close modal first
      setShowSignOutModal(false);
      
      // Navigate to welcome screen
      router.replace('/(auth)/welcome');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setShowSignOutModal(false);
      Alert.alert(
        'Sign Out Error', 
        error.message || 'Failed to sign out. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSigningOut(false);
    }
  };

  const getRoleSpecificMessage = () => {
    const roleMessages = {
      player: 'Are you sure you want to sign out of your player account?',
      manager: 'Are you sure you want to sign out of your manager account? This will disconnect you from your team management features.',
      director: 'Are you sure you want to sign out of your director account? This will disconnect you from all league management features.',
    };
    
    return roleMessages[profile?.role as keyof typeof roleMessages] || 'Are you sure you want to sign out?';
  };

  const handleBecomeManager = () => {
    Alert.alert(
      'Become a Manager',
      'Would you like to upgrade your account to become a team manager? This will give you access to team management features.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => Alert.alert('Success', 'Account upgrade request submitted!') },
      ]
    );
  };

  const handleBecomeFreeAgent = () => {
    Alert.alert(
      'Become a Free Agent',
      'Make yourself available for teams looking for players?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => Alert.alert('Success', 'You are now listed as a free agent!') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
              style={styles.avatar}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{profile?.full_name}</Text>
              <Badge label={profile?.role || 'player'} variant="primary" />
            </View>
            <Button
              title={editing ? 'Cancel' : 'Edit'}
              onPress={() => {
                if (editing) {
                  setFormData({
                    fullName: profile?.full_name || '',
                    phone: profile?.phone || '',
                    location: profile?.location_latitude && profile?.location_longitude 
                      ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
                      : null,
                    searchRadius: profile?.search_radius_miles || null,
                  });
                }
                setEditing(!editing);
              }}
              variant="outline"
              size="sm"
            />
          </View>

          {/* Profile Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            {editing ? (
              <View style={styles.editForm}>
                <TextInput
                  label="Full Name"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                  placeholder="Enter your full name"
                />
                <TextInput
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
                <LocationPicker
                  currentLocation={formData.location}
                  currentRadius={formData.searchRadius}
                  onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
                  onRadiusChange={(radius) => setFormData(prev => ({ ...prev, searchRadius: radius }))}
                />
                <View style={styles.editActions}>
                  <Button
                    title="Save Changes"
                    onPress={handleSave}
                    style={styles.saveButton}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profile?.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profile?.phone || 'Not provided'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>{profile?.role}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Search Radius</Text>
                  <Text style={styles.infoValue}>
                    {profile?.search_radius_miles ? `${profile.search_radius_miles} miles` : 'Not set'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {profile?.location_latitude && profile?.location_longitude 
                      ? `${profile.location_latitude.toFixed(4)}, ${profile.location_longitude.toFixed(4)}`
                      : 'Not set'
                    }
                  </Text>
                </View>
              </View>
            )}
          </Card>

          {/* Quick Actions */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsList}>
              <Button
                title="Change Role"
                onPress={() => router.push('/(auth)/welcome')}
                variant="outline"
                style={styles.actionButton}
                textStyle={styles.whiteButtonText}
              />
              {profile?.role === 'player' && (
                <>
                  <Button
                    title="Become a Free Agent"
                    onPress={handleBecomeFreeAgent}
                    variant="outline"
                    style={styles.actionButton}
                    textStyle={styles.whiteButtonText}
                  />
                  <Button
                    title="Upgrade to Manager"
                    onPress={handleBecomeManager}
                    variant="outline"
                    style={styles.actionButton}
                    textStyle={styles.whiteButtonText}
                  />
                </>
              )}
              <Button
                title="View Payment History"
                onPress={() => Alert.alert('Coming Soon', 'Payment history feature coming soon!')}
                variant="outline"
                style={styles.actionButton}
                textStyle={styles.whiteButtonText}
              />
              <Button
                title="Notification Settings"
                onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
                variant="outline"
                style={styles.actionButton}
                textStyle={styles.whiteButtonText}
              />
            </View>
          </Card>

          {/* Account Statistics */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Account Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Teams Joined</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>Seasons</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Leagues</Text>
              </View>
            </View>
          </Card>

          {/* Settings */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsList}>
              <Button
                title="Privacy Settings"
                onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
                variant="ghost"
                style={styles.settingButton}
                textStyle={styles.whiteButtonText}
              />
              <Button
                title="Help & Support"
                onPress={() => Alert.alert('Coming Soon', 'Help & support coming soon!')}
                variant="ghost"
                style={styles.settingButton}
                textStyle={styles.whiteButtonText}
              />
              <Button
                title="Terms of Service"
                onPress={() => Alert.alert('Coming Soon', 'Terms of service coming soon!')}
                variant="ghost"
                style={styles.settingButton}
                textStyle={styles.whiteButtonText}
              />
              <Button
                title="Privacy Policy"
                onPress={() => Alert.alert('Coming Soon', 'Privacy policy coming soon!')}
                variant="ghost"
                style={styles.settingButton}
                textStyle={styles.whiteButtonText}
              />
            </View>
          </Card>

          {/* Sign Out */}
          <Card style={styles.section}>
            <Button
              title="Sign Out"
             onPress={handleSignOutClick}
              variant="outline"
              style={styles.signOutButton}
              textStyle={styles.whiteButtonText}
            />
          </Card>

          {/* Custom Sign Out Confirmation Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSignOutModal}
            onRequestClose={() => setShowSignOutModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Confirm Sign Out</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowSignOutModal(false)}
                    disabled={signingOut}
                  >
                    <X color={Colors.text.secondary} size={20} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalMessage}>
                  {getRoleSpecificMessage()}
                </Text>
                
                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowSignOutModal(false)}
                    variant="outline"
                    style={styles.modalCancelButton}
                    disabled={signingOut}
                  />
                  <Button
                    title="Sign Out"
                    onPress={handleConfirmSignOut}
                    loading={signingOut}
                    style={styles.modalSignOutButton}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  content: {
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.screen.vertical,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Spacing.md,
  },
  
  headerInfo: {
    flex: 1,
  },
  
  name: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs,
    color: '#FFFFFF',
  },
  
  section: {
    marginBottom: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.md,
    color: '#FFFFFF',
  },
  
  editForm: {
    gap: Spacing.md,
  },
  
  editActions: {
    marginTop: Spacing.md,
  },
  
  saveButton: {
    marginTop: Spacing.md,
  },
  
  infoList: {
    gap: Spacing.md,
  },
  
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  
  infoValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
  },
  
  actionsList: {
    gap: Spacing.sm,
  },
  
  actionButton: {
    marginBottom: Spacing.sm,
    borderColor: '#FFFFFF',
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  
  settingsList: {
    gap: Spacing.xs,
  },
  
  settingButton: {
    justifyContent: 'flex-start',
    borderColor: '#FFFFFF',
  },
  
  signOutButton: {
    borderColor: '#FFFFFF',
  },
  
  whiteButtonText: {
    color: '#FFFFFF',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen.horizontal,
  },
  
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalMessage: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  
  modalCancelButton: {
    flex: 1,
  },
  
  modalSignOutButton: {
    flex: 1,
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
});