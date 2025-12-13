import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, MessageSquarePlus, CheckCircle } from 'lucide-react-native';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

interface League {
  id: string;
  name: string;
  location: string;
  has_conversation: boolean;
}

export default function AdminScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingConversation, setCreatingConversation] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role !== 'director') {
      Alert.alert(
        'Access Denied',
        'This section is only available to directors.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }
    loadLeagues();
  }, [profile]);

  const loadLeagues = async () => {
    try {
      setLoading(true);

      const { data: leaguesData, error: leaguesError } = await supabase
        .from('leagues')
        .select('id, name, location')
        .order('name');

      if (leaguesError) throw leaguesError;

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('league_id')
        .eq('type', 'league')
        .not('league_id', 'is', null);

      if (conversationsError) throw conversationsError;

      const conversationLeagueIds = new Set(
        conversationsData?.map(c => c.league_id) || []
      );

      const leaguesWithStatus = (leaguesData || []).map(league => ({
        ...league,
        has_conversation: conversationLeagueIds.has(league.id),
      }));

      setLeagues(leaguesWithStatus);
    } catch (error) {
      console.error('Error loading leagues:', error);
      Alert.alert('Error', 'Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async (leagueId: string, leagueName: string) => {
    try {
      setCreatingConversation(leagueId);

      const { data, error } = await supabase.rpc('create_league_conversation', {
        p_league_id: leagueId,
        p_title: `${leagueName} League Chat`,
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        `League conversation created for ${leagueName}. Players can now discover and join this conversation.`
      );

      await loadLeagues();
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', 'Failed to create league conversation');
    } finally {
      setCreatingConversation(null);
    }
  };

  if (profile?.role !== 'director') {
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Admin" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Shield size={32} color={Colors.primary[500]} />
          <Text style={styles.headerTitle}>League Management</Text>
          <Text style={styles.headerSubtitle}>
            Create and manage league conversations for your softball leagues
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>League Conversations</Text>
          <Text style={styles.sectionDescription}>
            Create public conversations for each league so players can discover and join them
            based on their location.
          </Text>

          {leagues.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No leagues found</Text>
            </Card>
          ) : (
            leagues.map(league => (
              <Card key={league.id} style={styles.leagueCard}>
                <View style={styles.leagueHeader}>
                  <View style={styles.leagueInfo}>
                    <Text style={styles.leagueName}>{league.name}</Text>
                    <Text style={styles.leagueLocation}>{league.location}</Text>
                  </View>
                  {league.has_conversation && (
                    <View style={styles.statusBadge}>
                      <CheckCircle size={16} color={Colors.success[500]} />
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  )}
                </View>

                {league.has_conversation ? (
                  <Text style={styles.activeText}>
                    League conversation is active and discoverable
                  </Text>
                ) : (
                  <Button
                    title="Create Conversation"
                    onPress={() => handleCreateConversation(league.id, league.name)}
                    variant="primary"
                    size="sm"
                    icon={<MessageSquarePlus size={18} color={Colors.text.inverse} />}
                    loading={creatingConversation === league.id}
                    disabled={creatingConversation !== null}
                  />
                )}
              </Card>
            ))
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Create a conversation for each league you manage
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Players can discover conversations for leagues near them using the "Find League Chats" feature
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Conversations are public and players can join based on their location preferences
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <Text style={styles.infoText}>
              Use these conversations to announce league updates, field changes, and connect with players
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  headerSection: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.neutral[50],
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.neutral[400],
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.neutral[50],
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    ...Typography.body,
    color: Colors.neutral[400],
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  emptyCard: {
    backgroundColor: Colors.neutral[900],
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.neutral[500],
  },
  leagueCard: {
    backgroundColor: Colors.neutral[900],
    marginBottom: Spacing.md,
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    ...Typography.h4,
    color: Colors.neutral[50],
    marginBottom: Spacing.xs,
  },
  leagueLocation: {
    ...Typography.body,
    color: Colors.neutral[400],
    fontSize: Typography.fontSize.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success[950],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.body,
    fontSize: Typography.fontSize.sm,
    color: Colors.success[500],
    fontFamily: 'Inter-Medium',
  },
  activeText: {
    ...Typography.body,
    color: Colors.neutral[400],
    fontSize: Typography.fontSize.sm,
  },
  infoSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[900],
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: 12,
  },
  infoTitle: {
    ...Typography.h4,
    color: Colors.neutral[50],
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  infoBullet: {
    ...Typography.body,
    color: Colors.primary[500],
    marginRight: Spacing.sm,
    width: 20,
  },
  infoText: {
    ...Typography.body,
    color: Colors.neutral[300],
    flex: 1,
    lineHeight: 22,
  },
});
