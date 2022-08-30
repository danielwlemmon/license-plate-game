import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Colors } from '../assets/colors';

function InfoScreen({ navigation }) {
  const backSymbol = '\u2190';
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
  iconContainer: {
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

export default InfoScreen;