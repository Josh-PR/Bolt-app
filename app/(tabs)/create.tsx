import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Trophy, Calendar, Plus, MapPin, Users, DollarSign } from 'lucide-react-native';
import { Header } from '../../components/ui/Header';
import { LeagueCreationModal } from '../../components/ui/LeagueCreationModal';
import { TournamentCreationModal } from '../../components/ui/TournamentCreationModal';
import { useColors } from '../../hooks/useColors';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { Database } from '../../types/database';

type League = Database['public']['Tables']['leagues']['Row'];
type Tournament = Database['public']['Tables']['tournaments']['Row'];

export default function CreateScreen() {
  const colors = useColors();
  const { profile, user } = useAuth();
  const [leagueModalVisible, setLeagueModalVisible] = useState(false);
  const [tournamentModalVisible, setTournamentModalVisible] = useState(false);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  if (profile?.role !== 'director') {
    router.replace('/');
    return null;
  }

  const fetchData = async () => {
    try {
      if (user?.id?.startsWith('demo-')) {
        const mockLeagues: League[] = [
          {
            id: 'mock-league-1',
            name: 'Summer 2024 Basketball League',
            description: 'A competitive summer league for basketball teams. Games held every Tuesday and Thursday evening.',
            skill_level: 'intermediate',
            location: 'Downtown Sports Complex',
            location_latitude: 40.7128,
            location_longitude: -74.0060,
            season_start: '2024-06-01',
            season_end: '2024-08-31',
            registration_deadline: '2024-05-15',
            base_fee: 150.00,
            max_teams: 12,
            current_teams: 8,
            status: 'open',
            director_id: user.id,
            created_at: new Date('2024-04-01').toISOString(),
            updated_at: new Date('2024-04-01').toISOString(),
          },
          {
            id: 'mock-league-2',
            name: 'Fall Recreational League',
            description: 'Casual league for players of all skill levels. Focus on fun and fitness!',
            skill_level: 'beginner',
            location: 'Community Center',
            location_latitude: 40.7589,
            location_longitude: -73.9851,
            season_start: '2024-09-01',
            season_end: '2024-11-30',
            registration_deadline: '2024-08-20',
            base_fee: 100.00,
            max_teams: 8,
            current_teams: 8,
            status: 'full',
            director_id: user.id,
            created_at: new Date('2024-05-15').toISOString(),
            updated_at: new Date('2024-05-15').toISOString(),
          },
        ];

        const mockTournaments: Tournament[] = [
          {
            id: 'mock-tournament-1',
            name: '3-on-3 Championship',
            description: 'Fast-paced 3v3 basketball tournament with cash prizes. Single-day knockout competition.',
            skill_level: 'competitive',
            location: 'City Arena',
            start_date: '2024-07-15',
            end_date: '2024-07-15',
            registration_deadline: '2024-07-01',
            entry_fee: 75.00,
            max_teams: 16,
            current_teams: 12,
            format: 'single_elimination',
            prize_pool: 2500.00,
            status: 'open',
            director_id: user.id,
            created_at: new Date('2024-05-01').toISOString(),
            updated_at: new Date('2024-05-01').toISOString(),
          },
          {
            id: 'mock-tournament-2',
            name: 'Winter Classic Tournament',
            description: 'Annual winter tournament featuring top teams from around the region.',
            skill_level: 'advanced',
            location: 'Riverside Sports Complex',
            start_date: '2024-12-10',
            end_date: '2024-12-12',
            registration_deadline: '2024-11-25',
            entry_fee: 125.00,
            max_teams: 12,
            current_teams: 4,
            format: 'double_elimination',
            prize_pool: 5000.00,
            status: 'open',
            director_id: user.id,
            created_at: new Date('2024-05-20').toISOString(),
            updated_at: new Date('2024-05-20').toISOString(),
          },
        ];

        setLeagues(mockLeagues);
        setTournaments(mockTournaments);
      } else {
        const [leaguesResponse, tournamentsResponse] = await Promise.all([
          supabase
            .from('leagues')
            .select('*')
            .eq('director_id', user?.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('tournaments')
            .select('*')
            .eq('director_id', user?.id)
            .order('created_at', { ascending: false }),
        ]);

        if (leaguesResponse.data) {
          setLeagues(leaguesResponse.data);
        }
        if (tournamentsResponse.data) {
          setTournaments(tournamentsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLeagueSuccess = () => {
    setLeagueModalVisible(false);
    fetchData();
  };

  const handleTournamentSuccess = () => {
    setTournamentModalVisible(false);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#10b981';
      case 'full':
        return '#f59e0b';
      case 'closed':
      case 'cancelled':
        return '#ef4444';
      case 'in_progress':
        return '#3b82f6';
      case 'completed':
        return '#6b7280';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
      <Header title="Create" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Director Dashboard</Text>
          <Text style={styles.subtitle}>Create and manage your leagues and tournaments</Text>
        </View>

        <View style={styles.createSection}>
          <TouchableOpacity
            style={[styles.createCard, styles.leagueCard]}
            onPress={() => setLeagueModalVisible(true)}
          >
            <View style={styles.createIconContainer}>
              <Plus color="#ffffff" size={24} strokeWidth={2.5} />
            </View>
            <View style={styles.createContent}>
              <Calendar color="#10b981" size={28} strokeWidth={2} />
              <Text style={styles.createCardTitle}>Create League</Text>
              <Text style={styles.createCardSubtitle}>Set up a seasonal league</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createCard, styles.tournamentCard]}
            onPress={() => setTournamentModalVisible(true)}
          >
            <View style={styles.createIconContainer}>
              <Plus color="#ffffff" size={24} strokeWidth={2.5} />
            </View>
            <View style={styles.createContent}>
              <Trophy color="#f59e0b" size={28} strokeWidth={2} />
              <Text style={styles.createCardTitle}>Create Tournament</Text>
              <Text style={styles.createCardSubtitle}>Organize a competition</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Calendar color="#10b981" size={24} strokeWidth={2} />
            <Text style={styles.sectionTitle}>My Leagues</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{leagues.length}</Text>
            </View>
          </View>

          {leagues.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar color="#475569" size={48} strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No leagues created yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first league to get started
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {leagues.map((league) => (
                <View key={league.id} style={styles.listItem}>
                  <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle}>{league.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(league.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: getStatusColor(league.status) }]}
                      >
                        {league.status}
                      </Text>
                    </View>
                  </View>

                  {league.description && (
                    <Text style={styles.listItemDescription} numberOfLines={2}>
                      {league.description}
                    </Text>
                  )}

                  <View style={styles.listItemDetails}>
                    <View style={styles.detailItem}>
                      <MapPin color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>{league.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Users color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {league.current_teams}/{league.max_teams} teams
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>${league.base_fee}</Text>
                    </View>
                  </View>

                  <View style={styles.listItemFooter}>
                    <Text style={styles.footerText}>
                      {formatDate(league.season_start)} - {formatDate(league.season_end)}
                    </Text>
                    <Text style={[styles.footerText, styles.skillLevel]}>
                      {league.skill_level}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Trophy color="#f59e0b" size={24} strokeWidth={2} />
            <Text style={styles.sectionTitle}>My Tournaments</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tournaments.length}</Text>
            </View>
          </View>

          {tournaments.length === 0 ? (
            <View style={styles.emptyState}>
              <Trophy color="#475569" size={48} strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No tournaments created yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first tournament to get started
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {tournaments.map((tournament) => (
                <View key={tournament.id} style={styles.listItem}>
                  <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle}>{tournament.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(tournament.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: getStatusColor(tournament.status) }]}
                      >
                        {tournament.status}
                      </Text>
                    </View>
                  </View>

                  {tournament.description && (
                    <Text style={styles.listItemDescription} numberOfLines={2}>
                      {tournament.description}
                    </Text>
                  )}

                  <View style={styles.listItemDetails}>
                    <View style={styles.detailItem}>
                      <MapPin color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>{tournament.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Users color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>
                        {tournament.current_teams}/{tournament.max_teams} teams
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign color="#64748b" size={14} strokeWidth={2} />
                      <Text style={styles.detailText}>${tournament.entry_fee}</Text>
                    </View>
                  </View>

                  <View style={styles.listItemFooter}>
                    <Text style={styles.footerText}>
                      {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                    </Text>
                    <Text style={[styles.footerText, styles.skillLevel]}>
                      {tournament.skill_level}
                    </Text>
                  </View>

                  {tournament.prize_pool && (
                    <View style={styles.prizePoolBanner}>
                      <Trophy color="#f59e0b" size={16} strokeWidth={2} />
                      <Text style={styles.prizePoolText}>
                        Prize Pool: ${tournament.prize_pool.toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <LeagueCreationModal
        visible={leagueModalVisible}
        onClose={() => setLeagueModalVisible(false)}
        onSuccess={handleLeagueSuccess}
      />

      <TournamentCreationModal
        visible={tournamentModalVisible}
        onClose={() => setTournamentModalVisible(false)}
        onSuccess={handleTournamentSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 12,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  createSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  createCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  leagueCard: {
    backgroundColor: '#059669',
  },
  tournamentCard: {
    backgroundColor: '#d97706',
  },
  createIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createContent: {
    alignItems: 'flex-start',
    gap: 8,
  },
  createCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  createCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  badge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  itemsList: {
    gap: 12,
  },
  listItem: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  listItemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  skillLevel: {
    textTransform: 'capitalize',
    fontWeight: '600',
    color: '#94a3b8',
  },
  prizePoolBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  prizePoolText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
});
