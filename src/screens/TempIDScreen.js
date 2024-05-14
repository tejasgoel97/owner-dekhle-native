import React, {useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import api from '../services/api';
import {Linking, Share} from 'react-native';
import LoadingIndicator from '../components/LoadingIndicator';
import {COLOR_LITE, THEME_COLOR, THEME_COLOR_2} from '../assets/colors/colors';

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
    const phoneNumber = '+91' + tempDetails.phoneNumber;
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
        message: `https://ownerdekhle.com/form/${tempId}`,
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
    const body = {
      tempId,
    };
    try {
      const response = await api.post('/QR/change-tempid-to-complete', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        Toast.show({
          type: 'info',
          text1: 'COMPLETED QR',
          text2: 'COMPLETED QR',
        });
        fetchTempDetails();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to create QR data',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Create this',
        text2: error.response.data.message,
      });
      fetchTempDetails();
    }
  };

  const cancelAction = async () => {
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

  if (loading) {
    return <LoadingIndicator />;
  }
  console.log(tempDetails);
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchTempDetails} />
      }>
      {tempDetails ? (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>Temp ID Details</Card.Title>
          <Card.Divider />
          <Text style={styles.infoText}>Temp ID: {tempDetails.id}</Text>
          <Text style={styles.infoText}>
            Phone Number: {tempDetails.phoneNumber}
          </Text>
          <Text style={styles.infoText}>
            Vehicle Type: {tempDetails.vehicleType}
          </Text>
          <Text
            style={[
              styles.status,
              {color: getStatusColor(tempDetails.status)},
            ]}>
            Status: {tempDetails.status}
          </Text>
          {status === 'SUBMITTED' && (
            <Button
              buttonStyle={styles.completeButton}
              icon={<Icon name="check" size={20} color="white" />}
              title=" COMPLETE"
              onPress={() => confirmAction('COMPLETE')}
            />
          )}
          {(status === 'SUBMITTED' || status === 'PENDING') && (
            <Button
              buttonStyle={styles.cancelButton}
              icon={<Icon name="cancel" size={20} color="white" />}
              title=" CANCEL"
              onPress={() => confirmAction('CANCEL')}
            />
          )}
          <Button
            icon={<Icon name="message" size={20} color="white" />}
            title=" Share via WhatsApp"
            buttonStyle={styles.whatsappButton}
            onPress={sendWhatsAppMessage}
          />
          <Button
            icon={<Icon name="share" size={20} color="white" />}
            title=" Share Link"
            buttonStyle={styles.shareButton}
            onPress={shareLink}
          />
          <Button
            icon={<Icon name="refresh" size={20} color="white" />}
            title=" Refresh"
            buttonStyle={styles.refreshButton}
            onPress={fetchTempDetails}
          />
        </Card>
      ) : (
        <Text style={styles.loadingText}>No data available...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F8FF', // Alice Blue background for a light theme
  },
  card: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
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
  completeButton: {
    backgroundColor: '#32CD32', // Lime Green for COMPLETE button
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347', // Tomato for CANCEL button
    marginBottom: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp green
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: THEME_COLOR, // Dodger Blue for share button
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: THEME_COLOR_2, // Steel Blue for refresh button
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
export default TempIDScreen;
