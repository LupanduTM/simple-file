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
  ScrollView,
} from "react-native";
import { homeStyles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import userApiClient from "../services/userApiClient";

const SignUpScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !username || !phoneNumber || !firstName || !lastName) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      await userApiClient.post("/api/v1/users/register/passenger", {
        email,
        password,
        username,
        phoneNumber,
        firstName,
        lastName,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView contentContainerStyle={homeStyles.content}>
        <View style={homeStyles.header}>
          <Text style={homeStyles.title}>Create Account,</Text>
          <Text style={homeStyles.subtitle}>Sign up to get started.</Text>
        </View>

        <View style={homeStyles.card}>
          <Text style={homeStyles.cardTitle}>Sign Up</Text>

          <Text style={homeStyles.label}>First Name</Text>
          <TextInput
            style={homeStyles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={homeStyles.label}>Last Name</Text>
          <TextInput
            style={homeStyles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={homeStyles.label}>Username</Text>
          <TextInput
            style={homeStyles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={homeStyles.label}>Email</Text>
          <TextInput
            style={homeStyles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={homeStyles.label}>Phone Number</Text>
          <TextInput
            style={homeStyles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={homeStyles.label}>Password</Text>
          <TextInput
            style={homeStyles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={COLORS.textLight}
          />

          <TouchableOpacity
            style={homeStyles.generateButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={24} color={COLORS.white} />
                <Text style={homeStyles.generateButtonText}>Sign Up</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/sign-in")}>
            <Text style={{ textAlign: 'center', marginTop: 15, color: COLORS.primary }}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;