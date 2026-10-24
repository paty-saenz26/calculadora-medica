import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colores, fuentes } from '../../ui/tema';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSobreCristal,
        tabBarLabelStyle: { fontFamily: fuentes.media, fontSize: 12 },
        tabBarStyle: { backgroundColor: colores.fondo, borderTopColor: colores.borde },
      }}
    >
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
