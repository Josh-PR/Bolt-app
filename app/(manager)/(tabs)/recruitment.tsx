import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput as RNTextInput, Alert } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Header } from '../../../components/ui/Header';
import { useAuth } from '../../../contexts/AuthContext';
import { sortByDistance, formatDistance } from '../../../utils/location';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import { Spacing } from '../../../constants/Spacing';

const mockFreeAgents = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    experienceLevel: 'intermediate',
    preferredPositions: ['Shortstop', 'Second Base'],
    bio: 'Played college softball, looking for a competitive team.',
    availability: ['Weekend Afternoons', 'Weekend Evenings'],
    location: 'Downtown area',
    location_latitude: 40.7505,
    location_longitude: -73.9934,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    experienceLevel: 'beginner',
    preferredPositions: ['Left Field', 'Right Field', 'Center Field'],
    bio: 'New to softball but eager to learn and contribute.',
    availability: ['Weekday Evenings', 'Weekend Mornings'],
    location: 'North side',
    location_latitude: 40.7831,
    location_longitude: -73.9712,
  },
  {
    id: '3',
    name: 'David Kim',
    experienceLevel: 'advanced',
    preferredPositions: ['Pitcher', 'Catcher'],
    bio: '15 years experience, former semi-pro player.',
    availability: ['Flexible Schedule'],
    location: 'Central area',
    location_latitude: 40.7505,
    location_longitude: -73.9934,
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    experienceLevel: 'intermediate',
    preferredPositions: ['Third Base', 'First Base'],
    bio: 'Team player with strong batting average.',
    availability: ['Weekend Afternoons'],
    location: 'East side',
    location_latitude: 40.7614,
    location_longitude: -73.9776,
  },
];

export default function ManagerRecruitment() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');

  const userLocation = profile?.location_latitude && profile?.location_longitude
    ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
    : null;

  const filteredAndSortedFreeAgents = sortByDistance(
    mockFreeAgents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.preferredPositions.some(pos => pos.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           agent.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkillLevel = selectedSkillLevel === 'all' || agent.experienceLevel === selectedSkillLevel;
      const matchesPosition = selectedPosition === 'all' || agent.preferredPositions.some(pos => pos.toLowerCase().includes(selectedPosition.toLowerCase()));

      return matchesSearch && matchesSkillLevel && matchesPosition;
    }),
    userLocation,
    profile?.search_radius_miles || undefined
  );

  const getSkillLevelBadgeVariant = (skillLevel: string) => {
    switch (skillLevel) {
      case 'beginner':
        return 'primary';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const handleContactPlayer = (playerId: string, playerName: string) => {
    Alert.alert(
      'Contact Player',
      `Send recruitment message to ${playerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => Alert.alert('Success', `Recruitment message sent to ${playerName}!`) },
      ]
    );
  };

  const handleInviteToTeam = (playerId: string, playerName: string) => {
    Alert.alert(
      'Invite to Team',
      `Which team would you like to invite ${playerName} to?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Thunder Bolts', onPress: () => Alert.alert('Success', `Invitation sent to ${playerName} for Thunder Bolts!`) },
        { text: 'Home Runners', onPress: () => Alert.alert('Success', `Invitation sent to ${playerName} for Home Runners!`) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Player Recruitment" subtitle="Find and recruit free agents for your teams" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <RNTextInput
              style={styles.searchInput}
              placeholder="Search players..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Experience Level</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      title={level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      onPress={() => setSelectedSkillLevel(level)}
                      variant={selectedSkillLevel === level ? 'primary' : 'outline'}
                      size="sm"
                      style={styles.filterButton}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Position</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {['all', 'pitcher', 'catcher', 'infield', 'outfield'].map((position) => (
                    <Button
                      key={position}
                      title={position === 'all' ? 'All Positions' : position.charAt(0).toUpperCase() + position.slice(1)}
                      onPress={() => setSelectedPosition(position)}
                      variant={selectedPosition === position ? 'primary' : 'outline'}
                      size="sm"
                      style={styles.filterButton}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredAndSortedFreeAgents.length} player{filteredAndSortedFreeAgents.length !== 1 ? 's' : ''} available
            </Text>
            {userLocation && (
              <Text style={styles.sortingNote}>
                Sorted by distance from your location
              </Text>
            )}
          </View>

          <View style={styles.playersList}>
            {filteredAndSortedFreeAgents.map((player) => (
              <Card key={player.id} style={styles.playerCard}>
                <View style={styles.playerHeader}>
                  <View style={styles.playerNameContainer}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.distance !== undefined && (
                      <Text style={styles.distanceText}>
                        {formatDistance(player.distance)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.headerRight}>
                    <Badge
                      label={player.experienceLevel}
                      variant={getSkillLevelBadgeVariant(player.experienceLevel)}
                      size="sm"
                    />
                  </View>
                </View>

                <Text style={styles.playerBio}>{player.bio}</Text>

                <View style={styles.playerDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Preferred Positions:</Text>
                    <Text style={styles.detailValue}>{player.preferredPositions.join(', ')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Availability:</Text>
                    <Text style={styles.detailValue}>{Array.isArray(player.availability) ? player.availability.join(', ') : player.availability}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{player.location}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    title="Contact"
                    onPress={() => handleContactPlayer(player.id, player.name)}
                    variant="outline"
                    style={styles.contactButton}
                  />
                  <Button
                    title="Invite to Team"
                    onPress={() => handleInviteToTeam(player.id, player.name)}
                    style={styles.inviteButton}
                  />
                </View>
              </Card>
            ))}
          </View>

          {filteredAndSortedFreeAgents.length === 0 && (
            <Card style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Players Found</Text>
              <Text style={styles.emptyStateDescription}>
                No free agents match your current search criteria. Try adjusting your filters or search terms.
              </Text>
            </Card>
          )}
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

  searchContainer: {
    marginBottom: Spacing.lg,
  },

  searchInput: {
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#555555',
  },

  filtersContainer: {
    marginBottom: Spacing.lg,
  },

  filterGroup: {
    marginBottom: Spacing.md,
  },

  filterLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    color: '#FFFFFF',
  },

  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  filterButton: {
    marginRight: Spacing.sm,
  },

  resultsHeader: {
    marginBottom: Spacing.lg,
  },

  resultsCount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#FFFFFF',
  },

  sortingNote: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.xs,
    color: '#CCCCCC',
  },

  playersList: {
    gap: Spacing.md,
  },

  playerCard: {
    backgroundColor: '#FFFFFF',
  },

  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  playerNameContainer: {
    flex: 1,
  },

  playerName: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#000000',
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  distanceText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    marginTop: Spacing.xs,
    color: '#666666',
  },

  playerBio: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
    color: '#333333',
  },

  playerDetails: {
    marginBottom: Spacing.md,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },

  detailLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#000000',
  },

  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#333333',
    flex: 1,
    textAlign: 'right',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  contactButton: {
    flex: 1,
  },

  inviteButton: {
    flex: 1,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },

  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.semiBold,
    marginBottom: Spacing.md,
    color: '#000000',
  },

  emptyStateDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    color: '#666666',
  },
});
