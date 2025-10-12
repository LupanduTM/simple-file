import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="scanner"
          options={{
            presentation: 'modal',
            title: 'Scan to Pay',
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}