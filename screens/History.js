import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';

import { Colors } from '../assets/colors';
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
    <View style={styles.mainContainer} >
      <ImageBackground style={styles.backgroundImage} source={require('../assets/curveyRoad.jpg')} />
      <SafeAreaView style={{ flexGrow: 1 }}>
        <ScrollView>
          <View style={styles.buttonBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 40 }}>{backSymbol}</Text>
            </TouchableOpacity>
          </View>
          {isGameHistory ? <View style={{ flex: 1 }}>
            {gameHistory.map((game) => {
              return (
                <View key={game.id} style={styles.gameCard}>
                  <View style={styles.statsContainer}>
                    <Text style={[styles.statText, { fontWeight: '800' }]}>{game.date}</Text>
                    <Text style={styles.statText}>Score: {game.score}</Text>
                    <Text style={styles.statText}>Found: {game.found} plates</Text>
                  </View>
                  <View style={styles.deleteContainer}>
                    <TouchableOpacity onPress={() => handleDelete(game.id)} style={styles.deleteButton}>
                      <View style={styles.iconContainer}>
                        <Image style={styles.trashIcon} source={require('../assets/trashIcon.png')} ></Image>
                      </View>
                    </TouchableOpacity>
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
        </ScrollView>
      </SafeAreaView >
    </View>
  )
};

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
  buttonBar: {
    flex: 1,
    width: 60,
    marginLeft: 20,
    backgroundColor: Colors.slateGrey,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
  },
  deleteButton: {
    margin: 0,
    padding: 0
  },
  deleteContainer: {
    height: 60,
    flex: .75,
    marginRight: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: Colors.signRed
  },
  gameCard: {
    flexDirection: 'row',
    margin: (0, 20, 0, 20),
    flex: 1,
    backgroundColor: Colors.signBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1
  },
  statsContainer: {
    padding: 10,
    flex: 4
  },
  statText: {
    fontSize: 25
  },
  trashIcon: {
    resizeMode: 'cover',
    height: 30,
    width: 25,
  },
})

export default History;