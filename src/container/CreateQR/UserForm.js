import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import api from '../../services/api';
import {Picker} from '@react-native-picker/picker';
import {COLOR_LITE, THEME_COLOR} from '../../assets/colors/colors';

const UserForm = ({scannedCodes}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const navigation = useNavigation();
  const token = useSelector(state => state.userInfo.token);

  console.log({vehicleType});

  const handleCreateTempId = async () => {
    const body = {
      phoneNumber: phoneNumber,
      QRIDS: scannedCodes,
      vehicleType: vehicleType,
    };
    const digitOnly = /^[0-9]*$/;
    if (!digitOnly.test(body.phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please Check the Phone Number',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }
    if (body.phoneNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Phone Number should have 10-digits',
        // text2: 'Phone Number should have 10 Digits',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }
    if (!vehicleType) {
      Toast.show({
        type: 'error',
        text1: 'Please Select a vehicle Type',
        // text2: 'Phone Number should have 10 Digits',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }
    if (scannedCodes.length < 2 || scannedCodes.length > 3) {
      Toast.show({
        type: 'error',
        text1: 'You Need to provide only 2 or 3 Scanners',
        // text2: 'Phone Number should have 10 Digits',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return;
    }
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
          mode="dropdown">
          <Picker.Item label="Select an option..." value="" />
          <Picker.Item label="Two Wheeler" value="TWO_WHEELER" />
          <Picker.Item label="Three Wheeler" value="THREE_WHEELER" />
          <Picker.Item label="Four Wheeler" value="FOUR_WHEELER" />
          <Picker.Item label="Heavy Vehicle" value="HEAVY_VEHICLE" />
        </Picker>
      </View>
      <Input
        placeholder="Phone Number"
        leftIcon={{type: 'font-awesome', name: 'phone', color: '#7f8c8d'}}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
        containerStyle={styles.inputWrapper}
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
    backgroundColor: '#f5f5f5',
  },
  inputText: {
    color: THEME_COLOR,
  },
  inputContainer: {
    borderBottomColor: '#bdc3c7',
  },
  inputWrapper: {
    // marginBottom: 20,
    // backgroundColor: '#ffffff',
    // borderRadius: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  button: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    width: '100%',
    height: 44,
    color: THEME_COLOR,
  },
});

export default UserForm;
