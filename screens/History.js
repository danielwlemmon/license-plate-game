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
    // <View style={styles.mainContainer} >
    //   <ImageBackground style={styles.backgroundImage} source={require('../assets/curveyRoad.jpg')} />
    //   <SafeAreaView style={{ flexGrow: 1 }}>
    //     <ScrollView>
    //       <View style={styles.buttonBar}>
    //         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
    //           <Text style={{ fontSize: 40 }}>{backSymbol}</Text>
    //         </TouchableOpacity>
    //       </View >
    //       {isGameHistory ? <View style={{ flex: 1 }}>
    //         {gameHistory.map((game) => {
    //           return (
    //             <View key={game.id} style={styles.gameCard}>
    //               <View style={styles.whiteBorder}>
    //                 <View style={styles.innerContainer}>
    //                   <View style={styles.statsContainer}>
    //                     <Text style={[styles.statText, { fontWeight: '800' }]}>{game.date}</Text>
    //                     <Text style={styles.statText}>Score: {game.score}</Text>
    //                     <Text style={styles.statText}>Found: {game.found} plates</Text>
    //                     <Text style={styles.statText}>non-USA: {game.nonUSA} plates</Text>
    //                   </View>

    //                   <View style={styles.deleteContainer}>
    //                     <TouchableOpacity onPress={() => handleDelete(game.id)} style={styles.deleteButton}>
    //                       <View style={styles.iconContainer}>
    //                         <Image style={styles.trashIcon} source={require('../assets/trashIcon.png')} ></Image>
    //                       </View>
    //                     </TouchableOpacity>
    //                   </View>
    //                 </View>
    //               </View>
    //             </View>
    //           )
    //         })}
    //       </View> :
    //         <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', top: 75, left: 0, right: 0, bottom: 0 }}>
    //           <View >
    //             <Text style={[styles.statText, { color: 'white' }]}>No Game History Found...</Text>
    //           </View>
    //         </View>}
    //     </ScrollView>
    //   </SafeAreaView >
    // </View>
    <View style={{ flexGrow: 1 }}>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/curveyRoad.jpg')} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentInset={{ top: -50, left: 0, bottom: 250, right: 0 }} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
        <SafeAreaView style={styles.main}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonContainer}>

            <View style={styles.outerButtonContainer}>
              <View style={styles.blackBorder}>
                <View style={styles.innerButtonContainer}>
                  <View style={styles.rotateText}>
                    <Text style={[styles.infoText, { color: Colors.black, fontSize: 60, fontWeight: '500' }]}>←</Text>
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
    height: 68,
    width: 68,
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
  innerButtonContainer: {
    position: 'absolute',
    height: 63,
    width: 63,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.signYellow,
  },
  innerContainer: {

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
    justifyContent: 'center',
    alignItems: 'start',
    marginLeft: -25,
    transform: [{ rotate: '-45deg' }]
  },
  statsContainer: {
    borderRadius: 25,
    height: 175,
    width: 350,
    marginTop: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.signBlue
  },
  whiteBorder: {
    position: 'absolute',
    height: 165,
    width: 340,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Colors.pearlWhite,
  },
})

export default History;