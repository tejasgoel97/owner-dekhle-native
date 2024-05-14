import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {THEME_COLOR} from '../../assets/colors/colors';

const ScanQRDialog = ({isVisible, onClose, onCodeScanned}) => {
  // const [modalVisible, setModalVisible] = useState(false);

  const handleScan = e => {
    onCodeScanned(e.data);
    console.log('Scanned QR Code:', e.data);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={onClose}>
        <QRCodeScanner
          onRead={handleScan}
          topContent={
            <Text style={styles.centerText}>
              <Text style={styles.boldText}>
                Please Scan the OWNER DEKHLE QR CODES
              </Text>
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Close Scanner</Text>
            </TouchableOpacity>
          }
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    padding: 10,
    backgroundColor: THEME_COLOR,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  boldText: {
    fontWeight: '500',
    color: '#000',
  },
  codesList: {
    marginTop: 20,
  },
  codeText: {
    fontSize: 16,
  },
});

export default ScanQRDialog;
