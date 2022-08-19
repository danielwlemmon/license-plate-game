import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
//image source for plates = ./assets/{country}/{toLower(name)}.jpg
function PlatesScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
      <Text>License Plates</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

})

export default PlatesScreen;