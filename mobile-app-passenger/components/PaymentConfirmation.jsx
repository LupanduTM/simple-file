import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PaymentConfirmation({ amount, onConfirm, onCancel }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>
      <Text style={styles.amount}>K{amount}</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignSelf: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 24
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.error,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  }
});
