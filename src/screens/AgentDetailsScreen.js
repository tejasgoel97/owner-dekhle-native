import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import api from '../services/api';
import formatDate from '../services/formatDate';
import {THEME_COLOR} from '../assets/colors/colors';

const AgentDetailsScreen = ({route}) => {
  const {agentId} = route.params;
  const [agentDetails, setAgentDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const detailsResponse = await api.get(
          `/agent/agentDetails/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const transactionsResponse = await api.get(
          `/agent/agentScanners/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (detailsResponse.data.success) {
          setAgentDetails(detailsResponse.data.agent);
        }
        if (transactionsResponse.data.success) {
          setTransactions(transactionsResponse.data.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText}>Agent Details</Text>
        <Text style={styles.detailText}>Name: {agentDetails?.name}</Text>
        <Text style={styles.detailText}>
          Father's Name: {agentDetails?.fatherName}
        </Text>
        <Text style={styles.detailText}>
          Aadhar Number: {agentDetails?.aadharNo}
        </Text>
        <Text style={styles.detailText}>
          Dealer Phone Number: {agentDetails?.dealerPhoneNumber}
        </Text>
        <Text style={styles.detailText}>
          Phone Number: {agentDetails?.phoneNumber}
        </Text>
        <Text style={styles.detailText}>
          Dealer ID: {agentDetails?.dealerId}
        </Text>
      </View>
      <View style={styles.transactionsContainer}>
        <Text style={styles.headerText}>Your Referal History</Text>
        {transactions.length === 0 && (
          <Text style={styles.noDataText}>No QR Created yet</Text>
        )}
        {transactions.map((item, index) => (
          <View style={styles.transactionItem} key={index}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDate}>
                {formatDate(item.createdAt)}
              </Text>
              <Text style={styles.transactionType}>{item.reason}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    item.transactionType === 'ADDED' ? '#228B22' : '#B22222',
                },
              ]}>
              {item.transactionType === 'ADDED'
                ? `+${item.amount}`
                : `-${item.amount}`}
            </Text>
            <Text style={styles.transactionComments}>{item.comments}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: THEME_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
  transactionsContainer: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999999',
  },
  transactionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionDate: {
    fontSize: 16,
    color: '#666666',
  },
  transactionType: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'condensed',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  transactionComments: {
    marginTop: 5,
    fontSize: 14,
    color: '#888888',
  },
});

export default AgentDetailsScreen;
