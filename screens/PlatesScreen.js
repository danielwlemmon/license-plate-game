import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import BlankPlates from '../PlateData.json';
import { Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imgSrc from '../assets/imgSrc';


function PlatesScreen({ navigation }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const totalPlates = 63;
  const [gameState, setGameState] = useState(BlankPlates.PlateData);
  const [refresh, setRefresh] = useState(0);
  const [progress, setProgress] = useState([0, totalPlates])
  const [score, setScore] = useState(0);

  useEffect(() => {

    const retrieveData = async () => {

      try {

        const retrievedData = await AsyncStorage.getItem('gameInProgress') //setup initial game data
        if (!retrievedData) {

          setGameState(BlankPlates.PlateData);
          console.log('setting initial data')
        } else if (retrievedData == 'true') {

          const savedGame = await AsyncStorage.getItem('currentGame')
          savedGame = JSON.parse(savedGame);
          setGameState(savedGame);

          const savedProgress = AsyncStorage.getItem('currentProgress')
          savedProgress = parseInt(savedProgress);
          setProgress([savedProgress, totalPlates]);

          const loadedScore = AsyncStorage.getItem('currentScore')
          loadedScore = pareseInte(loadedScore);
          setScore(loadedScore);

        };
      } catch (e) {
        console.log(e);
      };
    };


  }, []);

  const dataHandler = async () => {
    await retrieveData();
    setDataLoaded(true);
  }

  const foundPlate = async (plate) => {
    if (plate.found) {
      Alert.alert( //confirm user wants to undo plate find
        "Do you want to mark " + plate.name + " as not found?",
        "",
        [
          {
            text: "No",
            onPress: () => setRefresh(refresh + 1),
            style: "cancel"
          },
          {
            text: "Yes", onPress: async () => {
              let gameArr = gameState;
              const plateIdx = gameArr.findIndex(p => p.id === plate.id);
              gameArr[plateIdx].found = false;
              setProgress([progress[0] - 1, totalPlates]);
              setGameState(gameArr);
              setScore(score - plate.score);
              setRefresh(refresh + 1);
              const saveGame = JSON.stringify(gameState);
              await AsyncStorage.setItem('currentGame', saveGame);
              await AsyncStorage.setItem('gameInProgress', 'true');
              await AsyncStorage.setItem('currentProgress', (progress[0] - 1).toString());
              await AsyncStorage.setItem('currentScore', (score - plate.score).toString());
            }
          }
        ]
      );
    } else { //mark plate as found, update game stats

      let gameArr = gameState;
      const plateIdx = gameArr.findIndex(p => p.id === plate.id);
      gameArr[plateIdx].found = true;
      setProgress([progress[0] + 1, totalPlates]);
      setGameState(gameArr);
      setScore(score + plate.score);
      setRefresh(refresh + 1);
      const saveGame = JSON.stringify(gameState);
      await AsyncStorage.setItem('currentGame', saveGame);
      await AsyncStorage.setItem('gameInProgress', 'true');
      await AsyncStorage.setItem('currentProgress', (progress[0] + 1).toString());
      await AsyncStorage.setItem('currentScore', (score + plate.score).toString());
    };
  };

  const reset = () => {  //reset game stats and update stored game data
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
          text: "Yes", onPress: async () => {
            try {
              let gameArr = gameState;
              gameArr.forEach((plate) => {
                plate.found = false;
              });
              setProgress([0, totalPlates]);
              setGameState(gameArr);
              setScore(0);
              setRefresh(refresh + 1);
              await AsyncStorage.setItem('currentGame', '');
              await AsyncStorage.setItem('gameInProgress', 'false');
              await AsyncStorage.setItem('currentProgress', '0');
              await AsyncStorage.setItem('currentScore', '0');
            } catch (e) {
              console.log(e);
            };
          }
        }
      ]
    );
  };

  const finishGame = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem('gameHistory', '');
    let nonUSACount = 0;
    gameState.forEach(plate => {
      //find num non-usa plates found
      if (plate.country != 'USA' && plate.found) {
        nonUSACount++;
      }
    });

    try { //get current game stats, add new game stats and save
      let gameHistory = await AsyncStorage.getItem('gameHistory');
      let parsedGameHistory = JSON.parse(gameHistory);
      const stats = {
        "date": today,
        "found": progress[0],
        "score": score
      };

      if (gameHistory != null) {
        // parsedGameHistory.push(stats);
        // await AsyncStorage.setItem('gameHistory', JSON.stringify(parsedGameHistory))
      } else {
        //await AsyncStorage.setItem('gameHistory', JSON.stringify([stats]));
      }

    } catch (e) {
      console.log(e);
    };

    Alert.alert("Road Trip Stats:", //display stats
      today + '\n' +
      "License Plates Found: " + progress[0] + '\n' +
      "International Plates: " + nonUSACount + '\n' +
      "Score: " + score
    )

  };

  //create score view fixed to center of the screen, turn on and off display use timer

  return (
    <View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>

        <View style={styles.main}>
          <Text style={{ marginTop: 40, padding: 5, fontSize: '20px', fontWeight: 'bold' }}>Tap the plates below to mark them as found</Text>
          <View style={styles.topButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('History')} style={[styles.gameButton, styles.historyButton]}>
              <Text style={{ fontSize: '30px' }}>Game History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gameButton, styles.infoButton]}>
              <Text style={{ fontSize: '25px', fontWeight: '600' }}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          {gameState ?
            <View>
              {gameState.map((plate) => {
                return (
                  <View key={plate.id}>
                    <TouchableOpacity onPress={() => { foundPlate(plate) }} style={styles.plateButton}>
                      <Image source={imgSrc[plate.id].source} style={plate.found ? styles.foundImage : styles.notFoundImage} />

                    </TouchableOpacity>
                  </View>
                );
              })}
            </View> : <Text>Loading Plate Data...</Text>}

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
    backgroundColor: Colors.slateGrey,
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
  historyButton: {
    backgroundColor: Colors.signGreen,
    flex: 12,
    marginLeft: 40
  },
  infoButton: {
    backgroundColor: Colors.signBlue,
    marginRight: 40
  },
  main: {
    justifyContent: 'center',
    paddingBottom: 300
  },
  notFoundImage: {
    flex: 1,
    opacity: 1,
    borderRadius: 15
  },
  plateButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: '20px',
    margin: 10
  },
  text: {
    fontSize: '50px',
    fontWeight: '500',
  },
  topButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  }

});

export default PlatesScreen;