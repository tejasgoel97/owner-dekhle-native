import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";

const AgentDetailsScreen = ({ route }) => {
  const { agentId } = route.params;
  const [agentDetails, setAgentDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.userInfo.token); // Accessing token from Redux state

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const detailsResponse = await axios.get(
          `http://192.168.1.8:5000/api/agent/agentDetails/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transactionsResponse = await axios.get(
          `http://192.168.1.8:5000/api/agent/agentScanners/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (detailsResponse.data.success) {
          setAgentDetails(detailsResponse.data.agent);
        }
        if (transactionsResponse.data.success) {
          setTransactions(transactionsResponse.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);
  console.log(agentDetails);
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText}>Agent Details</Text>
        <Text>Name: {agentDetails?.name}</Text>
        <Text>Father's Name: {agentDetails?.fatherName}</Text>
        <Text>Aadhar Number: {agentDetails?.aadharNo}</Text>
        <Text>Dealer Phone Number: {agentDetails?.dealerPhoneNumber}</Text>
        <Text>Phone Number: {agentDetails?.phoneNumber}</Text>
        <Text>Dealer ID: {agentDetails?.dealerId}</Text>
      </View>
      <View style={styles.transactionsContainer}>
        <Text style={styles.headerText}>Transaction History</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.transactionDate + item.amount}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text>
                {new Date(item.transactionDate).toLocaleDateString()} -{" "}
                {item.vehicleType}
              </Text>
              <Text
                style={{
                  color: item.transactionType === "ADDED" ? "green" : "red",
                }}
              >
                {item.transactionType === "ADDED"
                  ? `+${item.amount}`
                  : `-${item.amount}`}
              </Text>
              <Text>{item.comments}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionsContainer: {},
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default AgentDetailsScreen;
