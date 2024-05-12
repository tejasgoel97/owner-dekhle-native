import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { ListItem, Avatar } from "@rneui/themed";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import api from "../services/api";

const MyAgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const token = useSelector((state) => state.userInfo.token); // Accessing token from Redux state

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await api.get("/agent/myAgents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setAgents(response.data.agents);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderItem = ({ item }) => (
    <ListItem
      onPress={() =>
        navigation.navigate("AgentDetailsScreen", { agentId: item._id })
      }
      bottomDivider
    >
      <Avatar source={{ uri: "https://via.placeholder.com/150" }} rounded />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.phoneNumber}</ListItem.Subtitle>
        <Text>Date Joined: {item.dateJoined}</Text>
      </ListItem.Content>
    </ListItem>
  );
  if (agents.length === 0) {
    return (
      <View style={styles.noAgentsContainer}>
        <Text>No agents found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={agents}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noAgentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyAgentsScreen;
