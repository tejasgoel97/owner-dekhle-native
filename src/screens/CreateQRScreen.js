import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Button, Card} from '@rneui/themed';

import ScanQRDialog from '../container/CreateQR/ScanQRDialog';
import UserForm from '../container/CreateQR/UserForm';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the Icon component
import {useSelector} from 'react-redux';
import api from '../services/api';

const CreateQRScreen = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [registrationPaid, setRegistrationPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(state => state.userInfo.token); // Accessing token from Redux state
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/mydata/myPoints', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.transactions);
      setTotalPoints(response.data.totalPoints);
      setRegistrationPaid(response.data.registrationPaid);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Handle errors, such as by showing a notification to the user
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!registrationPaid) {
    return (
      <View style={styles.container}>
        <Text h4>
          Please verify your account by Admin before making the scanners
        </Text>
      </View>
    );
  }

  if (+totalPoints < -600) {
    return (
      <View style={styles.container}>
        <Text>
          Your Total Points are Less......Please Add Points to Proceed
        </Text>
        <Text>My Points: {totalPoints}</Text>
        <Button
          icon={<Icon name="refresh" size={20} color="white" />}
          title=" Refresh"
          onPress={fetchTransactions}
        />
      </View>
    );
  }
  const handleQRCodeScanned = data => {
    console.log('Scanned Data: ', data);
    const regex = /([^\/]{16})$/;
    const match = data.match(regex);

    if (match) {
      const code = match[1];

      if (scannedCodes.includes(code)) {
        Toast.show({
          type: 'error',
          text1: 'Duplicate Code',
          text2: 'This QR code has already been scanned.',
        });
      } else {
        setScannedCodes(prev => [...prev, code]);
        Toast.show({
          type: 'success',
          text1: 'QR Code Scanned',
          text2: 'QR code added successfully.',
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'Scan Error',
        text2: 'No valid QR code found.',
      });
    }
    setIsDialogVisible(false);
  };

  const handleRemoveCode = codeToRemove => {
    setScannedCodes(scannedCodes.filter(code => code !== codeToRemove));
  };

  return (
    <View style={styles.container}>
      <Button
        title="Open QR Scanner"
        onPress={() => setIsDialogVisible(true)}
      />
      {scannedCodes.map((code, index) => (
        <View key={index} style={styles.codeContainer}>
          <Text style={styles.codeText}>{code}</Text>
          <TouchableOpacity onPress={() => handleRemoveCode(code)}>
            <Icon name="cancel" size={24} color="#900" />
          </TouchableOpacity>
        </View>
      ))}

      <UserForm scannedCodes={scannedCodes} />
      <ScanQRDialog
        isVisible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
        onCodeScanned={handleQRCodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  codeText: {
    fontSize: 16,
  },
});

export default CreateQRScreen;
