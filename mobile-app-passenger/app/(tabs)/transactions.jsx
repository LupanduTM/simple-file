import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Mock transaction data - replace with actual data from your API
const mockTransactions = [
  {
    id: '1',
    description: 'Bus Fare to City Market',
    amount: -15.00,
    date: '2025-09-02T10:30:00Z',
    type: 'debit',
  },
  {
    id: '2',
    description: 'Bus Fare to Manda Hill',
    amount: -12.50,
    date: '2025-09-01T14:00:00Z',
    type: 'debit',
  },
  {
    id: '3',
    description: 'Top-up from Airtel',
    amount: 100.00,
    date: '2025-08-31T09:00:00Z',
    type: 'credit',
  },
  {
    id: '4',
    description: 'Bus Fare to UNZA',
    amount: -10.00,
    date: '2025-08-30T18:45:00Z',
    type: 'debit',
  },
];

const TransactionItem = ({ item }) => {
  const isDebit = item.type === 'debit';
  const amountColor = isDebit ? COLORS.text : '#2E7D32'; // Using a green for credit
  const iconName = isDebit ? 'arrow-down-outline' : 'arrow-up-outline';

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.iconContainer, { backgroundColor: isDebit ? '#FFEBEE' : '#E8F5E9' }]}>
        <Ionicons name={isDebit ? 'bus-outline' : 'wallet-outline'} size={24} color={amountColor} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, { color: amountColor }]}>
          {isDebit ? '-' : '+'} K{Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const EmptyListComponent = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="receipt-outline" size={60} color={COLORS.textLight} />
    <Text style={styles.emptyText}>No transactions yet.</Text>
    <Text style={styles.emptySubText}>Your recent payments will appear here.</Text>
  </View>
);

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <FlatList
          data={mockTransactions}
          renderItem={({ item }) => <TransactionItem item={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  amountContainer: {
    marginLeft: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
  },
});
