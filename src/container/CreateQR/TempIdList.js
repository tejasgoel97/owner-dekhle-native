import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const getStatusColor = status => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return '#FFBF00'; // Dark Amber
    case 'SUBMITTED':
      return '#000080'; // Navy Blue
    case 'COMPLETED':
      return '#006400'; // Dark Green
    case 'CANCELLED':
      return '#800000'; // Maroon
    default:
      return '#333333'; //
  }
};

const TempIdList = ({data}) => {
  const navigation = useNavigation(); // Use navigation hook

  const handlePress = item => {
    navigation.navigate('TempIDScreen', {
      tempId: item.tempId,
      phoneNumber: item.phoneNumber,
      date: item.date,
      status: item.status,
    });
  };

  // Use toLocaleString to show complete date and time
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Text style={styles.itemText}>Phone Number: {item.phoneNumber}</Text>
      <Text style={styles.title}>Temp ID: {item.tempId}</Text>
      <Text style={styles.itemText}>Date: {item.date}</Text>
      <Text
        style={[styles.status, {backgroundColor: getStatusColor(item.status)}]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.tempId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFAFA', // Soft red background
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F4F4F', // Dark Slate Gray color for ID
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#4682B4', // Steel Blue color for text
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#FFFFFF', // White text color for better contrast on colored backgrounds
    padding: 5,
    borderRadius: 4,
    overflow: 'hidden', // Ensures the background color does not leak outside the border radius
    marginBottom: 5,
    textAlign: 'center', // Centers the text within the status label
  },
});

export default TempIdList;
