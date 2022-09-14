import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, AppState, Alert, Platform } from 'react-native';
import { Fonts, Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseScavengerData from '../ScavengerData.json';


export default function ScavengerScreen({ navigation }) {
  const [baseArr, setBaseArr] = useState([...BaseScavengerData.ScavengerData]);
  const [currentGrid, setCurrentGrid] = useState();
  const [gridLevel, setGridLevel] = useState();
  const [refresh, setRefresh] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [progressBar, setProgressBar] = useState(1);

  useEffect(() => {

    const retrieveData = async () => {
      try {
        const retrievedData = await AsyncStorage.getItem('gameInProgress');

        if (!retrievedData) {
          setLevel(1);
          //console.log('setting initial data')
        } else if (retrievedData == 'true') {
          let savedGrid = await AsyncStorage.getItem('currentGrid');
          let savedLevel = await AsyncStorage.getItem('gridLevel');
          let savedProgressBar = await AsyncStorage.getItem('progressBar');

          savedGrid = JSON.parse(savedGrid);
          savedLevel = parseInt(savedLevel);
          savedProgressBar = parseInt(savedProgressBar);

          setCurrentGrid(savedGrid);
          setGridLevel(savedLevel);
          setProgressBar(savedProgressBar);
          setRefresh(refresh + 1);
        };
      } catch (e) {
        console.log(e);
      };
    };

    retrieveData();
  }, []);

  const setLevel = async (nextLevel) => {
    if (nextLevel == 4) {
      setProgressBar(100);
      Alert.alert(
        "Congratulation!",
        "You have won the scavenger hunt",
        [
          {
            text: "Done",
            onPress: () => {
              cancelGame();
            }
          },
          {
            text: "Play Again",
            onPress: () => setLevel(1)
          }
        ]
      )
    } else {
      (nextLevel == 2 || nextLevel == 3) ? [setTimeout(() => setDisplayProgress(false), 1000), setDisplayProgress(true)] : null;
      let gameArr = [[], [], []];
      let randItem = 0;
      let newProgressBar = (nextLevel != 1) ? newProgressBar = (nextLevel - 1) * 33 : 1;
      let oldBaseArr = JSON.parse(JSON.stringify(BaseScavengerData.ScavengerData));
      let levelItems = [];
      oldBaseArr.forEach(item => {
        (item.difficulty == nextLevel) ? levelItems.push(item) : null;
      })
      //build new grid
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          randItem = Math.floor(Math.random() * levelItems.length);
          gameArr[i].push(levelItems[randItem]);
          levelItems.splice(randItem, 1);
        }
      };

      //store new game state
      let gameArrString = JSON.stringify([...gameArr]);
      try {
        await AsyncStorage.setItem('progressBar', (newProgressBar).toString())
        await AsyncStorage.setItem('gameInProgress', 'true');
        await AsyncStorage.setItem('currentGrid', (gameArrString));
        await AsyncStorage.setItem('gridLevel', (nextLevel).toString());
      } catch (e) {
        console.log('unable to store');
      }
      //update state
      setProgressBar(newProgressBar);
      setCurrentGrid([...gameArr]);
      setGridLevel(nextLevel);
      setBaseArr([...BaseScavengerData.ScavengerData])
      setRefresh(refresh + 1);
    }
  };

  const foundItem = async (item, rowI) => {
    let gridChange = [...currentGrid];
    let nextProgressBar = progressBar;
    const itemIdx = gridChange[rowI].findIndex(i => i.id === item.id);
    if (item.found != true) { //find
      (progressBar == 31 || progressBar == 63) ? null : nextProgressBar += 5; //don't add 5 if next step is level up
      gridChange[rowI][itemIdx].found = true;
    } else { //unfind
      nextProgressBar -= 5
      gridChange[rowI][itemIdx].found = false;
    }

    //store updated game data
    let gridChangeStr = JSON.stringify(gridChange);
    try {
      await AsyncStorage.setItem('progressBar', (nextProgressBar).toString())
      await AsyncStorage.setItem('currentGrid', (gridChangeStr));
    } catch (e) {
      console.log('unable to set Data')
    }

    //set updated game state
    setProgressBar(nextProgressBar);
    setCurrentGrid([...gridChange]);
    checkThree();
  };

  const checkThree = () => {

    const rowWin = ((currentGrid[0][0].found && currentGrid[0][1].found && currentGrid[0][2].found) ||
      (currentGrid[1][0].found && currentGrid[1][1].found && currentGrid[1][2].found) ||
      (currentGrid[2][0].found && currentGrid[2][1].found && currentGrid[2][2].found))
    if (rowWin) {
      setLevel(gridLevel + 1);
    } else {
      const colWin = ((currentGrid[0][0].found && currentGrid[1][0].found && currentGrid[2][0].found) ||
        (currentGrid[0][1].found && currentGrid[1][1].found && currentGrid[2][1].found) ||
        (currentGrid[0][2].found && currentGrid[1][2].found && currentGrid[2][2].found))
      if (colWin) {
        setLevel(gridLevel + 1)
      } else if (currentGrid[1][1].found) {
        const crossWin = ((currentGrid[0][0].found && currentGrid[2][2].found) || (currentGrid[0][2].found && currentGrid[2][0].found))
        if (crossWin) {
          setLevel(gridLevel + 1)
        }
      } else {
        setRefresh(refresh + 1);
      }
    }

  }

  const cancelGame = async () => {
    try {
      await AsyncStorage.setItem('gameInProgress', 'false');
      await AsyncStorage.setItem('currentGrid', '');
      await AsyncStorage.setItem('gridLevel', '');
      await AsyncStorage.setItem('gameInProgress', '');
      await AsyncStorage.setItem('progressBar', '1')
    } catch (e) {
      console.log('unable to set Data')
    };
    setGridLevel(1);
    setProgressBar(1);
    navigation.goBack();
  }

  return (

    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <View style={[styles.topRowArea]}>
          <View style={{ flex: 1 }}>

          </View>
          <View style={{ flex: 1, borderWidth: 2, borderColor: Colors.slateGrey }}>
            <View style={{ height: '100%', width: `${progressBar}%`, backgroundColor: Colors.scavengerButtonPress }}>

            </View>
          </View>

          {
            displayProgress ?
              <View style={styles.progress} >
                <Text style={styles.statusText}>Advanced to Next Round!</Text>
              </View>
              :
              <View style={styles.progressStats}>
                <Text style={styles.statusText}>Level {gridLevel}/3</Text>
              </View>
          }
        </View>

        <View style={styles.midArea}>
          {
            currentGrid ?
              currentGrid.map((row, i) => {
                return (
                  <View key={i} style={styles.buttonRow} >
                    {
                      row.map((item) => {
                        return (
                          <TouchableOpacity style={styles.gameButton} onPress={() => foundItem(item, i)} key={item.id} >
                            <View style={item.found ? styles.buttonFoundContainer : styles.buttonContainer} key={item.id} >
                              <Text style={styles.buttonText} >{item.text}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                )
              }) : <Text>Loading Game...</Text>
          }
        </View>

        <View style={styles.bottomArea}>
          <View id='placeholder container' style={{ flex: 1 }}>

          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.bottomButtonContainer}>
              <Text style={styles.buttonText}>Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelGame} style={styles.backButton}>
            <View style={[styles.bottomButtonContainer, { backgroundColor: Colors.slateRed }]}>
              <Text style={styles.buttonText}>Cancel Game</Text>
            </View>
          </TouchableOpacity>
        </View>


      </SafeAreaView >

    </View >
  )
}

const styles = StyleSheet.create({
  backButton: {
    flex: 1,
    marginBottom: 10,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomArea: {
    flex: 3,
    alignItems: 'center'
  },
  bottomButtonContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.slateBlue,
  },
  buttonContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: Colors.scavengerButton,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonFoundContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    ...Platform.select({
      android: {
        elevation: 1
      }
    })
  },
  buttonRow: {
    flex: 2,
    height: '33%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonText: {
    padding: 2,
    textAlign: 'center',
    color: Colors.pearlWhite,
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Avenir,
        fontSize: 25,
      },
      android: {
        fontSize: 22,
      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: Colors.pearlWhite,
    justifyContent: 'center',
  },
  gameButton: {
    flex: 1,
    backgroundColor: Colors.scavengerButtonPress,
    borderRadius: 10,
    margin: 1
  },
  gridArea: {
    flex: 2,
    position: 'absolute',
    height: 400,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  midArea: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  progress: {
    flex: 1,
    backgroundColor: Colors.slateYellow,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressStats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText: {
    padding: 2,
    textAlign: 'center',
    color: 'black',
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Avenir,
        fontSize: 30,
      },
      android: {
        fontSize: 25,
      }
    })
  },
  topRowArea: {
    flex: 3,
    justifyContent: 'flex-end'
  },
});