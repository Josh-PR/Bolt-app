import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Mail, Phone, CreditCard as Edit, Trash2, UserPlus, Settings } from 'lucide-react-native';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { useAuth } from '../../../../contexts/AuthContext';
import { Colors } from '../../../../constants/Colors';
import { Typography } from '../../../../constants/Typography';
import { Spacing } from '../../../../constants/Spacing';

const mockTeamData = {
  '1': {
    id: '1',
    name: 'Thunder Bolts',
    leagueName: 'Spring Recreation League',
    description: 'A competitive team focused on having fun while winning games.',
    maxPlayers: 15,
    currentPlayers: 12,
    totalFee: 1800.00,
    paidAmount: 1200.00,
    status: 'active',
    managerName: 'Sarah Johnson',
    practiceDay: 'Tuesdays',
    gameDay: 'Saturdays',
    location: 'Central Park Complex',
    players: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '555-0123',
        position: 'Shortstop',
        jerseyNumber: 10,
        paymentStatus: 'paid',
        amountPaid: 150,
        amountDue: 0,
        emergencyContact: 'Jane Smith',
        emergencyPhone: '555-0124',
        joinedDate: '2024-01-15',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        phone: '555-0456',
        position: 'Pitcher',
        jerseyNumber: 7,
        paymentStatus: 'partial',
        amountPaid: 75,
        amountDue: 75,
        emergencyContact: 'Lisa Johnson',
        emergencyPhone: '555-0457',
        joinedDate: '2024-01-20',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      {
        id: '3',
        name: 'Sarah Davis',
        email: 'sarah.davis@email.com',
        phone: '555-0789',
        position: 'Catcher',
        jerseyNumber: 3,
        paymentStatus: 'paid',
        amountPaid: 150,
        amountDue: 0,
        emergencyContact: 'Tom Davis',
        emergencyPhone: '555-0790',
        joinedDate: '2024-01-10',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        phone: '555-0321',
        position: 'First Base',
        jerseyNumber: 21,
        paymentStatus: 'unpaid',
        amountPaid: 0,
        amountDue: 150,
        emergencyContact: 'Maria Rodriguez',
        emergencyPhone: '555-0322',
        joinedDate: '2024-02-01',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
      {
        id: '5',
        name: 'Emily Chen',
        email: 'emily.chen@email.com',
        phone: '555-0654',
        position: 'Left Field',
        jerseyNumber: 15,
        paymentStatus: 'paid',
        amountPaid: 150,
        amountDue: 0,
        emergencyContact: 'David Chen',
        emergencyPhone: '555-0655',
        joinedDate: '2024-01-25',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
    ],
  },
};

export default function TeamDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'roster' | 'payments' | 'settings'>('roster');

  const team = mockTeamData[id as string];
  const isManager = profile?.role === 'manager';

  if (!team) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>Team not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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

  const handleAddPlayer = () => {
    Alert.alert('Add Player', 'Feature coming soon! This will allow you to invite new players to your team.');
  };

  const handleEditPlayer = (playerId: string) => {
    Alert.alert('Edit Player', `Edit player ${playerId} - Feature coming soon!`);
  };

  const handleRemovePlayer = (playerId: string, playerName: string) => {
    Alert.alert(
      'Remove Player',
      `Are you sure you want to remove ${playerName} from the team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => Alert.alert('Success', `${playerName} has been removed from the team.`) },
      ]
    );
  };

  const handleContactPlayer = (player: any) => {
    Alert.alert(
      'Contact Player',
      `Contact ${player.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling', `Calling ${player.phone}`) },
        { text: 'Email', onPress: () => Alert.alert('Email', `Emailing ${player.email}`) },
      ]
    );
  };

  const handlePaymentReminder = (player: any) => {
    Alert.alert(
      'Send Payment Reminder',
      `Send payment reminder to ${player.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => Alert.alert('Success', `Payment reminder sent to ${player.name}`) },
      ]
    );
  };

  const renderRosterTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.currentPlayers}</Text>
            <Text style={styles.statLabel}>Players</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.maxPlayers - team.currentPlayers}</Text>
            <Text style={styles.statLabel}>Open Spots</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.players.filter(p => p.paymentStatus === 'paid').length}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{team.players.filter(p => p.paymentStatus !== 'paid').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </Card>

      {isManager && (
        <Button
          title="Add Player"
          onPress={handleAddPlayer}
          icon={<Plus color={Colors.text.inverse} size={20} />}
          style={styles.addPlayerButton}
        />
      )}

      <View style={styles.playersList}>
        {team.players.map((player) => (
          <Card key={player.id} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <View style={styles.playerInfo}>
                <Image
                  source={{ uri: player.avatar }}
                  style={styles.playerAvatar}
                />
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerPosition}>
                    #{player.jerseyNumber} • {player.position}
                  </Text>
                  <Text style={styles.playerJoinDate}>
                    Joined {new Date(player.joinedDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.playerActions}>
                <Badge
                  label={player.paymentStatus}
                  variant={getPaymentStatusBadgeVariant(player.paymentStatus)}
                  size="sm"
                />
                {isManager && (
                  <View style={styles.managerActions}>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleContactPlayer(player)}
                    >
                      <Mail color={Colors.primary[800]} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleEditPlayer(player.id)}
                    >
                      <Edit color={Colors.secondary[800]} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => handleRemovePlayer(player.id, player.name)}
                    >
                      <Trash2 color={Colors.error} size={16} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Paid:</Text>
                <Text style={styles.paymentValue}>${player.amountPaid}</Text>
              </View>
              {player.amountDue > 0 && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Due:</Text>
                  <Text style={[styles.paymentValue, styles.amountDue]}>${player.amountDue}</Text>
                </View>
              )}
            </View>

            {isManager && (
              <View style={styles.emergencyContact}>
                <Text style={styles.emergencyTitle}>Emergency Contact:</Text>
                <Text style={styles.emergencyDetails}>
                  {player.emergencyContact} • {player.emergencyPhone}
                </Text>
              </View>
            )}

            {isManager && player.amountDue > 0 && (
              <Button
                title="Send Payment Reminder"
                onPress={() => handlePaymentReminder(player)}
                variant="outline"
                size="sm"
                style={styles.reminderButton}
              />
            )}
          </Card>
        ))}
      </View>
    </View>
  );

  const renderPaymentsTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.paymentSummaryCard}>
        <Text style={styles.cardTitle}>Payment Summary</Text>
        <View style={styles.paymentSummaryRow}>
          <Text style={styles.summaryLabel}>Total Expected:</Text>
          <Text style={styles.summaryValue}>${team.totalFee}</Text>
        </View>
        <View style={styles.paymentSummaryRow}>
          <Text style={styles.summaryLabel}>Amount Collected:</Text>
          <Text style={styles.summaryValue}>${team.paidAmount}</Text>
        </View>
        <View style={styles.paymentSummaryRow}>
          <Text style={styles.summaryLabel}>Outstanding:</Text>
          <Text style={[styles.summaryValue, styles.outstanding]}>
            ${team.totalFee - team.paidAmount}
          </Text>
        </View>
      </Card>

      <View style={styles.paymentsList}>
        {team.players.map((player) => (
          <Card key={player.id} style={styles.paymentCard}>
            <View style={styles.paymentPlayerInfo}>
              <Text style={styles.paymentPlayerName}>{player.name}</Text>
              <Badge
                label={player.paymentStatus}
                variant={getPaymentStatusBadgeVariant(player.paymentStatus)}
                size="sm"
              />
            </View>
            <View style={styles.paymentAmounts}>
              <Text style={styles.paymentAmount}>Paid: ${player.amountPaid}</Text>
              {player.amountDue > 0 && (
                <Text style={[styles.paymentAmount, styles.amountDue]}>
                  Due: ${player.amountDue}
                </Text>
              )}
            </View>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Team Settings</Text>
        <View style={styles.settingsList}>
          <Button
            title="Edit Team Info"
            onPress={() => Alert.alert('Coming Soon', 'Edit team information feature coming soon!')}
            variant="ghost"
            style={styles.settingButton}
          />
          <Button
            title="Manage Schedule"
            onPress={() => Alert.alert('Coming Soon', 'Schedule management feature coming soon!')}
            variant="ghost"
            style={styles.settingButton}
          />
          <Button
            title="Team Communications"
            onPress={() => Alert.alert('Coming Soon', 'Team communications feature coming soon!')}
            variant="ghost"
            style={styles.settingButton}
          />
          <Button
            title="Export Roster"
            onPress={() => Alert.alert('Coming Soon', 'Export roster feature coming soon!')}
            variant="ghost"
            style={styles.settingButton}
          />
        </View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={Colors.text.primary} size={24} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.leagueName}>{team.leagueName}</Text>
            </View>
            {isManager && (
              <TouchableOpacity style={styles.settingsIcon}>
                <Settings color={Colors.text.primary} size={24} />
              </TouchableOpacity>
            )}
          </View>

          <Card style={styles.teamInfoCard}>
            <Text style={styles.teamDescription}>{team.description}</Text>
            <View style={styles.teamDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Manager:</Text>
                <Text style={styles.detailValue}>{team.managerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Practice:</Text>
                <Text style={styles.detailValue}>{team.practiceDay}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Games:</Text>
                <Text style={styles.detailValue}>{team.gameDay}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{team.location}</Text>
              </View>
            </View>
          </Card>

          {isManager && (
            <View style={styles.tabContainer}>
              <Button
                title="Roster"
                onPress={() => setSelectedTab('roster')}
                variant={selectedTab === 'roster' ? 'primary' : 'outline'}
                style={styles.tabButton}
              />
              <Button
                title="Payments"
                onPress={() => setSelectedTab('payments')}
                variant={selectedTab === 'payments' ? 'primary' : 'outline'}
                style={styles.tabButton}
              />
              <Button
                title="Settings"
                onPress={() => setSelectedTab('settings')}
                variant={selectedTab === 'settings' ? 'primary' : 'outline'}
                style={styles.tabButton}
              />
            </View>
          )}

          {isManager ? (
            <>
              {selectedTab === 'roster' && renderRosterTab()}
              {selectedTab === 'payments' && renderPaymentsTab()}
              {selectedTab === 'settings' && renderSettingsTab()}
            </>
          ) : (
            renderRosterTab()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.screen.vertical,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },

  headerInfo: {
    flex: 1,
  },

  teamName: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  leagueName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  settingsIcon: {
    padding: Spacing.sm,
  },

  teamInfoCard: {
    marginBottom: Spacing.lg,
  },

  teamDescription: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Spacing.md,
  },

  teamDetails: {
    gap: Spacing.sm,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
  },

  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },

  tabButton: {
    flex: 1,
  },

  tabContent: {
    flex: 1,
  },

  statsCard: {
    marginBottom: Spacing.lg,
  },

  statsRow: {
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
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  addPlayerButton: {
    marginBottom: Spacing.lg,
  },

  playersList: {
    gap: Spacing.md,
  },

  playerCard: {
    padding: Spacing.md,
  },

  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },

  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },

  playerDetails: {
    flex: 1,
  },

  playerName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  playerPosition: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },

  playerJoinDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  playerActions: {
    alignItems: 'flex-end',
  },

  managerActions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },

  actionIcon: {
    padding: Spacing.xs,
    borderRadius: 4,
    backgroundColor: Colors.background.secondary,
  },

  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },

  paymentValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  amountDue: {
    color: Colors.error,
    fontFamily: Typography.fontFamily.semiBold,
  },

  emergencyContact: {
    marginBottom: Spacing.sm,
  },

  emergencyTitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  emergencyDetails: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  reminderButton: {
    marginTop: Spacing.sm,
  },

  paymentSummaryCard: {
    marginBottom: Spacing.lg,
  },

  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  summaryLabel: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
  },

  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
  },

  outstanding: {
    color: Colors.error,
  },

  paymentsList: {
    gap: Spacing.md,
  },

  paymentCard: {
    padding: Spacing.md,
  },

  paymentPlayerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  paymentPlayerName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
  },

  paymentAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  paymentAmount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },

  settingsCard: {
    marginBottom: Spacing.lg,
  },

  settingsList: {
    gap: Spacing.xs,
  },

  settingButton: {
    justifyContent: 'flex-start',
  },

  errorText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
