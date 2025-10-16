
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../services/paymentService';

export default function ConfirmPaymentScreen() {
  const { user } = useAuth();
  console.log(user);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.scannedData) {
      try {
        const data = JSON.parse(params.scannedData);
        setPaymentData(data);
      } catch (e) {
        setError('Invalid QR Code. Please scan a valid GoCashless QR code.');
      }
    } else {
      setError('No payment data found.');
    }
  }, [params.scannedData]);

  const handleConfirmPayment = async () => {
    if (!paymentData) return;
    setIsLoading(true);
    setError(null);

    const paymentRequest = {
      userId: user.id,
      conductorId: paymentData.conductorId,
      routeId: paymentData.routeId,
      originStopId: paymentData.originStopId,
      destinationStopId: paymentData.destinationStopId,
      amount: paymentData.fareAmount,
      currency: 'ZMW',
      paymentMethod: 'MOBILE_MONEY',
    };

    try {
      const result = await initiatePayment(paymentRequest);
      if (result.status === 'SUCCESS') {
        alert('Payment Successful!');
        router.replace('/(tabs)');
      } else {
        throw new Error(result.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={handleCancel}>
            <Text style={styles.btnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!paymentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Confirmation</Text>
        </View>

        <View style={styles.confirmationCard}>
          <MaterialCommunityIcons name="qrcode-scan" size={40} color={COLORS.primary} style={{ alignSelf: 'center', marginBottom: 15 }} />
          <Text style={styles.scanSuccessText}>QR Code Scanned Successfully</Text>

          <View style={styles.conductorInfo}>
            <Text style={styles.conductorLabel}>Conductor</Text>
            <Text style={styles.conductorName}>{paymentData.conductorName || 'N/A'}</Text>
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentQuestion}>
              Do you agree to make transfer{' '}
              <Text style={styles.amount}>K{paymentData.fareAmount.toFixed(2)}</Text> to <Text style={styles.phoneNumber}>{paymentData.phoneNumber}</Text>?
            </Text>

            <View style={styles.tripInfo}>
              <View style={styles.tripDetail}>
                <Text style={styles.tripLabel}>From</Text>
                <Text style={styles.tripValue}>{paymentData.originStopName || 'N/A'}</Text>
              </View>
              <View style={styles.tripDetail}>
                <Text style={styles.tripLabel}>To</Text>
                <Text style={styles.tripValue}>{paymentData.destinationStopName || 'N/A'}</Text>
              </View>
              <View style={styles.tripDetail}>
                <Text style={styles.tripLabel}>Fare</Text>
                <Text style={styles.tripValue}>K{paymentData.fareAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: 20 }} />}
          {error && <Text style={[styles.errorText, { marginBottom: 20 }]}>{error}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={handleCancel} disabled={isLoading}>
              <Text style={[styles.btnText, styles.btnTextCancel]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={handleConfirmPayment} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.8)" style={{ marginRight: 5 }} />
          <Text style={styles.securityNoteText}>Your payment is secured with end-to-end encryption</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#764ba2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  confirmationCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  scanSuccessText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
  },
  conductorInfo: {
    marginBottom: 25,
    alignItems: 'center',
  },
  conductorLabel: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  conductorName: {
    color: '#333',
    fontSize: 22,
    fontWeight: '700',
  },
  paymentDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  paymentQuestion: {
    color: '#333',
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: 'center',
    marginBottom: 15,
  },
  amount: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tripDetail: {
    alignItems: 'center',
    flex: 1,
  },
  tripLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  tripValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnConfirm: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  btnCancel: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff4757',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  btnTextCancel: {
    color: '#ff4757',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  securityNoteText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  errorText: {
    color: '#ff4757',
    textAlign: 'center',
    fontSize: 16,
  },
});
