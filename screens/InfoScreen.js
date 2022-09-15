import React, { useState, useEffect, useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert, Platform } from 'react-native';
import { Colors, Fonts } from '../assets/colors';

function InfoScreen({ navigation }) {
  const backSymbol = '\u2190';
  return (
    <View style={styles.mainContainer} >
      <ImageBackground style={styles.backgroundImage} source={require('../assets/RV.jpg')} />

      <SafeAreaView style={{ flexGrow: 1 }}>
        <ScrollView >

          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonContainer}>
              <View style={styles.outerButtonContainer}>
                <View style={styles.blackBorder}>
                  <View style={styles.innerButtonContainer}>
                    <View style={styles.rotateText}>
                      <Text style={[styles.infoBtnText]}>←</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.outerContainer}>
              <View style={styles.whiteBorder}>
                <View style={styles.innerContainer}>
                  <Text style={styles.infoText}>Tap plates to record them as found.  Scores are based on several factors,
                    number of vehicles registered to a state (population for Canada), and points will be lowered for
                    plates found near the place for which they belong.</Text>
                </View>
              </View>
            </View>
            <View style={styles.outerContainer}>
              <View style={styles.whiteBorder}>
                <View style={styles.innerContainer}>
                  <Text style={styles.infoText}>Data will remain locally on your device.  Location data
                    is only used temporarily to calculate distances.  No data is sent to this developer or any third parties.</Text>
                </View>
              </View>
            </View>

          </View>

        </ScrollView>
      </SafeAreaView >
    </View>
  )
};

export default InfoScreen;

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
    height: '97%',
    width: '97%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.black,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    marginLeft: 50,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    transform: [{ rotate: '45deg' }]
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: Colors.pearlWhite,
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Main,
      }
    }),
    fontSize: 25,
    padding: 20
  },
  infoBtnText: {
    color: Colors.black,
    fontSize: 60,
    fontWeight: '500',
    ...Platform.select({
      android: {
        fontSize: 80,
        marginTop: -40,
      }
    })
  },
  innerButtonContainer: {
    position: 'absolute',
    height: '93%',
    width: '93%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.signYellow,

  },
  innerContainer: {
    position: 'absolute',
    height: "99%",
    width: "99%",
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 17,
    backgroundColor: Colors.signBlue,
  },
  mainContainer: {
    flex: 1,
  },
  outerButtonContainer: {
    height: 71,
    width: 71,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.signYellow,
  },
  outerContainer: {
    height: 330,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.signBlue,
    marginBottom: 20
  },
  rotateText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -25,
    transform: [{ rotate: '-45deg' }]
  },
  topContainer: {
    position: 'absolute',
    height: 300,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.signBlue,
  },
  whiteBorder: {
    position: 'absolute',
    height: "97%",
    width: "97%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.pearlWhite,
  },

});