import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { homeStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

const SignInScreen = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <View style={homeStyles.content}>
        <View style={homeStyles.header}>
          <Text style={homeStyles.title}>Welcome Back,</Text>
          <Text style={homeStyles.subtitle}>Sign in to your account.</Text>
        </View>

        <View style={homeStyles.card}>
          <Text style={homeStyles.cardTitle}>Sign In</Text>

          <View style={{ marginBottom: 15 }}>
            <Text style={homeStyles.label}>Email</Text>
            <TextInput
              style={homeStyles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={homeStyles.label}>Password</Text>
            <TextInput
              style={homeStyles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={homeStyles.generateButton}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={24} color={COLORS.white} />
                <Text style={homeStyles.generateButtonText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/sign-up")}>
            <Text style={{ textAlign: 'center', marginTop: 15, color: COLORS.primary }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;