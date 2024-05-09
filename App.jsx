import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyComponent = () => <Icon name="arrow-back" size={30} color="#900" />;

const App = () => {
  const [scanResult, setScanResult] = useState('');

  const onSuccess = e => {
    setScanResult(e.data);
    console.log('QR Code Data:', e.data);
  };

  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
      <MyComponent />
      <QRCodeScanner
        onRead={onSuccess}
        reactivate={true} // Add this line if you want the scanner to reactivate after a successful scan
        reactivateTimeout={5000} // Time in milliseconds to wait before reactivating the scanner
        cameraStyle={{height: 400}}
        topContent={
          <Text style={{fontSize: 20, marginBottom: 20}}>Scan a QR Code</Text>
        }
        bottomContent={
          <>
            <Text style={{fontSize: 18, marginBottom: 20}}>
              Result: {scanResult}
            </Text>
            <Button title="Scan QR" onPress={() => this.scanner.reactivate()} />
          </>
        }
      />
    </View>
  );
};

export default App;
