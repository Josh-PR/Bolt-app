import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Header } from '../../components/ui/Header';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

// Mock data for demonstration
const mockTeams = [
  {
    id: '1',
    name: 'Thunder Bolts',
    leagueName: 'Spring Recreation League',
    role: 'Player',
    status: 'active',
    paymentStatus: 'paid',
    amountPaid: 150,
    amountDue: 0,
    nextGame: {
      date: '2024-01-15',
      time: '7:00 PM',
      opponent: 'Lightning Strikes',
      location: 'Central Park Field A',
    },
    season: {
      gamesPlayed: 8,
      totalGames: 12,
      wins: 5,
      losses: 3,
    },
  },
  {
    id: '2',
    name: 'Home Runners',
    leagueName: 'Corporate League',
    role: 'Player',
    status: 'active',
    paymentStatus: 'partial',
    amountPaid: 100,
    amountDue: 100,
    nextGame: {
      date: '2024-01-18',
      time: '6:30 PM',
      opponent: 'Base Crushers',
      location: 'Downtown Field 2',
    },
    season: {
      gamesPlayed: 6,
      totalGames: 10,
      wins: 4,
      losses: 2,
    },
  },
  {
    id: '3',
    name: 'Weekend Warriors',
    leagueName: 'Fall Classic League',
    role: 'Player',
    status: 'pending',
    paymentStatus: 'unpaid',
    amountPaid: 0,
    amountDue: 180,
    nextGame: null,
    season: {
      gamesPlayed: 0,
      totalGames: 14,
      wins: 0,
      losses: 0,
    },
  },
];

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const router = useRouter();

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'unpaid':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getTeamStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handlePayment = (teamId: string, amount: number) => {
    Alert.alert(
      'Make Payment',
      `Pay $${amount} for this team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => Alert.alert('Success', 'Payment processed successfully!') },
      ]
    );
  };

  const handleLeaveTeam = (teamId: string) => {
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave this team? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => Alert.alert('Success', 'You have left the team.') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Teams" subtitle="Manage your teams, payments, and game schedules" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Teams List */}
          <View style={styles.teamsList}>
            {mockTeams.map((team) => (
              <Card key={team.id} style={styles.teamCard}>
                <View style={styles.teamHeader}>
                  <View style={styles.teamHeaderContent}>
                    <Image
                      source={{ uri: 'https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=80' }}
                      style={styles.teamImage}
                    />
                    <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.leagueName}>{team.leagueName}</Text>
                    </View>
                  </View>
                  <View style={styles.badges}>
                    <Badge
                      label={team.status}
                      variant={getTeamStatusBadgeVariant(team.status)}
                      size="sm"
                    />
                    <Badge
                      label={team.paymentStatus}
                      variant={getPaymentStatusBadgeVariant(team.paymentStatus)}
                      size="sm"
                    />
                  </View>
                </View>

                {/* Payment Status */}
                <View style={styles.paymentSection}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.sectionTitle}>Players Paid</Text>
                    <Text style={styles.paymentAmount}>
                      {team.season.gamesPlayed} / {team.season.totalGames}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={(team.season.gamesPlayed / team.season.totalGames) * 100}
                    style={styles.paymentProgress}
                  />
                  {team.season.gamesPlayed < team.season.totalGames && (
                    <Text style={styles.paymentDue}>
                      {team.season.totalGames - team.season.gamesPlayed} players remaining
                    </Text>
                  )}
                </View>

                {/* Next Game */}
                {team.nextGame && (
                  <View style={styles.nextGameSection}>
                    <Text style={styles.sectionTitle}>Next Game</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameOpponent}>vs {team.nextGame.opponent}</Text>
                      <Text style={styles.gameDateTime}>
                        {team.nextGame.date} at {team.nextGame.time}
                      </Text>
                      <Text style={styles.gameLocation}>{team.nextGame.location}</Text>
                    </View>
                  </View>
                )}

                {/* Season Stats */}
                <View style={styles.seasonSection}>
                  <Text style={styles.sectionTitle}>Season Stats</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{team.season.gamesPlayed}</Text>
                      <Text style={styles.statLabel}>Games</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{team.season.wins}</Text>
                      <Text style={styles.statLabel}>Wins</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{team.season.losses}</Text>
                      <Text style={styles.statLabel}>Losses</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {team.season.wins + team.season.losses > 0 
                          ? ((team.season.wins / (team.season.wins + team.season.losses)) * 100).toFixed(0) + '%'
                          : '0%'
                        }
                      </Text>
                      <Text style={styles.statLabel}>Win Rate</Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsSection}>
                  {team.amountDue > 0 && (
                    <Button
                      title={`Pay $${team.amountDue}`}
                      onPress={() => handlePayment(team.id, team.amountDue)}
                      style={styles.actionButton}
                    />
                  )}
                  
                  <View style={styles.secondaryActions}>
                    <Button
                      title="View Details"
                     onPress={() => router.push(`/team/${team.id}` as any)}
                      variant="outline"
                      style={styles.secondaryButton}
                    />
                    <Button
                      title="Leave Team"
                      onPress={() => handleLeaveTeam(team.id)}
                      variant="ghost"
                      style={styles.secondaryButton}
                    />
                  </View>
                </View>
              </Card>
            ))}
          </View>

          {/* Empty State */}
          {mockTeams.length === 0 && (
            <Card style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Teams Yet</Text>
              <Text style={styles.emptyStateDescription}>
                You haven't joined any teams yet. Browse available leagues and teams to get started!
              </Text>
              <Button
                title="Find Teams"
                onPress={() => router.push('/(tabs)/join')}
                style={styles.emptyStateButton}
              />
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
  
  teamsList: {
    gap: Spacing.lg,
  },
  
  teamCard: {
    backgroundColor: '#FFFFFF',
  },
  
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  
  teamHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  teamImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.md,
    backgroundColor: Colors.neutral[200],
  },
  
  teamInfo: {
    flex: 1,
  },
  
  teamName: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
  },
  
  leagueName: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  
  paymentSection: {
    marginBottom: Spacing.md,
  },
  
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
  },
  
  paymentAmount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
  },
  
  paymentProgress: {
    height: 6,
    marginBottom: Spacing.xs,
  },
  
  paymentDue: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
  },
  
  nextGameSection: {
    marginBottom: Spacing.md,
  },
  
  gameInfo: {
    marginTop: Spacing.xs,
  },
  
  gameOpponent: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
  },
  
  gameDateTime: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
  },
  
  gameLocation: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
  },
  
  seasonSection: {
    marginBottom: Spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
  },
  
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
  },
  
  actionsSection: {
    marginTop: Spacing.md,
  },
  
  actionButton: {
    marginBottom: Spacing.sm,
  },
  
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  secondaryButton: {
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
  },
  
  emptyStateDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.lg,
  },
  
  emptyStateButton: {
    paddingHorizontal: Spacing.xl,
  },
});