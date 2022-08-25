import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import BlankPlates from '../PlateData.json';

//image source for plates = ./assets/{country}/{toLower(name)}.jpg
function PlatesScreen() {
  const [gameState, setGameState] = useState(BlankPlates.PlateData);
  const [refresh, setRefresh] = useState(0);

  const foundPlate = (plate) => {
    let gameArr = gameState;
    const plateIdx = gameArr.findIndex(p => p.id === plate.id);
    gameArr[plateIdx].found = true;
    setGameState(gameArr);
    setRefresh(refresh + 1);
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>

      <View style={styles.main}>
        <Text style={{ marginTop: 40, padding: 5, fontSize: '20px', fontWeight: 'bold' }}>Tap the plates below to mark them as found</Text>
        {gameState.map((plate) => {
          return (
            <View key={plate.id}>
              <TouchableOpacity onPress={() => { foundPlate(plate) }} style={styles.button}>

                <Image source={require('../assets/USA/CO.jpg')} style={plate.found ? styles.image : null} />
                <Text style={styles.text}>{plate.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: '1',
  },
  image: {
    opacity: 0.5
  },
  main: {
    justifyContent: 'center'
  },
  text: {
    fontSize: '50px',
    fontWeight: '500',
  }
})

export default PlatesScreen;