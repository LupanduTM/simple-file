import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { homeStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import { updatePassword } from "../../services/userApiClient";

const ProfileScreen = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  const handleChangePassword = async (newPassword) => {
    try {
      await updatePassword(user.id, newPassword);
      setModalVisible(false);
      Alert.alert("Success", "Password updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update password. Please try again.");
    }
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
          ) : user ? (
            <View style={{width: '100%'}}>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.label}>First Name:</Text>
                <Text style={styles.value}>
                  {user.firstName}
                </Text>
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.label}>Last Name:</Text>
                <Text style={styles.value}>{user.lastName}</Text>
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
              <View style={styles.profileInfoContainer}>
                <Text style={styles.label}>Phone Number:</Text>
                <Text style={styles.value}>
                  {user.phoneNumber}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: "red", textAlign: "center" }}>Failed to fetch profile. Please try again later.</Text>
          )}
          <TouchableOpacity
            style={[homeStyles.generateButton, {marginTop: 20}]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.white} />
            <Text style={homeStyles.generateButtonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            <Text style={homeStyles.generateButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ChangePasswordModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleChangePassword}
      />
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
