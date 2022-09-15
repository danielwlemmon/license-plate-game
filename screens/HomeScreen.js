import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Colors, Fonts } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {

  return (
    <PaperProvider style={{ flexGrow: 1 }} >
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../assets/RoadCropped.jpg')} />

        <SafeAreaView style={styles.header}>
          <View style={[styles.headerContainer]}>
            <Text style={styles.headerText}>Road Trip Games</Text>
          </View>

          <View style={[styles.platesGameItems]}>
            <TouchableOpacity onPress={() => navigation.navigate('PlatesScreen')} style={styles.platesGameButton}>
              <View style={styles.outerContainer}>
                <View style={styles.whiteBorder}>
                  <View style={styles.innerContainer}>
                    <Text style={styles.buttonText}>License Plate!</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.topButtons}>
              <TouchableOpacity onPress={() => navigation.navigate('History')} style={[styles.gameButton, styles.historyButton]}>
                <View style={styles.historyWhiteBorder}>
                  <View style={styles.historyInnerContainer}>
                    <Text style={[styles.buttonText, { fontSize: 25, fontWeight: '300' }]}>Game History</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('InfoScreen')} style={[styles.gameButton, styles.infoButton]}>
                <View style={styles.infoWhiteBorder}>
                  <View style={styles.infoInnerContainer}>
                    <Text style={[styles.buttonText, { fontWeight: '900', fontSize: 30 }]} >ⓘ</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.scavengerGameItems]}>
            <TouchableOpacity onPress={() => navigation.navigate('ScavengerScreen')} style={styles.scavengerBtn}>
              <View style={styles.scavengerBtnContainer}>
                <Text style={styles.scavengerBtnText}>Scavenger Hunt</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CustomScreen')} style={styles.customBtn}>
              <View style={styles.customBtnContainer}>
                <Text style={styles.customBtnText}>Customize Items</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </PaperProvider >
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  buttonText: {

    ...Platform.select({
      ios: {
        fontFamily: Fonts.Avenir,
      }
    }),
    color: Colors.pearlWhite,
    fontSize: 30,
    fontWeight: '600'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 150
  },
  headerContainer: {
    justifyContent: 'center',
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: 20
      }
    })
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Main,
      }
    }),
    fontSize: 30,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: Colors.signGreen,
    flex: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  historyInnerContainer: {
    position: 'absolute',
    height: '95%',
    width: '99%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: Colors.signGreen,

  },
  historyWhiteBorder: {
    position: 'absolute',
    height: '88%',
    width: '97%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: Colors.pearlWhite,
  },
  infoButton: {
    flex: 3,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Colors.signBlue,
  },
  infoInnerContainer: {
    position: 'absolute',
    height: '94%',
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: Colors.signBlue,
  },
  infoWhiteBorder: {
    position: 'absolute',
    height: '91%',
    width: '89%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: Colors.pearlWhite,
  },
  innerContainer: {
    dispaly: 'none',
    position: 'absolute',
    height: '97%',
    width: '99%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: Colors.signGreen,
  },
  outerContainer: {
    height: 150,
    width: 350,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.signGreen,
  },
  platesGameButton: {
    justifyContent: 'center',
    height: 150,
  },
  platesGameItems: {
    flex: 4,
    paddingTop: 20,
  },
  scavengerBtn: {
  },
  scavengerBtnContainer: {
    marginBottom: 10,
    borderRadius: 8,
    height: 110,
    backgroundColor: Colors.slateBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.pearlWhite,
    borderWidth: 2,
  },
  scavengerBtnText: {
    color: Colors.pearlWhite,
    fontWeight: '600',
    ...Platform.select({
      ios: {
        fontSize: 30,
        fontFamily: 'AvenirNext-Regular',
      },
      android: {
        fontSize: 25,
      }
    })
  },
  scavengerGameItems: {
    width: 350,
    flex: 4,
    justifyContent: 'flex-start',
  },
  customBtn: {
  },
  customBtnContainer: {
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.slateGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customBtnText: {
    fontWeight: '300',
    color: Colors.pearlWhite,
    ...Platform.select({
      ios: {
        fontSize: 30,
        fontFamily: 'AvenirNext-Regular',
      },
      android: {
        fontSize: 25,
      }
    })
  },
  topButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  whiteBorder: {
    position: 'absolute',
    height: '91%',
    width: '98%',
    marginTop: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.pearlWhite,
  },
});