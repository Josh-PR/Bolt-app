import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ManagerIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(manager)/(tabs)');
  }, []);

  return null;
}
