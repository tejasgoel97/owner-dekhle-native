import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import api from '../../services/api';
import {Picker} from '@react-native-picker/picker';

const UserForm = ({scannedCodes}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const navigation = useNavigation(); // Get navigation object using hook
  const token = useSelector(state => state.userInfo.token); // Accessing token from Redux state

  console.log({vehicleType});

  const handleCreateTempId = async () => {
    // Logic to create a temporary ID can be simulated here
    const tempId = 'TID123'; // Example temporary ID
    const status = 'Pending'; // Example status
    console.log('Creating Temp ID with:', selectedOption, phoneNumber);
    // Navigate to TempIDScreen with parameters
    const body = {
      phoneNumber: phoneNumber,
      QRIDS: scannedCodes,
      vehicleType: vehicleType,
    };
    try {
      const response = await api.post('/QR/create-temp-id', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.tempID);
      if (response.data.success) {
        navigation.goBack();
        setTimeout(() => {
          navigation.navigate('TempIDListScreen');
        }, 50);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to create TempID',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to create TempID',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={vehicleType}
          onValueChange={(itemValue, itemIndex) => setVehicleType(itemValue)}
          style={styles.picker}
          mode="dropdown" // You can also use 'dialog' on Android
        >
          <Picker.Item label="Select an option..." value="" />
          <Picker.Item label="Two Wheeler" value="TWO_WHEELER" />
          <Picker.Item label="Three Wheeler" value="THREE_WHEELER" />
          <Picker.Item label="Four Wheeler" value="FOUR_WHEELER" />
          <Picker.Item label="Heavy Vehicle" value="HEAVY_VEHICLE" />
        </Picker>
      </View>
      <Input
        placeholder="Phone Number"
        leftIcon={{type: 'font-awesome', name: 'phone', color: 'black'}}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
      />
      <Button
        title="Create Temp ID"
        onPress={handleCreateTempId}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputText: {
    color: 'black',
  },
  inputContainer: {
    borderBottomColor: 'black',
  },
  button: {
    backgroundColor: 'black',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 44,
    backgroundColor: '#FFF',
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default UserForm;
