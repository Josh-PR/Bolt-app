import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput as RNTextInput, Alert, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Header } from '../../components/ui/Header';
import { TextInput } from '../../components/ui/TextInput';
import { useAuth } from '../../contexts/AuthContext';
import { sortByDistance, formatDistance } from '../../utils/location';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const freeAgentSchema = z.object({
  timeFrame: z.enum(['1-day', '1-week', '2-weeks', '1-month', '3-months']),
  preferredPositions: z.array(z.string()).min(1, 'At least one position is required'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  availability: z.array(z.string()).min(1, 'At least one availability option is required'),
});

type FreeAgentForm = z.infer<typeof freeAgentSchema>;

// Mock data for demonstration
const mockTeams = [
  {
    id: '1',
    name: 'Thunder Bolts',
    leagueName: 'Spring Recreation League',
    managerName: 'Sarah Johnson',
    description: 'Looking for enthusiastic players who love to have fun and play competitive softball.',
    skillLevel: 'intermediate',
    openPositions: ['Left Field', 'Pitcher'],
    currentPlayers: 12,
    maxPlayers: 15,
    teamFee: 150,
    location: 'Central Park Complex',
    practiceDay: 'Tuesdays',
    gameDay: 'Saturdays',
    status: 'recruiting',
    location_latitude: 40.7829,
    location_longitude: -73.9654,
  },
  {
    id: '2',
    name: 'Base Crushers',
    leagueName: 'Competitive Summer League',
    managerName: 'Mike Chen',
    description: 'Serious competitive team seeking skilled players for tournament play.',
    skillLevel: 'advanced',
    openPositions: ['Catcher', 'Second Base'],
    currentPlayers: 14,
    maxPlayers: 16,
    teamFee: 40,
    location: 'Riverside Sports Complex',
    practiceDay: 'Thursdays',
    gameDay: 'Sundays',
    status: 'recruiting',
    location_latitude: 40.7589,
    location_longitude: -73.9851,
  },
  {
    id: '3',
    name: 'Office Sluggers',
    leagueName: 'Corporate League',
    managerName: 'Jennifer Davis',
    description: 'Corporate team looking for coworkers and friends to join our team.',
    skillLevel: 'beginner',
    openPositions: ['Right Field', 'Third Base', 'First Base'],
    currentPlayers: 8,
    maxPlayers: 15,
    teamFee: 40,
    location: 'Downtown Athletic Center',
    practiceDay: 'Wednesdays',
    gameDay: 'Fridays',
    status: 'recruiting',
    location_latitude: 40.7505,
    location_longitude: -73.9934,
  },
];

const mockFreeAgents = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    experienceLevel: 'intermediate',
    preferredPositions: ['Shortstop', 'Second Base'],
    bio: 'Played college softball, looking for a competitive team.',
    availability: ['Weekend Afternoons', 'Weekend Evenings'],
    location: 'Downtown area',
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
];

interface JoinProps {
  hideHeader?: boolean;
}

export default function Join({ hideHeader = false }: JoinProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'teams' | 'free-agents'>('teams');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [showFreeAgentModal, setShowFreeAgentModal] = useState(false);
  const [submittingFreeAgent, setSubmittingFreeAgent] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('1-month');

  // Available softball positions
  const availablePositions = [
    'Pitcher',
    'Catcher',
    'First Base',
    'Second Base',
    'Third Base',
    'Shortstop',
    'Left Field',
    'Center Field',
    'Right Field',
    'Utility',
  ];

  // Available time slots
  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons', 
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
    'Flexible Schedule',
  ];

  // Time frame options
  const timeFrameOptions = [
    { value: '1-day', label: '1 Day' },
    { value: '1-week', label: '1 Week' },
    { value: '2-weeks', label: '2 Weeks' },
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FreeAgentForm>({
    resolver: zodResolver(freeAgentSchema),
    defaultValues: {
      timeFrame: '1-month',
      preferredPositions: [],
      timeFrame: '1-month',
      experienceLevel: 'intermediate',
      bio: '',
      availability: [],
    },
  });

  // Get user location for distance sorting
  const userLocation = profile?.location_latitude && profile?.location_longitude 
    ? { latitude: profile.location_latitude, longitude: profile.location_longitude }
    : null;

  const filteredAndSortedTeams = sortByDistance(
    mockTeams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           team.leagueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           team.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSkillLevel = selectedSkillLevel === 'all' || team.skillLevel === selectedSkillLevel;
      
      return matchesSearch && matchesSkillLevel;
    }),
    userLocation,
    profile?.search_radius_miles || undefined
  );

  const filteredAndSortedFreeAgents = sortByDistance(
    mockFreeAgents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.preferredPositions.some(pos => pos.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           agent.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSkillLevel = selectedSkillLevel === 'all' || agent.experienceLevel === selectedSkillLevel;
      
      return matchesSearch && matchesSkillLevel;
    }),
    userLocation,
    profile?.search_radius_miles || undefined
  );

  const filteredTeams = filteredAndSortedTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.leagueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkillLevel = selectedSkillLevel === 'all' || team.skillLevel === selectedSkillLevel;
    
    return matchesSearch && matchesSkillLevel;
  });

  const filteredFreeAgents = filteredAndSortedFreeAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.preferredPositions.some(pos => pos.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         agent.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkillLevel = selectedSkillLevel === 'all' || agent.experienceLevel === selectedSkillLevel;
    
    return matchesSearch && matchesSkillLevel;
  });

  const handleJoinTeam = (teamId: string) => {
    Alert.alert(
      'Join Team',
      'Are you sure you want to request to join this team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => Alert.alert('Success', 'Your request has been sent to the team manager!') },
      ]
    );
  };

  const handleContactFreeAgent = (agentId: string) => {
    Alert.alert(
      'Contact Player',
      'Your contact information will be shared with this player.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Contact', onPress: () => Alert.alert('Success', 'Your contact information has been sent!') },
      ]
    );
  };

  const handleBecomeFreeAgent = () => {
    setSelectedPositions([]);
    setSelectedAvailability([]);
    setSelectedTimeFrame('1-month');
    setShowFreeAgentModal(true);
  };

  const onSubmitFreeAgent = async (data: FreeAgentForm) => {
    setSubmittingFreeAgent(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success!', 
        'You have been added to the free agent list. Teams looking for players will be able to contact you.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowFreeAgentModal(false);
              reset();
              setSelectedPositions([]);
              setSelectedAvailability([]);
              setSelectedTimeFrame('1-month');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit free agent application. Please try again.');
    } finally {
      setSubmittingFreeAgent(false);
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

  const content = (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Become Free Agent Call-to-Action */}
          <Card style={styles.becomeAgentCard}>
            <View style={styles.becomeAgentContent}>
              <Text style={styles.becomeAgentTitle}>Looking for a Team?</Text>
              <Text style={styles.becomeAgentDescription}>
                Temporarily register as a free agent and let teams find you! Teams looking for players will be able to contact you directly.
              </Text>
              <Button
                title="Free Agent Form"
                onPress={handleBecomeFreeAgent}
                style={styles.becomeAgentButton}
              />
            </View>
          </Card>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Button
              title="Find a Team"
              onPress={() => setActiveTab('teams')}
              variant={activeTab === 'teams' ? 'primary' : 'outline'}
              style={styles.tabButton}
            />
            <Button
              title="Find a Free Agent"
              onPress={() => setActiveTab('free-agents')}
              variant={activeTab === 'free-agents' ? 'primary' : 'outline'}
              style={styles.tabButton}
            />
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <RNTextInput
              style={styles.searchInput}
              placeholder={activeTab === 'teams' ? 'Search teams...' : 'Search players...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.disabled}
            />
          </View>

          {/* Skill Level Filter */}
          <View style={styles.filterContainer}>
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

          {/* Results Count */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {activeTab === 'teams' ? filteredAndSortedTeams.length : filteredAndSortedFreeAgents.length} {activeTab === 'teams' ? 'team' : 'player'}{(activeTab === 'teams' ? filteredAndSortedTeams.length : filteredAndSortedFreeAgents.length) !== 1 ? 's' : ''} found
            </Text>
            {userLocation && (
              <Text style={styles.sortingNote}>
                Sorted by distance from your location
              </Text>
            )}
          </View>

          {/* Content */}
          {activeTab === 'teams' ? (
            <View style={styles.itemsList}>
              {filteredAndSortedTeams.map((team) => (
                <Card key={team.id} style={styles.teamCard}>
                  <View style={styles.teamHeader}>
                    <View style={styles.teamNameContainer}>
                      <Text style={styles.teamName}>{team.name}</Text>
                      {team.distance !== undefined && (
                        <Text style={styles.distanceText}>
                          {formatDistance(team.distance)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.headerRight}>
                      <Badge
                        label={team.skillLevel}
                        variant={getSkillLevelBadgeVariant(team.skillLevel)}
                        size="sm"
                      />
                    </View>
                  </View>

                  <Text style={styles.leagueName}>{team.leagueName}</Text>
                  <Text style={styles.teamDescription}>{team.description}</Text>

                  <View style={styles.teamDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Manager:</Text>
                      <Text style={styles.detailValue}>{team.managerName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Open Positions:</Text>
                      <Text style={styles.detailValue}>{team.openPositions.join(', ')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Players:</Text>
                      <Text style={styles.detailValue}>
                        {team.currentPlayers}/{team.maxPlayers}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Player Fee:</Text>
                      <Text style={styles.detailValue}>${team.teamFee}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Practice:</Text>
                      <Text style={styles.detailValue}>{team.practiceDay}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Games:</Text>
                      <Text style={styles.detailValue}>{team.gameDay}</Text>
                    </View>
                  </View>

                  <Button
                    title="Request to Join"
                    onPress={() => handleJoinTeam(team.id)}
                    style={styles.actionButton}
                  />
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.itemsList}>
              {filteredAndSortedFreeAgents.map((agent) => (
                <Card key={agent.id} style={styles.agentCard}>
                  <View style={styles.agentHeader}>
                    <View style={styles.agentNameContainer}>
                      <Text style={styles.agentName}>{agent.name}</Text>
                      {agent.distance !== undefined && (
                        <Text style={styles.distanceText}>
                          {formatDistance(agent.distance)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.headerRight}>
                      <Badge
                        label={agent.experienceLevel}
                        variant={getSkillLevelBadgeVariant(agent.experienceLevel)}
                        size="sm"
                      />
                    </View>
                  </View>

                  <Text style={styles.agentBio}>{agent.bio}</Text>

                  <View style={styles.agentDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Preferred Positions:</Text>
                      <Text style={styles.detailValue}>{agent.preferredPositions.join(', ')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Availability:</Text>
                      <Text style={styles.detailValue}>{Array.isArray(agent.availability) ? agent.availability.join(', ') : agent.availability}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Location:</Text>
                      <Text style={styles.detailValue}>{agent.location}</Text>
                    </View>
                  </View>

                  <Button
                    title="Contact Player"
                    onPress={() => handleContactFreeAgent(agent.id)}
                    style={styles.actionButton}
                  />
                </Card>
              ))}
            </View>
          )}

          {/* Free Agent Registration Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showFreeAgentModal}
            onRequestClose={() => setShowFreeAgentModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Become a Free Agent</Text>
                  <Button
                    title="✕"
                    onPress={() => setShowFreeAgentModal(false)}
                    variant="ghost"
                    size="sm"
                    style={styles.closeButton}
                  />
                </View>

                <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                  <Controller
                    control={control}
                    name="timeFrame"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Active Free Agent Duration</Text>
                        <Text style={styles.timeFrameHint}>How long do you want to be listed as an active free agent?</Text>
                        <View style={styles.timeFrameGrid}>
                          {timeFrameOptions.map((option) => (
                            <Button
                              key={option.value}
                              title={option.label}
                              onPress={() => {
                                setSelectedTimeFrame(option.value);
                                onChange(option.value);
                              }}
                              variant={selectedTimeFrame === option.value ? 'primary' : 'outline'}
                              size="sm"
                              style={styles.timeFrameButton}
                            />
                          ))}
                        </View>
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="preferredPositions"
                    render={({ field: { onChange } }) => (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Preferred Positions</Text>
                        <Text style={styles.positionHint}>Select all positions you're comfortable playing</Text>
                        <View style={styles.positionGrid}>
                          {availablePositions.map((position) => (
                            <Button
                              key={position}
                              title={position}
                              onPress={() => {
                                const newPositions = selectedPositions.includes(position)
                                  ? selectedPositions.filter(p => p !== position)
                                  : [...selectedPositions, position];
                                setSelectedPositions(newPositions);
                                onChange(newPositions);
                              }}
                              variant={selectedPositions.includes(position) ? 'primary' : 'outline'}
                              size="sm"
                              style={styles.positionButton}
                            />
                          ))}
                        </View>
                        {errors.preferredPositions && (
                          <Text style={styles.errorText}>{errors.preferredPositions.message}</Text>
                        )}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="experienceLevel"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Experience Level</Text>
                        <View style={styles.radioGroup}>
                          {[
                            { value: 'beginner', label: 'Beginner' },
                            { value: 'intermediate', label: 'Intermediate' },
                            { value: 'advanced', label: 'Advanced' },
                          ].map((option) => (
                            <Button
                              key={option.value}
                              title={option.label}
                              onPress={() => onChange(option.value)}
                              variant={value === option.value ? 'primary' : 'outline'}
                              size="sm"
                              style={styles.radioButton}
                            />
                          ))}
                        </View>
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Bio"
                        placeholder="Tell teams about your softball experience, what you're looking for, etc."
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.bio?.message}
                        multiline
                        numberOfLines={4}
                        containerStyle={styles.bioContainer}
                        inputStyle={styles.bioInput}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="availability"
                    render={({ field: { onChange } }) => (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Availability</Text>
                        <Text style={styles.availabilityHint}>Select all times you're available to play</Text>
                        <View style={styles.availabilityGrid}>
                          {availabilityOptions.map((option) => (
                            <Button
                              key={option}
                              title={option}
                              onPress={() => {
                                const newAvailability = selectedAvailability.includes(option)
                                  ? selectedAvailability.filter(a => a !== option)
                                  : [...selectedAvailability, option];
                                setSelectedAvailability(newAvailability);
                                onChange(newAvailability);
                              }}
                              variant={selectedAvailability.includes(option) ? 'primary' : 'outline'}
                              size="sm"
                              style={styles.availabilityButton}
                            />
                          ))}
                        </View>
                        {errors.availability && (
                          <Text style={styles.errorText}>{errors.availability.message}</Text>
                        )}
                      </View>
                    )}
                  />
                </ScrollView>

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowFreeAgentModal(false)}
                    variant="outline"
                    style={styles.modalCancelButton}
                  />
                  <Button
                    title="Submit Application"
                    onPress={handleSubmit(onSubmitFreeAgent)}
                    loading={submittingFreeAgent}
                    style={styles.modalSubmitButton}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Find Your Team" subtitle="Join existing teams or connect with free agents" />
      {content}
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
  
  header: {
    marginBottom: Spacing.xl,
  },
  
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    color: '#FFFFFF',
  },
  
  subtitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    color: '#FFFFFF',
  },
  
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  
  tabButton: {
    flex: 1,
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
  
  filterContainer: {
    marginBottom: Spacing.lg,
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
  
  itemsList: {
    gap: Spacing.md,
  },
  
  teamCard: {
    backgroundColor: '#FFFFFF',
  },
  
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  teamNameContainer: {
    flex: 1,
  },
  
  teamName: {
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
  
  leagueName: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.sm,
    color: '#333333',
  },
  
  teamDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
    color: '#333333',
  },
  
  teamDetails: {
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
  
  actionButton: {
    marginTop: Spacing.sm,
  },
  
  agentCard: {
    backgroundColor: '#FFFFFF',
  },
  
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  agentNameContainer: {
    flex: 1,
  },
  
  agentName: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#000000',
  },
  
  agentBio: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
    color: '#333333',
  },
  
  agentDetails: {
    marginBottom: Spacing.md,
  },
  
  becomeAgentCard: {
    marginBottom: Spacing.lg,
  },
  
  becomeAgentContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  
  becomeAgentTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  
  becomeAgentDescription: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
    color: '#FFFFFF',
  },
  
  becomeAgentButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.screen.horizontal,
    paddingBottom: Spacing.screen.vertical,
    maxHeight: '85%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: '#000000',
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalForm: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  
  inputContainer: {
    marginBottom: Spacing.md,
  },
  
  label: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    marginBottom: Spacing.xs,
    color: '#000000',
  },
  
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  
  radioButton: {
    flex: 1,
    minWidth: 100,
  },
  
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  
  modalCancelButton: {
    flex: 1,
  },
  
  modalSubmitButton: {
    flex: 2,
  },
  
  positionHint: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.sm,
    color: '#333333',
  },
  
  positionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  
  positionButton: {
    minWidth: 80,
    paddingHorizontal: Spacing.sm,
  },
  
  availabilityHint: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.sm,
    color: '#333333',
  },
  
  availabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  
  availabilityButton: {
    marginBottom: Spacing.xs,
  },
  
  errorText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#FF6B6B',
    marginTop: Spacing.xs,
  },
  
  timeFrameHint: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.sm,
    color: '#333333',
  },
  
  timeFrameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  
  timeFrameButton: {
    minWidth: 80,
    paddingHorizontal: Spacing.sm,
  },
  
  bioContainer: {
    marginBottom: Spacing.md,
  },
  
  bioInput: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary[800],
    borderWidth: 2,
    color: Colors.primary[800],
    borderRadius: 8,
    padding: Spacing.md,
    minHeight: 100,
  },
});