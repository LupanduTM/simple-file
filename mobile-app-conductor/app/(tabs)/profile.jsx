import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { homeStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import userApiClient from "../../services/userApiClient";

const ProfileScreen = () => {
  const router = useRouter();
  const [conductorProfile, setConductorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConductorProfile = async () => {
      try {
        setLoading(true);
        console.log("Requesting URL:", userApiClient.getUri({ url: "/api/v1/users/email/testme@example.com" }));
        const response = await userApiClient.get(
          "/api/v1/users/email/testme@example.com"
        );
        setConductorProfile(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch profile. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConductorProfile();
  }, []);

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync("userToken");
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <View style={homeStyles.content}>
        <View style={homeStyles.header}>
          <Text style={homeStyles.title}>Profile</Text>
        </View>

        <View style={homeStyles.card}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          ) : (
            conductorProfile && (
              <View style={{width: '100%'}}>
                <View style={styles.profileInfoContainer}>
                  <Text style={styles.label}>First Name:</Text>
                  <Text style={styles.value}>
                    {conductorProfile.firstName}
                  </Text>
                </View>
                <View style={styles.profileInfoContainer}>
                  <Text style={styles.label}>Last Name:</Text>
                  <Text style={styles.value}>{conductorProfile.lastName}</Text>
                </View>
                <View style={styles.profileInfoContainer}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{conductorProfile.email}</Text>
                </View>
                <View style={styles.profileInfoContainer}>
                  <Text style={styles.label}>Phone Number:</Text>
                  <Text style={styles.value}>
                    {conductorProfile.phoneNumber}
                  </Text>
                </View>
              </View>
            )
          )}
          <TouchableOpacity
            style={[homeStyles.generateButton, {marginTop: 20}]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            <Text style={homeStyles.generateButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default ProfileScreen;
