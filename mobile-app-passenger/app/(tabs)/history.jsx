
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';

// Mock data for transaction history
const mockHistory = [
  { id: '1', date: '2025-10-15', route: 'City Market -> Intercity', amount: '15.00', status: 'Completed' },
  { id: '2', date: '2025-10-14', route: 'UNZA -> Arcades', amount: '12.50', status: 'Completed' },
  { id: '3', date: '2025-10-13', route: 'Northmead -> Manda Hill', amount: '10.00', status: 'Completed' },
  { id: '4', date: '2025-10-12', route: 'Intercity -> Chelston', amount: '18.00', status: 'Failed' },
  { id: '5', date: '2025-10-11', route: 'Civic Centre -> East Park', amount: '11.00', status: 'Completed' },
];

const TransactionItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemDate}>{item.date}</Text>
      <Text style={[styles.itemStatus, item.status === 'Failed' && styles.itemStatusFailed]}>
        {item.status}
      </Text>
    </View>
    <Text style={styles.itemRoute}>{item.route}</Text>
    <Text style={styles.itemAmount}>K{item.amount}</Text>
  </View>
);

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>
      <FlatList
        data={mockHistory}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
      />
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
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50', // Green for completed
  },
  itemStatusFailed: {
    color: '#ff4757', // Red for failed
  },
  itemRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.gray,
  },
});
