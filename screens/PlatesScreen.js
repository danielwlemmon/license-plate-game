import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import BlankPlates from '../PlateData.json';
import { Colors, Fonts } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imgSrc from '../assets/imgSrc';
import * as Location from 'expo-location';

function PlatesScreen({ navigation }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const totalPlates = 63;
  const [gameState, setGameState] = useState(BlankPlates.PlateData);
  const [refresh, setRefresh] = useState(0);
  const [progress, setProgress] = useState([0, totalPlates])
  const [score, setScore] = useState(0);
  const [displayPoints, setDisplayPoints] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [lastPlateName, setLastPlateName] = useState('');

  useEffect(() => {

    const retrieveData = async () => {

      try {

        const retrievedData = await AsyncStorage.getItem('gameInProgress') //setup initial game data

        if (!retrievedData) {

          setGameState(BlankPlates.PlateData);
          console.log('setting initial data')
        } else if (retrievedData == 'true') {

          let savedGame = await AsyncStorage.getItem('currentGame')
          savedGame = JSON.parse(savedGame);
          setGameState(savedGame);

          let savedProgress = await AsyncStorage.getItem('currentProgress');
          savedProgress = parseInt(savedProgress);
          setProgress([savedProgress, totalPlates]);

          let loadedScore = await AsyncStorage.getItem('currentScore');
          loadedScore = parseInt(loadedScore);
          setScore(loadedScore);
        };
      } catch (e) {
        console.log(e);
      };
    };

    retrieveData();

  }, []);

  //conditional radius rings for point scoring.  
  // < 80 degrees west && > 37 degrees north is the east coast.  
  //or perhaps make different conditions for the west and south areas since their states are so large
  //want to avoid giving bonus for same state plates when center of state is far away from border.
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
      getPointMultiple();
      let gameArr = gameState;
      const plateIdx = gameArr.findIndex(p => p.id === plate.id);
      gameArr[plateIdx].found = true;
      setProgress([progress[0] + 1, totalPlates]);
      setGameState(gameArr);
      setScore(score + plate.score);
      setLastPoints(plate.score);
      setLastPlateName(plate.name);
      setRefresh(refresh + 1);
      const saveGame = JSON.stringify(gameState);
      await AsyncStorage.setItem('currentGame', saveGame);
      await AsyncStorage.setItem('gameInProgress', 'true');
      await AsyncStorage.setItem('currentProgress', (progress[0] + 1).toString());
      await AsyncStorage.setItem('currentScore', (score + plate.score).toString());
      setDisplayPoints(true);
      setTimeout(() => setDisplayPoints(false), 1250);
    };
  };

  const getPointMultiple = async (plate) => {

    const foregroundPermission = await Location.requestForegroundPermissionsAsync();
    let foregroundSubscrition = null;

    if (foregroundPermission.granted) {
      try {
        foregroundSubscrition = await Location.watchPositionAsync(
          {
            // Tracking options
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          location => {
            const deviceLat = location.coords.latitude * Math.PI / 180;;
            const long = location.coords.longitude;

          }
        )
      } catch (e) {
        console.log(e);
      }
    }
  };

  const reset = async (isGameFinished = false) => {  //reset game stats and update stored game data

    if (isGameFinished == true) {
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
    } else {
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
    }
  };

  const finishGame = async () => {
    //await AsyncStorage.setItem('gameHistory', '');
    const today = new Date().toDateString();
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
        "id": 0,
        "date": today,
        "nonUSA": nonUSACount,
        "found": progress[0],
        "score": score
      };

      if (gameHistory != null) {
        //get a unique id to store.
        const ids = parsedGameHistory.map(game => {
          return game.id;
        });
        const maxId = Math.max(...ids);
        stats.id = (maxId + 1);

        parsedGameHistory.push(stats);
        await AsyncStorage.setItem('gameHistory', JSON.stringify(parsedGameHistory))
      } else {
        await AsyncStorage.setItem('gameHistory', JSON.stringify([stats]));
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
    reset(true);
  };

  //create score view fixed to center of the screen, turn on and off display use timer

  return (
    <View>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/plateBack.jpg')} />
      <ScrollView contentInset={{ top: -10, left: 0, bottom: 250, right: 0 }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>

        <SafeAreaView style={styles.main}>

          <View style={styles.topButtons}>

            <TouchableOpacity onPress={() => navigation.navigate('History')} style={[styles.gameButton, styles.historyButton]}>
              <View style={styles.historyWhiteBorder}>
                <View style={styles.historyInnerContainer}>
                  <Text style={styles.buttonText}>Game History</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('InfoScreen')} style={[styles.gameButton, styles.infoButton]}>
              <View style={styles.infoWhiteBorder}>
                <View style={styles.infoInnerContainer}>
                  <Text style={[styles.buttonText, { fontWeight: '900' }]} >ⓘ</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>
          {
            gameState ?
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
              </View> : <Text>Loading Plate Data...</Text>
          }

        </SafeAreaView >
      </ScrollView >
      {
        displayPoints ?
          <View style={{
            justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
          }
          } >
            <View style={styles.scoreAlert}>
              <Text style={{ fontSize: 30 }}> {lastPlateName}! {lastPoints} points!</Text>
            </View>
          </View >
          : null
      }
      <View style={styles.buttonBar}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Found: {progress[0]}/{progress[1]} Score: {score}</Text>
        </View>


        <TouchableOpacity style={[styles.resetButton, {}]} onPress={reset}>
          <View style={styles.resetBlackBorder}>
            <View style={styles.resetInnerContainer}>
              <Text style={[styles.buttonText, { color: Colors.black }]}>Restart</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.finishButton, { backgroundColor: Colors.signRed }]} onPress={finishGame}>
          <View style={[styles.resetBlackBorder, { backgroundColor: Colors.pearlWhite }]}>
            <View style={[styles.resetInnerContainer, { backgroundColor: Colors.signRed }]}>
              <Text style={styles.buttonText}>Finish</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 35,
    backgroundColor: Colors.slateGrey,
  },
  buttonText: {
    fontFamily: Fonts.Main,
    color: Colors.pearlWhite,
    fontSize: 30,
    fontWeight: '600'
  },
  finishButton: {
    flex: 3,
    height: 60,
    margin: (0, 5, 0, 5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  foundImage: {
    flex: 'start',
    borderRadius: 15,
    marginBottom: -130,
    marginLeft: -70
  },
  gameButton: {
    flex: 3,
    height: 60,
    margin: (0, 5, 0, 5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  historyButton: {
    backgroundColor: Colors.signGreen,
    flex: 12,
    marginLeft: 40
  },
  historyInnerContainer: {
    position: 'absolute',
    height: 46,
    width: 257,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: Colors.signGreen,

  },
  historyWhiteBorder: {
    position: 'absolute',
    height: 50,
    width: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: Colors.pearlWhite,
  },
  infoButton: {
    backgroundColor: Colors.signBlue,
    marginRight: 40
  },
  infoInnerContainer: {
    position: 'absolute',
    height: 46,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: Colors.signBlue,
  },
  infoWhiteBorder: {
    position: 'absolute',
    height: 50,
    width: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: Colors.pearlWhite,
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
  resetBlackBorder: {
    position: 'absolute',
    height: 55,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: Colors.black
  },
  resetButton: {
    flex: 3,
    margin: (0, 5, 0, 5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.signYellow,
    borderRadius: 7
  },
  resetInnerContainer: {
    position: 'absolute',
    height: 50,
    width: 195,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: Colors.signYellow,
  },
  scoreAlert: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 350,
    borderRadius: 15
  },
  scrollView: {

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