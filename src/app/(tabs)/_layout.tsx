import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { BarraPestanas } from '../../ui/componentes/BarraPestanas';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <BarraPestanas {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(inicio)"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="(historial)"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
