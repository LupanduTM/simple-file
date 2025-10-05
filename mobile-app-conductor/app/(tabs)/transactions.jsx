
import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data - assuming you have a mix of dates
const transactions = [
  { id: '1', amount: 'K5.00', date: '2025-09-02 10:30 AM', status: 'Success' },
  { id: '2', amount: 'K12.50', date: '2025-09-02 11:05 AM', status: 'Success' },
  { id: '3', amount: 'K7.00', date: '2025-09-01 09:15 AM', status: 'Failed' },
  { id: '4', amount: 'K5.00', date: '2025-09-01 11:20 AM', status: 'Success' },
  { id: '5', amount: 'K8.00', date: '2025-08-31 04:40 PM', status: 'Success' },
];

// Helper to group transactions by date
const groupTransactionsByDate = (transactions) => {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.date.split(' ')[0]; // Get date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  // Formatting the title as requested
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };


  return Object.keys(grouped).map(date => ({
    title: getFormattedDate(date),
    data: grouped[date],
  }));
};

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <Ionicons name="cash-outline" size={24} color="#4A5568" style={styles.icon} />
    <View style={styles.transactionDetails}>
      <Text style={styles.amount}>{item.amount}</Text>
      <Text style={styles.date}>{item.date.split(' ').slice(1).join(' ')}</Text>
    </View>
    <TouchableOpacity onPress={() => alert(`Delete transaction ${item.id}?`)}>
      <Ionicons name="close" size={22} color="#718096" />
    </TouchableOpacity>
  </View>
);

const TransactionsScreen = () => {
  const sections = groupTransactionsByDate(transactions);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7', // Original light background
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c', // Original dark text
    marginVertical: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568', // Dark gray for headers
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a202c',
  },
  date: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
});

export default TransactionsScreen;
