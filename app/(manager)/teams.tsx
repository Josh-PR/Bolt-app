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

// Mock data for manager's teams
const mockManagerTeams = [
  {
    id: '1',
    name: 'Thunder Bolts',
    leagueName: 'Spring Recreation League',
    role: 'Manager',
    status: 'active',
    paymentStatus: 'partial',
    totalFee: 1800,
    paidAmount: 1200,
    amountDue: 600,
    currentPlayers: 12,
    maxPlayers: 15,
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
    role: 'Manager',
    status: 'active',
    paymentStatus: 'paid',
    totalFee: 2000,
    paidAmount: 2000,
    amountDue: 0,
    currentPlayers: 14,
    maxPlayers: 16,
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
    role: 'Manager',
    status: 'draft',
    paymentStatus: 'unpaid',
    totalFee: 1800,
    paidAmount: 0,
    amountDue: 1800,
    currentPlayers: 8,
    maxPlayers: 15,
    nextGame: null,
    season: {
      gamesPlayed: 0,
      totalGames: 14,
      wins: 0,
      losses: 0,
    },
  },
];

export default function ManagerTeams() {
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
      case 'draft':
        return 'warning';
      case 'inactive':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handleManageTeam = (teamId: string) => {
    router.push(`/team/${teamId}` as any);
  };

  const handleCreateTeam = () => {
    Alert.alert('Create Team', 'Team creation feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Teams" subtitle="Manage your teams, rosters, and team operations" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Create Team Button */}
          <Button
            title="Create New Team"
            onPress={handleCreateTeam}
            style={styles.createTeamButton}
          />

          {/* Teams List */}
          <View style={styles.teamsList}>
            {mockManagerTeams.map((team) => (
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

                {/* Team Stats */}
                <View style={styles.teamStatsSection}>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{team.currentPlayers}</Text>
                      <Text style={styles.statLabel}>Players</Text>
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

                {/* Payment Status */}
                <View style={styles.paymentSection}>
                  <View style={styles.paymentHeader}>
                    <Text style={styles.sectionTitle}>Team Payments</Text>
                    <Text style={styles.paymentAmount}>
                      ${team.paidAmount} / ${team.totalFee}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={(team.paidAmount / team.totalFee) * 100}
                    style={styles.paymentProgress}
                  />
                  {team.amountDue > 0 && (
                    <Text style={styles.paymentDue}>
                      ${team.amountDue} outstanding
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

                {/* Actions */}
                <View style={styles.actionsSection}>
                  <Button
                    title="Manage Team"
                    onPress={() => handleManageTeam(team.id)}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            ))}
          </View>

          {/* Empty State */}
          {mockManagerTeams.length === 0 && (
            <Card style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Teams Yet</Text>
              <Text style={styles.emptyStateDescription}>
                You haven't created any teams yet. Create your first team to get started!
              </Text>
              <Button
                title="Create Team"
                onPress={handleCreateTeam}
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
  
  createTeamButton: {
    marginBottom: Spacing.lg,
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
    color: '#000000',
  },
  
  leagueName: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
  },
  
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  
  teamStatsSection: {
    marginBottom: Spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: '#000000',
  },
  
  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
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
    color: '#000000',
  },
  
  paymentAmount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#000000',
  },
  
  paymentProgress: {
    height: 6,
    marginBottom: Spacing.xs,
  },
  
  paymentDue: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
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
    color: '#000000',
  },
  
  gameDateTime: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
  },
  
  gameLocation: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
  },
  
  actionsSection: {
    marginTop: Spacing.md,
  },
  
  actionButton: {
    marginBottom: Spacing.sm,
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
    marginBottom: Spacing.lg,
    color: '#666666',
  },
  
  emptyStateButton: {
    paddingHorizontal: Spacing.xl,
  },
});