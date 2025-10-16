import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getPassengerTransactions } from '../../services/historyService';

const TransactionItem = ({ item }) => {
  // Assuming all transactions for a passenger are debits for now
  const isDebit = true; 
  const amountColor = COLORS.text;

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
        <Ionicons name={'bus-outline'} size={24} color={amountColor} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.descriptionText}>{`Fare to ${item.destinationStopName}`}</Text>
        <Text style={styles.dateText}>{new Date(item.transactionTime).toLocaleString()}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, { color: amountColor }]}>
          - K{Math.abs(item.amount).toFixed(2)}
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
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchTransactions = async () => {
        try {
          setLoading(true);
          const data = await getPassengerTransactions(user.id);
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
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>
        <FlatList
          data={transactions}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
      color: 'red',
      fontSize: 16,
  }
});
