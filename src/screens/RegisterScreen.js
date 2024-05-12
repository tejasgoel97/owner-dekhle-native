import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Button, Text, Input} from '@rneui/themed';
import {register} from '../services/dealerServices';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../store/actions';
import api from '../services/api';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [dealerPhoneNumber, setDealerPhoneNumber] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [dealerId, setDealerId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (value, setState, field) => {
    if (field === 'dealerPhoneNumber') {
      setIsVerified(false);
    }
    setState(value);
  };

  const verifyDealer = async () => {
    console.log('Handle Verify');
    setLoadingVerify(true);

    try {
      const response = await api.get('/auth/dealerName', {
        params: {phoneNumber: dealerPhoneNumber},
      });
      console.log(response);
      const result = response.data;
      if (result?.success) {
        setDealerName(result.data.name);
        setDealerId(result.data.id);
        setIsVerified(true);
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: `Dealer ${result.data.name} has been successfully verified.`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Unable to verify dealer.',
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response?.status === 404) {
        Toast.show({
          type: 'error',
          text1: 'Dealer Not Found',
          text2: error.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Dealer Phone Number',
          text2: 'Error during verification',
        });
      }
    } finally {
      setLoadingVerify(false);
    }
  };
  const validateInputs = () => {
    if (
      !name.trim() ||
      !phoneNumber.trim() ||
      !fatherName.trim() ||
      !aadharNo.trim() ||
      !dealerPhoneNumber.trim()
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'All fields are required.',
      });
      return false;
    }

    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Phone number must be 10 digits.',
      });
      return false;
    }

    if (aadharNo.length !== 12 || isNaN(aadharNo)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Aadhar Number',
        text2: 'Aadhar number must be 12 digits.',
      });
      return false;
    }

    return true;
  };

  const HandleVerifyOTP = async () => {
    if (!otp || otp.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'OTP Required',
        text2: 'Please enter the OTP sent to your phone.',
      });
      return;
    }
    setLoadingVerifyOTP(true);

    try {
      const response = await api.post('/auth/email/verifyotp', {
        phoneNumber,
        otp,
      });
      const result = response.data;
      console.log(result);
      console.log('reesult');
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: 'Your phone number has been verified successfully.',
        });
        dispatch(setUserInfo(result.userInfo));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Failed to verify OTP. Please try again.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'An error occurred during OTP verification.',
      });
      console.log('OTP verification failed:', error);
    } finally {
      setLoadingVerifyOTP(false);
    }
  };
  const handleOTPSend = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!isVerified) {
      Toast.show({
        type: 'info',
        text1: 'Verification Required',
        text2: "Please verify the dealer's phone number first.",
      });
      return;
    }
    setLoadingSendOTP(true);

    const registrationData = {
      name,
      phoneNumber,
      fatherName,
      aadharNo,
      dealerPhoneNumber,
      dealerId,
      email,
      password,
    };

    try {
      const response = await api.post('/auth/email/register', registrationData);
      let result = response.data;
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'You have been registered successfully.',
        });
        setOtpSent(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.message || 'Failed to register.',
        });
      }
    } catch (error) {
      console.log('resss', error.response.status);
      if (error.response && error.response.status === 409) {
        Toast.show({
          type: 'error',
          text1: 'Already Registered',
          text2: error.response.data.message,
        });
      } else if (error.response && error.response.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Failed To register',
          text2: error.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2: 'An error occurred during registration. Please try again.',
        });
        console.log('Registration failed:', error);
      }
    } finally {
      setLoadingSendOTP(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text h4>Register</Text>
        <Text style={{marginLeft: 10}}>Name</Text>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={text => handleInputChange(text, setName)}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.phoneNumberInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Phone Number</Text>
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={text => handleInputChange(text, setPhoneNumber)}
          keyboardType="numeric"
          ref={input => {
            this.phoneNumberInput = input;
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.emailInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Email</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={text => handleInputChange(text, setEmail)}
          ref={input => {
            this.emailInput = input;
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.passwordInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Password</Text>
        <Input
          placeholder="Password"
          value={password}
          onChangeText={text => handleInputChange(text, setPassword)}
          secureTextEntry={true}
          ref={input => {
            this.passwordInput = input;
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.fatherNameInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Father's Name</Text>
        <Input
          placeholder="Father's Name"
          value={fatherName}
          onChangeText={text => handleInputChange(text, setFatherName)}
          ref={input => {
            this.fatherNameInput = input;
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.aadharNoInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Aadhar Number 12 Digits</Text>
        <Input
          placeholder="Aadhar Number"
          value={aadharNo}
          onChangeText={text => handleInputChange(text, setAadharNo)}
          keyboardType="numeric"
          ref={input => {
            this.aadharNoInput = input;
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            this.dealerPhoneNumberInput.focus();
          }}
          blurOnSubmit={false}
        />
        <Text style={{marginLeft: 10}}>Dealer Phone Number</Text>
        <View style={styles.dealerPhoneContainer}>
          <Input
            placeholder="Dealer Phone Number"
            value={dealerPhoneNumber}
            onChangeText={text =>
              handleInputChange(text, setDealerPhoneNumber, 'dealerPhoneNumber')
            }
            keyboardType="numeric"
            containerStyle={{flex: 1}}
            ref={input => {
              this.dealerPhoneNumberInput = input;
            }}
            returnKeyType="done"
          />
          <Button
            title={isVerified ? 'Verified' : 'Verify'}
            onPress={verifyDealer}
            buttonStyle={isVerified ? styles.verifiedButton : {}}
            disabled={isVerified}
            loading={loadingVerify}
          />
        </View>
        {dealerName && (
          <Text style={styles.dealerNameText}>Dealer Name: {dealerName}</Text>
        )}
        {otpSent && (
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChangeText={text => handleInputChange(text, setOtp)}
            keyboardType="numeric"
            returnKeyType="go"
            onSubmitEditing={HandleVerifyOTP}
          />
        )}
        {otpSent ? (
          <Button
            title="Verify OTP"
            onPress={HandleVerifyOTP}
            loading={loadingVerifyOTP}
          />
        ) : (
          <Button
            title="Send OTP"
            onPress={handleOTPSend}
            loading={loadingSendOTP}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },
  dealerPhoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedButton: {
    backgroundColor: 'green',
  },
  dealerNameText: {
    paddingBottom: 10,
    paddingLeft: 10,
    color: 'green',
  },
});
export default RegisterScreen;
