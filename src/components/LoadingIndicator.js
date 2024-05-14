// components/LoadingIndicator.js

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import {COLOR_LITE, THEME_COLOR} from '../assets/colors/colors';

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={'white'} />
      <Text style={{color: 'white'}}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLOR,
  },
});

export default LoadingIndicator;
