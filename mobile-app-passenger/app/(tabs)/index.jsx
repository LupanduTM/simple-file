import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GoCashless</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.promptText}>Ready to ride?</Text>
        <Text style={styles.subText}>Tap below to scan a QR code and pay for your bus fare instantly.</Text>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/scanner')}>
          <Ionicons name="qr-code" size={40} color="white" />
          <Text style={styles.scanButtonText}>Scan & Pay</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promptText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: '80%',
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});