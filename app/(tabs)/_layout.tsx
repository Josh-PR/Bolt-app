import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useChat } from '../../contexts/ChatContext';
import { useVisibleTabs } from '../../hooks/useVisibleTabs';
import { TabConfig } from '../../utils/tabConfig';

export default function TabLayout() {
  const { totalUnreadCount } = useChat();
  const visibleTabs = useVisibleTabs();

  const renderTabScreen = (tab: TabConfig) => {
    const Icon = tab.icon;

    return (
      <Tabs.Screen
        key={tab.name}
        name={tab.name}
        options={{
          title: tab.title,
          href: tab.href ?? undefined,
          tabBarBadge: tab.name === 'messages' && totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 12,
          paddingTop: 8,
          justifyContent: 'space-around',
          paddingHorizontal: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        sceneStyle: {
          backgroundColor: '#000000',
        },
      }}
    >
      {visibleTabs.map(tab => renderTabScreen(tab))}
    </Tabs>
  );
}