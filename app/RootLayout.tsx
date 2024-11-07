import { Stack } from "expo-router";
import UserProvider from "./context/userContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" /> {/* Layout de abas */}
        <Stack.Screen name="eventos" /> {/* Tela de eventos */}
        <Stack.Screen name="visualizarEvento" /> {/* Tela de visualização do evento */}
        <Stack.Screen name="edicaoEvento" /> {/* Tela de edição do evento */}
      </Stack>
    </UserProvider>
  );
}
