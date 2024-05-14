import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text, Card} from '@rneui/themed';
import ScanQRDialog from '../container/CreateQR/ScanQRDialog';
import UserForm from '../container/CreateQR/UserForm';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import api from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';

const CreateQRScreen = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [registrationPaid, setRegistrationPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(state => state.userInfo.token);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!registrationPaid) {
    return (
      <View style={styles.container}>
        <Text h4 style={styles.alertText}>
          Please verify your account by Admin before making the scanners
        </Text>
      </View>
    );
  }

  if (+totalPoints < -600) {
    return (
      <View style={styles.container}>
        <Text style={styles.alertText}>
          Your Total Points are Less... Please Add Points to Proceed
        </Text>
        <Text style={styles.pointsText}>My Points: {totalPoints}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={fetchTransactions}>
          <Icon name="refresh" size={30} color="white" />
          <Text style={styles.iconButtonText}>Refresh</Text>
        </TouchableOpacity>
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
          position: 'bottom',
          visibilityTime: 3000,
        });
      } else {
        setScannedCodes(prev => [...prev, code]);
        Toast.show({
          type: 'success',
          text1: 'QR Code Scanned',
          text2: 'QR code added successfully.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'Scan Error',
        text2: 'No valid QR code found.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
    setIsDialogVisible(false);
  };

  const handleRemoveCode = codeToRemove => {
    setScannedCodes(scannedCodes.filter(code => code !== codeToRemove));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsDialogVisible(true)}>
          <Icon name="qr-code-scanner" size={30} color="white" />
          <Text style={styles.iconButtonText}>Open QR Scanner</Text>
        </TouchableOpacity>
        {scannedCodes.length > 0 && (
          <Card containerStyle={styles.cardContainer}>
            <Card.Title>Scanned QR Codes</Card.Title>
            <Card.Divider />
            {scannedCodes.map((code, index) => (
              <View key={index} style={styles.codeContainer}>
                <Text style={styles.codeText}>{code}</Text>
                <TouchableOpacity onPress={() => handleRemoveCode(code)}>
                  <Icon name="cancel" size={24} color="#900" />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        )}
        <UserForm scannedCodes={scannedCodes} />
        <ScanQRDialog
          isVisible={isDialogVisible}
          onClose={() => setIsDialogVisible(false)}
          onCodeScanned={handleQRCodeScanned}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  alertText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
    color: '#d9534f',
  },
  pointsText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  cardContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
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
