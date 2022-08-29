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
        {gameHistory ? <View style={{ flex: 1 }}>
          {gameHistory.map((game) => {
            return (
              <View key={game.id} style={styles.gameCard}>
                <Text style={styles.statText}>Date: {game.date}</Text>
                <Text style={styles.statText}>Score: {game.score}</Text>
                <Text style={styles.statText}>ID: {game.id}</Text>
                <Text style={styles.statText}>Found: {game.found} plates</Text>

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
  gameCard: {
    marginBottom: 20,
  },
  statText: {
    fontSize: 25
  },
})

export default History;