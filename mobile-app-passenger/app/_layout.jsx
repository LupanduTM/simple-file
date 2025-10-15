import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import { useEffect } from "react";
import { View } from "react-native";

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = segments[0] === 'sign-in' || segments[0] === 'sign-up';

    if (user && isPublicRoute) {
      // User is logged in but on a public route, redirect to home.
      router.replace("/(tabs)");
    } else if (!user && !isPublicRoute) {
      // User is not logged in and on a protected route, redirect to sign-in.
      router.replace("/sign-in");
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <View />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="scanner"
        options={{
          presentation: "modal",
          title: "Scan to Pay",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}