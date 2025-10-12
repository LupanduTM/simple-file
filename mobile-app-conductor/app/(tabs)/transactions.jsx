
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import { getConductorTransactions } from '../../services/historyService';

// Helper to group transactions by date
const groupTransactionsByDate = (transactions) => {
  if (!transactions) return [];

  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.transactionTime.split('T')[0]; // Get date part from ISO string
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

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

  return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map(date => ({
    title: getFormattedDate(date),
    data: grouped[date],
  }));
};

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <Ionicons 
      name={item.status === 'COMPLETED' ? "checkmark-circle-outline" : "close-circle-outline"} 
      size={32} 
      color={item.status === 'COMPLETED' ? '#28a745' : '#dc3545'} 
      style={styles.icon} 
    />
    <View style={styles.transactionDetails}>
      <Text style={styles.amount}>K{item.amount.toFixed(2)}</Text>
      <Text style={styles.detailText}>From: {item.originStopName}</Text>
      <Text style={styles.detailText}>To: {item.destinationStopName}</Text>
      <Text style={styles.date}>{new Date(item.transactionTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
    <View style={styles.statusContainer}>
        <Text style={[styles.status, item.status === 'COMPLETED' ? styles.success : styles.failed]}>
            {item.status}
        </Text>
    </View>
  </View>
);

const TransactionsScreen = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchTransactions = async () => {
        try {
          setLoading(true);
          const data = await getConductorTransactions(user.id);
          setTransactions(data);
          setError(null);
        } catch (e) {
          setError('Failed to fetch transaction history.');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [user]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const sections = groupTransactionsByDate(transactions);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      ) : (
        <View style={styles.center}>
            <Text style={styles.emptyText}>No transactions found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    marginVertical: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  emptyText: {
    color: '#4A5568',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  detailText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  status: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
  },
  success: {
      color: '#28a745',
  },
  failed: {
      color: '#dc3545',
  }
});

export default TransactionsScreen;
