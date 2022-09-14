import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert, Platform } from 'react-native';

import { Colors, Fonts } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function History({ navigation }) {
  const backSymbol = '\u2190';
  const [gameHistory, setGameHistory] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isGameHistory, setIsGameHistory] = useState(false);

  useEffect(() => {
    getGameHistory();
  }, [])

  const getGameHistory = async () => {
    try {
      const loadHistory = await AsyncStorage.getItem('gameHistory');
      setGameHistory(JSON.parse(loadHistory));
      if (loadHistory == '' || loadHistory == '[]' || loadHistory == undefined || loadHistory == null) {
        setIsGameHistory(false);
      } else {
        setIsGameHistory(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete? Are you sure?",
      "",
      [
        {
          text: "No",
          onPress: () => setRefresh(refresh + 1),
          style: "cancel"
        },
        {
          text: "Yes", onPress: async () => {
            let newGameHistory = gameHistory;
            for (let i = 0; i < gameHistory.length; i++) {
              if (newGameHistory[i].id == id) {
                newGameHistory.splice(i, 1)
                setGameHistory([...newGameHistory]);
                (newGameHistory.length == 0) ? setIsGameHistory(false) : null;
                try {
                  await AsyncStorage.setItem('gameHistory', JSON.stringify(newGameHistory));
                } catch (e) {
                  console.log(e)
                }
                return;
              }
            }
          }
        }])
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/curveyRoad.jpg')} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentInset={{ top: -50, left: 0, bottom: 250, right: 0 }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
        <SafeAreaView style={styles.main}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonContainer}>

            <View style={styles.outerButtonContainer}>
              <View style={styles.blackBorder}>
                <View style={styles.innerButtonContainer}>
                  <View style={styles.rotateText}>
                    <Text style={[styles.infoText]}>←</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {isGameHistory ?
            <View>
              {gameHistory.map((game) => {
                return (
                  <View key={game.id}>
                    <View style={styles.statsContainer}>
                      <View style={styles.whiteBorder}>
                        <View style={styles.innerContainer}>
                          <View style={styles.textContainer}>
                            <Text style={[styles.statText, { fontWeight: '700' }]}>{game.date}</Text>
                            <Text style={styles.statText}>Score: {game.score}</Text>
                            <Text style={styles.statText}>Found: {game.found} plates</Text>
                            <Text style={styles.statText}>non-USA: {game.nonUSA} plates</Text>
                            <Text style={styles.statText}>Top Find: {game.highName} {game.highPoint} points</Text>
                          </View>

                          <View style={styles.deleteContainer}>
                            <TouchableOpacity onPress={() => handleDelete(game.id)} style={styles.deleteButton}>
                              <View style={styles.iconContainer}>
                                <Image style={styles.trashIcon} source={require('../assets/trashIcon.png')} ></Image>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View> :
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', top: 75, left: 0, right: 0, bottom: 0 }}>
              <View >
                <Text style={[styles.statText, { color: 'white' }]}>No Game History Found...</Text>
              </View>
            </View>}

        </SafeAreaView>
      </ScrollView>
    </View>
  )
};

export default History;
const styles = StyleSheet.create({
  backButton: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  blackBorder: {
    position: 'absolute',
    height: '98%',
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.black,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    marginTop: 60,
    marginBottom: 20,
    flex: 1,
    transform: [{ rotate: '45deg' }]
  },
  iconContainer: {
    height: 40,
    width: 30,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.pearlWhite,
  },
  infoText: {
    fontSize: 60,
    ...Platform.select({
      android: {
        fontSize: 100,
        marginTop: -40,
        marginLeft: -15,
      }
    })
  },
  innerButtonContainer: {
    position: 'absolute',
    height: '98%',
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.signYellow,
  },
  innerContainer: {
    position: 'absolute',
    height: '97.5%',
    width: '99%',
    borderRadius: 21,
    backgroundColor: Colors.signBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  outerButtonContainer: {
    height: 70,
    width: 70,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.signYellow,
  },
  rotateText: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
    transform: [{ rotate: '-45deg' }]
  },
  statsContainer: {
    borderRadius: 25,
    height: 185,
    width: 350,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.signBlue
  },
  statText: {
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Main,
      }
    }),
    fontSize: 20,
    fontWeight: '500',
    color: Colors.pearlWhite
  },
  textContainer: {
    maxWidth: '80%',
    marginLeft: 20,
  },
  trashIcon: {
    height: 30,
    width: 25
  },
  whiteBorder: {
    position: 'absolute',
    height: '97%',
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.pearlWhite,
  },
});