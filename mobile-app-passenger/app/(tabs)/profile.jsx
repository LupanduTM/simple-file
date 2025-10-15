import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+260 97 123 4567',
};

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

  const handleSignOut = () => {
    // In a real app, you'd clear auth tokens and navigate to the sign-in screen
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color={COLORS.gray} />
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        <ProfileItem icon="mail" label="Email" value={user.email} />
        <ProfileItem icon="call" label="Phone" value={user.phone} />

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
  header: {
    padding: 20,
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