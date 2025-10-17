import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { CameraView } from 'expo-camera';

const QrScanner = ({ onCodeScanned }) => {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      setScanned(true);
      onCodeScanned(scanningResult.data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      {scanned && (
        <View style={styles.scanAgainButton}>
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
  },
});

export default QrScanner;
