import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {clearUserInfo} from '../store/actions';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Icon

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user-info');
    Toast.show({
      type: 'info',
      text1: 'LoggedOut',
      text2: 'Login Again To Continue',
    });
    dispatch(clearUserInfo());
  };

  const IconButton = ({title, iconName, onPress}) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={50} color="#fff" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <IconButton
          title="Scan QR"
          iconName="qr-code-scanner"
          onPress={() => navigation.navigate('CreateQRScreen')}
        />
        <IconButton
          title="Temp IDs"
          iconName="list"
          onPress={() => navigation.navigate('TempIDListScreen')}
        />
      </View>
      <View style={styles.row}>
        <IconButton
          title="Agents"
          iconName="group"
          onPress={() => navigation.navigate('MyAgentsScreen')}
        />
        <IconButton
          title="Points"
          iconName="star"
          onPress={() => navigation.navigate('MyPointsScreen')}
        />
      </View>
      <View style={styles.row}>
        <IconButton
          title="LogOut"
          iconName="exit-to-app"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    // flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 18,
  },
});

export default HomeScreen;
