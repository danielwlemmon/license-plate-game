import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';

import { Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function History({ navigation }) {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    getGameHistory();
  }, [])

  const getGameHistory = async () => {
    try {
      const loadHistory = await AsyncStorage.getItem('gameHistory');
      setGameHistory(JSON.parse(loadHistory));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.goBack()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
        {gameHistory ? <View style={{}}>
          {gameHistory.map((game) => {
            return (
              <View key={game.score}>
                <Text>{game.date}</Text>
                <Text>{game.score}</Text>
              </View>
            )
          })}
        </View> : <Text style={{ fontSize: 30 }}>No Game History Found...</Text>}
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonBar: {
    flex: 1,
    backgroundColor: Colors.slateGrey,
  },
})

export default History;