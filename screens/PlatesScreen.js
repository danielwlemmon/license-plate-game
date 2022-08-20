import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import * as BlankPlates from '../PlateData.json';

//image source for plates = ./assets/{country}/{toLower(name)}.jpg
function PlatesScreen() {
  let BlankPlateData = BlankPlates.PlateData;
  let pictureTest = require('../assets/USA/alabama.jpg');

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
      <Image style={styles.image} source={pictureTest} />
      <View>
        {BlankPlateData.map((plate) => {
          return (
            <View key={plate.id}>
              <Image source={'./assets/USA/colorado.jpg'} />
              <Text>{plate.name}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    marginTop: 40
  }
})

export default PlatesScreen;