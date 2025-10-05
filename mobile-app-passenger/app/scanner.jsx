import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import QrScanner from '../components/QrScanner';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const router = useRouter();

  const handleCodeScanned = (scannedData) => {
    router.back();
    Alert.alert(
      'QR Code Scanned!',
      `Data: ${scannedData}`,
      [
        {
          text: 'OK',
          onPress: () => console.log('Payment flow would start here.'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <QrScanner onCodeScanned={handleCodeScanned} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close-circle" size={32} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* This container groups the marker and the text below it */}
        <View style={styles.contentContainer}>
          <View style={styles.scanMarker} />
          <Text style={styles.footerText}>
            Point your camera at a QR code to pay
          </Text>
        </View>

        {/* This empty view helps with vertical alignment */}
        <View />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between', // Pushes header to top, empty view to bottom
    alignItems: 'center',
  },
  header: {
    width: '100%',
    padding: 20,
    alignItems: 'flex-end',
    marginTop: 20, // For status bar
  },
  closeButton: {
    padding: 10,
  },
  contentContainer: {
    alignItems: 'center',
  },
  scanMarker: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.white,
    borderStyle: 'dashed',
  },
  footerText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 20, // This adds space below the scan marker
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});