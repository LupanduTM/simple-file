import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { COLORS } from '../../constants/colors';

import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const handleScanPress = async () => {
    if (!permission) {
      // Permissions are still loading
      return;
    }

    // Check current status
    if (permission.granted) {
      router.push('/scanner');
      return;
    }

    // If not granted, request permission
    const { status } = await requestPermission();

    if (status === 'granted') {
      router.push('/scanner');
    } else {
      // Handle the case where permission is denied
      Alert.alert(
        'Permission Required',
        'Camera access is required to scan QR codes. Please grant permission in your phone settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome Back, {user.name}!</Text>
          <Text style={styles.subHeaderText}>Ready to pay for your trip?</Text>
        </View>

        <View style={styles.scanCard}>
          <Text style={styles.cardTitle}>Scan & Pay</Text>
          <Text style={styles.cardInstructions}>
            Tap the button below to open the scanner. Point it at a conductor's QR code to complete your payment.
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
            <Ionicons name="qr-code-outline" size={80} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  scanCard: {
    backgroundColor: COLORS.card,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  cardInstructions: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  scanButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.border,
  },
});
