import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Users, Trophy, Calendar, Clock, MapPin, FileText, Shirt, ShoppingBag, UserCheck, UserX, User } from 'lucide-react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

// Mock team data
const mockTeamData = {
  '1': {
    id: '1',
    name: 'Thunder Bolts',
    leagueName: 'Spring Recreation League',
    logo: 'https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?auto=compress&cs=tinysrgb&w=80',
    description: 'A competitive team focused on having fun while winning games.',
    seasonRecord: { wins: 15, losses: 8, ties: 1 },
    nextGame: {
      id: 'game-1',
      opponent: 'Lightning Strikes',
      date: '2024-01-15',
      time: '19:00',
      venue: 'Central Park Baseball Complex',
      address: '1234 Central Park West, New York, NY 10025',
    },
    rsvpStatus: [
      { id: '1', name: 'John Smith', status: 'going', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { id: '2', name: 'Sarah Davis', status: 'going', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { id: '3', name: 'Mike Johnson', status: 'not-going', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { id: '4', name: 'Emily Chen', status: 'going', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50' },
      { id: '5', name: 'Alex Rodriguez', status: 'pending', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50' },
    ],
    chatMessages: [
      { id: '1', sender: 'Sarah Davis', message: 'Great practice today everyone! 💪', timestamp: '2024-01-12T14:30:00Z', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40' },
      { id: '2', sender: 'Mike Johnson', message: 'Don\'t forget to bring your gloves for tomorrow\'s game!', timestamp: '2024-01-12T16:45:00Z', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=40' },
      { id: '3', sender: 'John Smith', message: 'I\'ll be there early to help set up the field', timestamp: '2024-01-12T18:20:00Z', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40' },
      { id: '4', sender: 'Emily Chen', message: 'Can someone give me a ride to the game?', timestamp: '2024-01-12T19:15:00Z', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40' },
    ],
  },
};

export default function TeamDashboard() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockTeamData['1']?.chatMessages || []);
  const scrollViewRef = useRef<ScrollView>(null);

  const team = mockTeamData[id as string];

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  const formatGameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatGameTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: profile?.full_name || 'You',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        avatar: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40',
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const getRSVPCounts = () => {
    const going = team.rsvpStatus.filter(p => p.status === 'going').length;
    const notGoing = team.rsvpStatus.filter(p => p.status === 'not-going').length;
    const pending = team.rsvpStatus.filter(p => p.status === 'pending').length;
    
    return { going, notGoing, pending };
  };

  const rsvpCounts = getRSVPCounts();

  const navigationItems = [
    { id: 'rules', title: 'Rules', icon: FileText, color: Colors.widgets.blue },
    { id: 'jerseys', title: 'Jerseys', icon: Shirt, color: Colors.widgets.purple },
    { id: 'shop', title: 'Shop', color: Colors.widgets.orange, icon: ShoppingBag },
    { id: 'players', title: 'Players', icon: Users, color: Colors.widgets.green },
  ];

  const handleNavigation = (itemId: string) => {
    Alert.alert('Navigation', `${itemId.charAt(0).toUpperCase() + itemId.slice(1)} - Feature coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={Colors.text.inverse} size={24} />
            </TouchableOpacity>
            <View style={styles.teamInfo}>
              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <View style={styles.teamDetails}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.leagueName}>{team.leagueName}</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* RSVP Status for Upcoming Game */}
            <Card style={styles.rsvpCard}>
              <View style={styles.rsvpHeader}>
                <Text style={styles.sectionTitle}>Next Game RSVP</Text>
                <View style={styles.rsvpCounts}>
                  <View style={styles.rsvpCount}>
                    <UserCheck color={Colors.success} size={12} />
                    <Text style={styles.rsvpCountText}>{rsvpCounts.going}</Text>
                  </View>
                  <View style={styles.rsvpCount}>
                    <UserX color={Colors.error} size={12} />
                    <Text style={styles.rsvpCountText}>{rsvpCounts.notGoing}</Text>
                  </View>
                  <View style={styles.rsvpCount}>
                    <User color={Colors.warning} size={12} />
                    <Text style={styles.rsvpCountText}>{rsvpCounts.pending}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>vs {team.nextGame.opponent}</Text>
                <View style={styles.gameDetail}>
                  <Calendar color={Colors.primary[800]} size={10} />
                  <Text style={styles.gameDetailText}>{formatGameDate(team.nextGame.date)}</Text>
                </View>
                <View style={styles.gameDetail}>
                  <Clock color={Colors.primary[800]} size={10} />
                  <Text style={styles.gameDetailText}>{formatGameTime(team.nextGame.time)} EST</Text>
                </View>
                <View style={styles.gameDetail}>
                  <MapPin color={Colors.primary[800]} size={10} />
                  <Text style={styles.gameDetailText}>{team.nextGame.venue}</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rsvpList}>
                {team.rsvpStatus.map((player) => (
                  <View key={player.id} style={styles.rsvpPlayer}>
                    <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                    <Text style={styles.playerName}>{player.name.split(' ')[0]}</Text>
                    <View style={[
                      styles.rsvpStatusDot,
                      { backgroundColor: 
                        player.status === 'going' ? Colors.success :
                        player.status === 'not-going' ? Colors.error :
                        Colors.warning
                      }
                    ]} />
                  </View>
                ))}
              </ScrollView>
            </Card>

            {/* Season Record */}
            <Card style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Trophy color={Colors.primary[800]} size={16} />
                <Text style={styles.sectionTitle}>Season Record</Text>
              </View>
              <View style={styles.recordStats}>
                <View style={styles.recordStat}>
                  <Text style={styles.recordNumber}>{team.seasonRecord.wins}</Text>
                  <Text style={styles.recordLabel}>Wins</Text>
                </View>
                <View style={styles.recordSeparator} />
                <View style={styles.recordStat}>
                  <Text style={styles.recordNumber}>{team.seasonRecord.losses}</Text>
                  <Text style={styles.recordLabel}>Losses</Text>
                </View>
                <View style={styles.recordSeparator} />
                <View style={styles.recordStat}>
                  <Text style={styles.recordNumber}>{team.seasonRecord.ties}</Text>
                  <Text style={styles.recordLabel}>Ties</Text>
                </View>
              </View>
              <Text style={styles.winPercentage}>
                Win Rate: {((team.seasonRecord.wins / (team.seasonRecord.wins + team.seasonRecord.losses + team.seasonRecord.ties)) * 100).toFixed(1)}%
              </Text>
            </Card>

            {/* Navigation Icons */}
            <Card style={styles.navigationCard}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <View style={styles.navigationGrid}>
                {navigationItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.navItem, { backgroundColor: item.color }]}
                    onPress={() => handleNavigation(item.id)}
                  >
                    <item.icon color="white" size={20} strokeWidth={2} />
                    <Text style={styles.navItemText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* Team Chat */}
            <Card style={styles.chatCard}>
              <Text style={styles.sectionTitle}>Team Chat</Text>
              <ScrollView 
                ref={scrollViewRef}
                style={styles.chatMessages}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message) => (
                  <View key={message.id} style={styles.messageContainer}>
                    <Image source={{ uri: message.avatar }} style={styles.messageAvatar} />
                    <View style={styles.messageContent}>
                      <View style={styles.messageHeader}>
                        <Text style={styles.messageSender}>{message.sender}</Text>
                        <Text style={styles.messageTime}>{formatMessageTime(message.timestamp)}</Text>
                      </View>
                      <Text style={styles.messageText}>{message.message}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Card>
          </ScrollView>

          {/* Chat Input */}
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              placeholderTextColor={Colors.text.disabled}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { opacity: newMessage.trim() ? 1 : 0.5 }]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send color={Colors.text.inverse} size={16} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  keyboardView: {
    flex: 1,
  },
  
  content: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
  },
  
  teamDetails: {
    flex: 1,
  },
  
  teamName: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  
  leagueName: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.inverse,
  },
  
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.screen.horizontal,
  },
  
  rsvpCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  
  rsvpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
  },
  
  rsvpCounts: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  rsvpCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  rsvpCountText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
  },
  
  gameInfo: {
    marginBottom: Spacing.md,
  },
  
  gameTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  
  gameDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  gameDetailText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  
  rsvpList: {
    maxHeight: 80,
  },
  
  rsvpPlayer: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 60,
  },
  
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  
  playerName: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  
  rsvpStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  recordCard: {
    marginBottom: Spacing.md,
  },
  
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  recordStat: {
    alignItems: 'center',
    flex: 1,
  },
  
  recordNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary[800],
    marginBottom: 2,
  },
  
  recordLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
  },
  
  recordSeparator: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.light,
  },
  
  winPercentage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  
  navigationCard: {
    marginBottom: Spacing.md,
  },
  
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  
  navItem: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  navItemText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.inverse,
    marginTop: 4,
    textAlign: 'center',
  },
  
  chatCard: {
    marginBottom: Spacing.md,
    flex: 1,
  },
  
  chatMessages: {
    maxHeight: 300,
    marginBottom: Spacing.md,
  },
  
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  
  messageContent: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    padding: Spacing.sm,
    borderRadius: 12,
  },
  
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  messageSender: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text.primary,
  },
  
  messageTime: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  
  messageText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.screen.horizontal,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: '#000000',
  },
  
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.inverse,
    backgroundColor: Colors.background.secondary,
    maxHeight: 100,
    marginRight: Spacing.sm,
  },
  
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  errorText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  backButton: {
    marginBottom: Spacing.lg,
  },
});