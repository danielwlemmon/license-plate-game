import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import BlankPlates from '../PlateData.json';
import { Colors } from '../assets/colors';

//image source for plates = ./assets/{country}/{toLower(name)}.jpg
function PlatesScreen() {
  const [gameState, setGameState] = useState(BlankPlates.PlateData);
  const [refresh, setRefresh] = useState(0);

  const foundPlate = (plate) => {
    if (plate.found) {
      Alert.alert(
        "Do you want to mark " + plate.name + " as not found?",
        "",
        [
          {
            text: "No",
            onPress: () => setRefresh(refresh + 1),
            style: "cancel"
          },
          {
            text: "Yes", onPress: () => {
              let gameArr = gameState;
              const plateIdx = gameArr.findIndex(p => p.id === plate.id);
              gameArr[plateIdx].found = false;
              setGameState(gameArr);
              setRefresh(refresh + 1);
            }
          }
        ]
      );
    } else {
      let gameArr = gameState;
      const plateIdx = gameArr.findIndex(p => p.id === plate.id);
      gameArr[plateIdx].found = true;
      setGameState(gameArr);
      setRefresh(refresh + 1);
    }
  }


  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>

        <View style={styles.main}>
          <Text style={{ marginTop: 40, padding: 5, fontSize: '20px', fontWeight: 'bold' }}>Tap the plates below to mark them as found</Text>
          {gameState.map((plate) => {
            return (
              <View key={plate.id}>
                <TouchableOpacity onPress={() => { foundPlate(plate) }} style={styles.plateButton}>

                  <Image source={require('../assets/USA/CO.jpg')} style={plate.found ? styles.image : null} />
                  <Text style={styles.text}>{plate.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

        </View>
      </ScrollView>
      <View style={styles.buttonBar}>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: Colors.signYellow }]} onPress>
          <Text style={{ fontSize: '30px' }}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: Colors.signRed }]} onPress>
          <Text style={{ fontSize: '30px' }}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30
  },
  gameButton: {
    flex: 3,
    height: 75,
    margin: (0, 5, 0, 5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  image: {
    opacity: 0.5
  },
  main: {
    justifyContent: 'center'
  },
  plateButton: {
    alignItems: 'center',
    borderWidth: '1',
  },
  text: {
    fontSize: '50px',
    fontWeight: '500',
  }
})

export default PlatesScreen;