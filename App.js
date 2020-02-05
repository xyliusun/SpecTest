import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { deviceKey } from './DeivceConfig';

export default function App() {

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(deviceKey)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
