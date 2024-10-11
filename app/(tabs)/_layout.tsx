import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function LayoutTab() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#777',
                tabBarStyle: { backgroundColor: '#FCC' },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="eventos"
                options={{
                    title: "Eventos",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="party-popper" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="criarEventos"
                options={{
                    title: "Criar Eventos",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="add-circle-outline" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="user-circle" size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
