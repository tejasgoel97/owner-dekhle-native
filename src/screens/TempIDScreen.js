import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import {Text, Button, Card} from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import {Linking, Share} from 'react-native';

const TempIDScreen = ({route, navigation}) => {
  const {tempId} = route.params;
  const [tempDetails, setTempDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const token = useSelector(state => state.userInfo.token);
  useEffect(() => {
    fetchTempDetails();
  }, [tempId, token]);
  const sendWhatsAppMessage = async () => {
    const phoneNumber = '+91' + tempDetails.phoneNumber; // Example phone number
    const tempId = tempDetails.id;
    console.log(tempDetails.id);
    const formUrl = `https://ownerdekhle.com/form/${tempId}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=Please complete the form: ${formUrl}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Toast.show({
          type: 'error',
          text1: 'WhatsApp not installed',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Unable to open link',
        text2: error.message,
      });
    }
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Please complete the form: http://192.168.1.5:3000/form/${tempId}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error sharing',
        text2: error.message,
      });
    }
  };

  const confirmAction = action => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action.toLowerCase()} this ID?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () =>
            action === 'COMPLETE' ? completeAction() : cancelAction(),
        },
      ],
    );
  };

  const completeAction = async () => {
    // Implement the complete action
    console.log('Completing Action');
    const body = {
      tempId,
    };
    try {
      const response = await api.post('/QR/change-tempid-to-complete', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        Toast.show({
          type: 'info',
          text1: 'COMPLETED QR',
          text2: 'COMPLETED QR',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to create QR data',
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Create this',
          text2: error.response.data.message,
        });
        Toast.show({
          type: 'error',
          text1: 'Failed to create TempID',
        });
      }
      fetchTempDetails();
    }
  };

  const cancelAction = () => {
    // Implement the cancel action
    console.log('Cancelling Action');
    fetchTempDetails();
  };

  const fetchTempDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/QR/get-temp-id?tempId=${tempId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (response.data) {
        setTempDetails(response.data);
        setStatus(response.data.status);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Fetch Error',
          text2: 'No data received from server.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to fetch temp ID details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusOptions = () => {
    switch (status) {
      case 'PENDING':
        return [{label: 'CANCELLED', value: 'CANCELLED'}];
      case 'SUBMITTED':
        return [
          {label: 'CANCELLED', value: 'CANCELLED'},
          {label: 'COMPLETED', value: 'COMPLETED'},
        ];
      default:
        return [];
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchTempDetails} />
      }>
      {tempDetails ? (
        <Card>
          <Card.Title style={styles.cardTitle}>Temp ID Details</Card.Title>
          <Card.Divider />
          <Text style={styles.infoText}>Temp ID: {tempDetails.id}</Text>
          <Text style={styles.infoText}>
            Phone Number: {tempDetails.phoneNumber}
          </Text>
          <Text style={styles.infoText}>Status: {tempDetails.status}</Text>
          {status === 'SUBMITTED' && (
            <Button
              buttonStyle={{backgroundColor: 'green'}} // Style for COMPLETE button
              icon={<Icon name="check" size={20} color="white" />}
              title=" COMPLETE"
              onPress={() => confirmAction('COMPLETE')}
            />
          )}
          {(status === 'SUBMITTED' || status === 'PENDING') && (
            <Button
              buttonStyle={{backgroundColor: 'red', marginBottom: 10}} // Style for CANCEL button
              icon={<Icon name="cancel" size={20} color="white" />}
              title=" CANCEL"
              onPress={() => confirmAction('CANCEL')}
            />
          )}
          <Button
            icon={<Icon name="message" size={20} color="white" />}
            title=" Share via WhatsApp"
            buttonStyle={{backgroundColor: 'teal', marginBottom: 10}}
            onPress={sendWhatsAppMessage}
          />

          <Button
            icon={<Icon name="share" size={20} color="white" />}
            title=" Share Link"
            buttonStyle={{backgroundColor: 'darkblue', marginBottom: 10}}
            onPress={shareLink}
          />
          <Button
            icon={<Icon name="refresh" size={20} color="white" />}
            title=" Refresh"
            onPress={fetchTempDetails}
          />
        </Card>
      ) : (
        <Text style={styles.loadingText}>Loading or no data available...</Text>
      )}
    </ScrollView>
  );
};

// Continue with the existing styles...

export default TempIDScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    color: '#333',
  },
  infoText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: 'white',
  },
};
