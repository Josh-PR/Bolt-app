import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput as RNTextInput } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Header } from '../../../components/ui/Header';
import { useAuth } from '../../../contexts/AuthContext';
import { sortByDistance, formatDistance } from '../../../utils/location';
import { Colors } from '../../../constants/Colors';
import { Typography } from '../../../constants/Typography';
import { Spacing } from '../../../constants/Spacing';

const mockLeagues = [
  {
    id: '1',
    name: 'Spring Recreation League',
    description: 'A fun, recreational league for all skill levels',
    skillLevel: 'beginner',
    location: 'Central Park Complex',
    seasonStart: '2024-03-01',
    seasonEnd: '2024-06-30',
    registrationDeadline: '2024-02-15',
    baseFee: 150,
    maxTeams: 12,
    currentTeams: 8,
    status: 'open',
    location_latitude: 40.7829,
    location_longitude: -73.9654,
  },
  {
    id: '2',
    name: 'Competitive Summer League',
    description: 'High-level competitive play for experienced players',
    skillLevel: 'advanced',
    location: 'Riverside Sports Complex',
    seasonStart: '2024-05-01',
    seasonEnd: '2024-08-31',
    registrationDeadline: '2024-04-15',
    baseFee: 250,
    maxTeams: 10,
    currentTeams: 6,
    status: 'open',
    location_latitude: 40.7589,
    location_longitude: -73.9851,
  },
  {
    id: '3',
    name: 'Friday Night Lights',
    description: 'Perfect for company teams and office leagues',
    skillLevel: 'intermediate',
    location: 'Kaufman Sports Complex',
    seasonStart: 'Apr 1',
    seasonEnd: 'Jul 31',
    registrationDeadline: 'Mar 20',
    baseFee: 400,
    maxTeams: 8,
    currentTeams: 8,
    status: 'full',
    location_latitude: 40.7505,
    location_longitude: -73.9934,
  },
  {
    id: '4',
    name: 'Fall Classic League',
    description: 'Traditional softball with autumn vibes',
    skillLevel: 'intermediate',
    location: 'Memorial Field Complex',
    seasonStart: '2024-09-01',
    seasonEnd: '2024-11-30',
    registrationDeadline: '2024-08-15',
    baseFee: 180,
    maxTeams: 14,
    currentTeams: 3,
    status: 'open',
    location_latitude: 40.7282,
    location_longitude: -74.0776,
  },
];

export default function ManagerLeagues() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const userLocation = profile?.location_latitude && profile?.location_longitude
    ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
    : null;

  const filteredAndSortedLeagues = sortByDistance(
    mockLeagues.filter((league) => {
      const matchesSearch = league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           league.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           league.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkillLevel = selectedSkillLevel === 'all' || league.skillLevel === selectedSkillLevel;
      const matchesStatus = selectedStatus === 'all' || league.status === selectedStatus;

      return matchesSearch && matchesSkillLevel && matchesStatus;
    }),
    userLocation,
    profile?.search_radius_miles || undefined
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'full':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'neutral';
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Available Leagues" subtitle="Find and register teams in softball leagues" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <RNTextInput
              style={styles.searchInput}
              placeholder="Search leagues..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Skill Level</Text>
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
              <Text style={styles.filterLabel}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {['all', 'open', 'full', 'closed'].map((status) => (
                    <Button
                      key={status}
                      title={status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      onPress={() => setSelectedStatus(status)}
                      variant={selectedStatus === status ? 'primary' : 'outline'}
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
              {filteredAndSortedLeagues.length} league{filteredAndSortedLeagues.length !== 1 ? 's' : ''} found
            </Text>
            {userLocation && (
              <Text style={styles.sortingNote}>
                Sorted by distance from your location
              </Text>
            )}
          </View>

          <View style={styles.leaguesList}>
            {filteredAndSortedLeagues.map((league) => (
              <Card key={league.id} style={styles.leagueCard}>
                <View style={styles.leagueHeader}>
                  <Text style={styles.leagueName}>{league.name}</Text>
                  <View style={styles.headerRight}>
                    {league.distance !== undefined && (
                      <Text style={styles.distanceText}>
                        {formatDistance(league.distance)}
                      </Text>
                    )}
                    <View style={styles.badges}>
                      <Badge
                        label={league.skillLevel}
                        variant={getSkillLevelBadgeVariant(league.skillLevel)}
                        size="sm"
                      />
                      <Badge
                        label={league.status}
                        variant={getStatusBadgeVariant(league.status)}
                        size="sm"
                      />
                    </View>
                  </View>
                </View>

                <Text style={styles.leagueDescription}>{league.description}</Text>

                <View style={styles.leagueDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{league.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Season:</Text>
                    <Text style={styles.detailValue}>
                      {league.seasonStart} - {league.seasonEnd}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registration:</Text>
                    <Text style={styles.detailValue}>Due by {league.registrationDeadline}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fee:</Text>
                    <Text style={styles.detailValue}>${league.baseFee}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Teams:</Text>
                    <Text style={styles.detailValue}>
                      {league.currentTeams}/{league.maxTeams}
                    </Text>
                  </View>
                </View>

                <Button
                  title={league.status === 'open' ? 'Register Team' : 'Full - Join Waitlist'}
                  onPress={() => {}}
                  variant={league.status === 'open' ? 'primary' : 'outline'}
                  disabled={league.status === 'closed'}
                  style={styles.leagueButton}
                />
              </Card>
            ))}
          </View>
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

  leaguesList: {
    gap: Spacing.md,
  },

  leagueCard: {
    backgroundColor: '#FFFFFF',
  },

  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },

  leagueName: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    flex: 1,
    marginRight: Spacing.sm,
    color: '#000000',
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  distanceText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    color: '#666666',
  },

  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },

  leagueDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
    color: '#333333',
  },

  leagueDetails: {
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
  },

  leagueButton: {
    marginTop: Spacing.sm,
  },
});
