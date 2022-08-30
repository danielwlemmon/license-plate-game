import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Colors } from '../assets/colors';

function InfoScreen({ navigation }) {
  const backSymbol = '\u2190';
  return (
    <View style={styles.mainContainer} >
      <ImageBackground style={styles.backgroundImage} source={require('../assets/RV.jpg')} />
      <SafeAreaView style={{ flexGrow: 1 }}>
        <ScrollView>
          <View style={styles.buttonBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 40 }}>{backSymbol}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.textContainer}>
              <Text style={styles.infoText}>Tap plates to record them as found.  Scores are based on several factors,
                number of vehicles registered to a state (population for Canada), and distance from
                location found to the plate's regional location. i.e. A South Dakota plate found while
                in Florida. {'\n'} Conversely, points will be lower for plates that belong to nearby areas.
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.infoText}>Privacy - Data will remain locally on your device.  Location data
                is only used temporarily to calculate distances.  No data is sent to this developer or any third parties.
              </Text>
            </View>
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
  infoText: {
    fontSize: 25,
    padding: (0, 10, 0, 10)
  },
  mainContainer: {
    flex: 1
  },
  textContainer: {
    flexDirection: 'row',
    margin: (0, 20, 0, 20),
    backgroundColor: Colors.signBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})

export default InfoScreen;