import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import BlankPlates from '../PlateData.json';
import { Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imgSrc from '../assets/imgSrc';

function PlatesScreen({ navigation }) {
  const totalPlates = 63;
  const [gameState, setGameState] = useState(BlankPlates.PlateData);
  const [refresh, setRefresh] = useState(0);
  const [progress, setProgress] = useState([0, totalPlates])
  const [score, setScore] = useState(0);

  useEffect(() => {

    AsyncStorage.getItem('gameInProgress')
      .then((res) => {
        if (res == 'false') {
          setGameState(BlankPlates.PlateData);
        } else if (res == 'true') {
          AsyncStorage.getItem('currentGame')
            .then(res => {
              const savedGame = JSON.parse(res)
              setGameState(savedGame);
            });
          AsyncStorage.getItem('currentProgress')
            .then((res) => {
              const savedProgress = parseInt(res);
              setProgress([savedProgress, totalPlates]);
            });
        };
      });

  }, [])

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
              setProgress([progress[0] - 1, totalPlates]);
              setGameState(gameArr);
              setRefresh(refresh + 1);
              const saveGame = JSON.stringify(gameState);
              AsyncStorage.setItem('currentGame', saveGame)
                .then(() => {
                  AsyncStorage.setItem('gameInProgress', 'true');
                  AsyncStorage.setItem('currentProgress', (progress[0] - 1).toString());
                });
            }
          }
        ]
      );
    } else {
      let gameArr = gameState;
      const plateIdx = gameArr.findIndex(p => p.id === plate.id);
      gameArr[plateIdx].found = true;
      setProgress([progress[0] + 1, totalPlates]);
      setGameState(gameArr);
      setRefresh(refresh + 1);
      const saveGame = JSON.stringify(gameState);
      Alert.alert(plate.score + " points for " + plate.name + "!", "", [{ text: "Cool!" }]);
      AsyncStorage.setItem('currentGame', saveGame)
        .then(() => {
          AsyncStorage.setItem('gameInProgress', 'true');
          AsyncStorage.setItem('currentProgress', (progress[0] + 1).toString());
        });
    };
  };

  const reset = () => {
    Alert.alert(
      "Reset Game",
      "are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => setRefresh(refresh + 1),
          style: "cancel"
        },
        {
          text: "Yes", onPress: () => {
            let gameArr = gameState;
            gameArr.forEach((plate) => {
              plate.found = false;
            });
            setProgress([0, totalPlates]);
            setGameState(gameArr);
            setRefresh(refresh + 1);
            AsyncStorage.setItem('currentGame', '');
            AsyncStorage.setItem('gameInProgress', 'false');
          }
        }
      ]
    );
  };

  const finishGame = () => {
    let nonUSACount = 0;
    gameState.forEach(plate => {
      //find num non-usa plates found
      if (plate.country != 'USA' && plate.found) {
        nonUSACount++;
      }
    })
    const today = new Date().toDateString()
    Alert.alert("Road Trip Stats:",
      today + '\n' +
      "License Plates Found: " + progress[0] + '\n' +
      "International Plates: " + nonUSACount
    );

  };


  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>

        <View style={styles.main}>
          <Text style={{ marginTop: 40, padding: 5, fontSize: '20px', fontWeight: 'bold' }}>Tap the plates below to mark them as found</Text>
          {gameState.map((plate) => {
            return (
              <View key={plate.id}>
                <TouchableOpacity onPress={() => { foundPlate(plate) }} style={styles.plateButton}>
                  <Image source={imgSrc[plate.id].source} style={plate.found ? styles.foundImage : styles.notFoundImage} />

                </TouchableOpacity>
              </View>
            );
          })}

        </View>
      </ScrollView>
      <View style={styles.buttonBar}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Found: {progress[0]}/{progress[1]} Score: {score}</Text>
        </View>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: Colors.signYellow }]} onPress={reset}>
          <Text style={{ fontSize: '30px' }}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.gameButton, { backgroundColor: Colors.signRed }]} onPress={finishGame}>
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
    flexWrap: 'wrap',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 35,
    backgroundColor: Colors.slateGrey
  },
  gameButton: {
    flex: 3,
    height: 60,
    margin: (0, 5, 0, 5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  foundImage: {
    flex: 'start',
    borderRadius: 15,
    marginBottom: -130,
    marginLeft: -70
  },
  main: {
    justifyContent: 'center'
  },
  notFoundImage: {
    opacity: 1,
    borderRadius: 15
  },
  plateButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center'
  },
  progressText: {
    color: 'white',
    fontSize: '30px'
  },
  text: {
    fontSize: '50px',
    fontWeight: '500',
  }
});

export default PlatesScreen;