import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.itemContainer}>
    <Ionicons name={icon} size={24} color={COLORS.primary} />
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  const handleEditProfile = () => {
    // Navigate to an edit profile screen (to be created)
    router.push('/profile/edit-profile');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteUser();
            router.replace('/sign-in');
          } catch (error) {
            Alert.alert("Error", "Failed to delete account. Please try again later.");
          }
        }}
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Could not load profile.</Text>
        <TouchableOpacity onPress={() => router.replace('/sign-in')}>
          <Text>Go to Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color={COLORS.gray} />
          <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
        </View>

        <ProfileItem icon="mail" label="Email" value={user.email} />
        <ProfileItem icon="call" label="Phone" value={user.phoneNumber} />

        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#ff4757" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemTextContainer: {
    marginLeft: 15,
  },
  itemLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  itemValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 15,
  },
  deleteButton: {
    backgroundColor: 'white',
  },
  deleteButtonText: {
    color: COLORS.danger,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff47571a',
    borderRadius: 10,
    padding: 15,
    marginTop: 30,
  },
  signOutButtonText: {
    color: '#ff4757',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});