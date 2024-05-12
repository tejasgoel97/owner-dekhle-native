import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import api from "../services/api";
import { useSelector } from "react-redux";

const MyPointsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.userInfo.token); // Accessing token from Redux state

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/mydata/myPoints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(response.data.transactions);
        setTotalPoints(response.data.totalPoints);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        // Handle errors, such as by showing a notification to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.dateAmountContainer}>
        <Text style={styles.dateText}>
          {new Date(item.transactionDate).toLocaleString()}
        </Text>
        <Text
          style={
            item.transactionType === "ADDED"
              ? styles.amountAdded
              : styles.amountRemoved
          }
        >
          {item.transactionType === "ADDED"
            ? `+${item.amount}`
            : `-${item.amount}`}
        </Text>
      </View>
      <Text style={styles.commentsText}>{item.comments}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.totalPoints}>Total Points: {totalPoints}</Text>
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
    padding: 10,
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  dateAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: "blue",
    flex: 1, // Ensure text does not overflow
  },
  amountAdded: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginLeft: 10, // Ensure some spacing between the date and amount
  },
  amountRemoved: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginLeft: 10,
  },
  commentsText: {
    fontStyle: "italic",
    color: "#666",
    paddingTop: 5,
  },
});

export default MyPointsScreen;
