import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {THEME_COLOR} from '../../assets/colors/colors';

const getStatusColor = status => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return '#FF8C00'; // Dark Orange
    case 'SUBMITTED':
      return '#104E8B'; // Dark Dodger Blue
    case 'COMPLETED':
      return '#228B22'; // Forest Green
    case 'CANCELLED':
      return '#B22222'; // Firebrick
    default:
      return '#333333'; // Default dark gray
  }
};

const TempIdList = ({data}) => {
  const navigation = useNavigation();

  const handlePress = item => {
    navigation.navigate('TempIDScreen', {
      tempId: item.tempId,
      phoneNumber: item.phoneNumber,
      date: item.date,
      status: item.status,
    });
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[styles.card, {borderLeftColor: getStatusColor(item.status)}]}>
      <Text style={styles.title}>Phone Number: {item.phoneNumber}</Text>
      <Text style={styles.itemText}>Temp ID: {item.tempId}</Text>
      <Text style={styles.itemText}>Date: {item.date}</Text>
      <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );
  if (!data.length) {
    return <Text style={{color: 'white'}}>No Temp Id</Text>;
  }
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
    backgroundColor: THEME_COLOR, // Alice Blue background for a light theme
  },
  card: {
    backgroundColor: '#FFFFFF', // White background for card
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: THEME_COLOR,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR, // Left border color for card
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR, // Dark Slate Gray color for ID
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: THEME_COLOR, // Steel Blue color for text
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#FFFFFF', // White text color for better contrast on colored backgrounds
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden', // Ensures the background color does not leak outside the border radius
    // marginBottom: 5,
    textAlign: 'right', // Centers the text within the status label
    fontWeight: 'bold',
  },
});

export default TempIdList;
