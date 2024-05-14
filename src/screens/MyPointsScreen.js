import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import api from '../services/api';
import {useSelector} from 'react-redux';
import LoadingIndicator from '../components/LoadingIndicator';
import {THEME_COLOR, THEME_COLOR_2} from '../assets/colors/colors';

const MyPointsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/mydata/myPoints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(response.data.transactions);
        setTotalPoints(response.data.totalPoints);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const renderTransactionItem = ({item}) => (
    <View style={styles.transactionItem}>
      <View style={styles.dateAmountContainer}>
        <Text style={styles.dateText}>
          {new Date(item.transactionDate).toLocaleString()}
        </Text>
        <Text
          style={[
            styles.amountText,
            item.transactionType === 'ADDED'
              ? styles.amountAdded
              : styles.amountRemoved,
          ]}>
          {item.transactionType === 'ADDED'
            ? `+${item.amount}`
            : `-${item.amount}`}
        </Text>
      </View>
      <Text style={styles.commentsText}>{item.comments}</Text>
    </View>
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.totalPoints}>Total Points</Text>
        <Text style={styles.totalPointsValue}>{totalPoints}</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransactionItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLOR,
    padding: 10,
  },
  headerContainer: {
    backgroundColor: THEME_COLOR_2,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalPoints: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  totalPointsValue: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountAdded: {
    color: '#2ECC71',
  },
  amountRemoved: {
    color: '#E74C3C',
  },
  commentsText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default MyPointsScreen;
