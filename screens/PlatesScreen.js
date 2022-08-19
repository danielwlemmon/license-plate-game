import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import * as BlankPlates from '../PlateData.json';

//image source for plates = ./assets/{country}/{toLower(name)}.jpg
function PlatesScreen() {
  let BlankPlateData = BlankPlates.PlateData;

  console.log(BlankPlateData);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
      <View>
        {BlankPlateData.map((plate) => {
          return (
            <View key={plate.id}>
              <Image source={'../assets/USA/Colorado.jpg'} />
              <Text>{plate.name}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

})

export default PlatesScreen;