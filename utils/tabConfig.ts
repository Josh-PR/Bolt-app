import { Chrome as Home, Play, Users, MessageCircle, User, Shield, PlusCircle, LayoutDashboard, Briefcase } from 'lucide-react-native';

export type UserRole = 'player' | 'manager' | 'director';

export interface TabConfig {
  name: string;
  title: string;
  icon: any;
  visibleFor: UserRole[];
  href?: string | null;
}

export const TABS: TabConfig[] = [
  {
    name: 'index',
    title: 'Home',
    icon: Home,
    visibleFor: ['player', 'manager', 'director'],
  },
  {
    name: 'play',
    title: 'Play',
    icon: Play,
    visibleFor: ['player', 'manager'],
  },
  {
    name: 'messages',
    title: 'Messages',
    icon: MessageCircle,
    visibleFor: ['player', 'manager', 'director'],
  },
  {
    name: 'teams',
    title: 'My Teams',
    icon: Users,
    visibleFor: ['player', 'manager'],
  },
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    visibleFor: ['manager'],
  },
  {
    name: 'recruitment',
    title: 'Recruitment',
    icon: Briefcase,
    visibleFor: ['manager'],
  },
  {
    name: 'create',
    title: 'Create',
    icon: PlusCircle,
    visibleFor: ['director'],
  },
  {
    name: 'admin',
    title: 'Admin',
    icon: Shield,
    visibleFor: ['director'],
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: User,
    visibleFor: ['player', 'manager', 'director'],
  },
];

export const getVisibleTabs = (role: UserRole | null): TabConfig[] => {
  if (!role) return [];
  return TABS.filter(tab => tab.visibleFor.includes(role));
};
