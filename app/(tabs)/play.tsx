import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

type PlayerTab = 'leagues' | 'join';
type ManagerTab = 'leagues';

export default function PlayScreen() {
  const { profile } = useAuth();
  const isManager = profile?.role === 'manager';

  const [playerActiveTab, setPlayerActiveTab] = useState<PlayerTab>('leagues');
  const [managerActiveTab, setManagerActiveTab] = useState<ManagerTab>('leagues');

  const LeaguesScreen = require('./leagues').default;
  const JoinScreen = require('./join').default;

  if (isManager) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Play" subtitle="Manage your teams and leagues" showBackButton={false} />
        <View style={styles.content}>
          <LeaguesScreen hideHeader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Play" showBackButton={false} />

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            playerActiveTab === 'leagues' && styles.segmentButtonActive,
          ]}
          onPress={() => setPlayerActiveTab('leagues')}
        >
          <Text
            style={[
              styles.segmentButtonText,
              playerActiveTab === 'leagues' && styles.segmentButtonTextActive,
            ]}
          >
            Browse Leagues
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            playerActiveTab === 'join' && styles.segmentButtonActive,
          ]}
          onPress={() => setPlayerActiveTab('join')}
        >
          <Text
            style={[
              styles.segmentButtonText,
              playerActiveTab === 'join' && styles.segmentButtonTextActive,
            ]}
          >
            Join Team
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {playerActiveTab === 'leagues' ? <LeaguesScreen hideHeader /> : <JoinScreen hideHeader />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[900],
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary[700],
  },
  segmentButtonText: {
    ...Typography.body,
    color: Colors.neutral[400],
    fontFamily: 'Inter-Medium',
  },
  segmentButtonTextActive: {
    color: Colors.neutral[50],
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
});
