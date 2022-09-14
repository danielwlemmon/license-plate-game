import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Colors, Fonts } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const [buttonText, setButtonText] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('gameInProgress')
      .then((res) => {
        if (res == 'false' || !res) {
          setButtonText('BEGIN GAME')
        } else {
          setButtonText('CONTINUE GAME')
        };
      });
  }, [])

  return (
    <PaperProvider style={{ flexGrow: 1 }} >
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../assets/RoadCropped.jpg')} />

        <SafeAreaView style={styles.header}>
          <Text style={styles.headerText}>Collect License Plates</Text>
          <Text style={styles.headerText}>North America</Text>
        </SafeAreaView>

        <TouchableOpacity onPress={() => navigation.navigate('PlatesScreen')} style={styles.button}>
          <View style={styles.outerContainer}>
            <View style={styles.whiteBorder}>
              <View style={styles.innerContainer}>
                <Text style={styles.buttonText}>{buttonText}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </PaperProvider>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
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
    top: '15%',
    position: 'absolute',
    alignItems: 'center',
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
  innerContainer: {
    position: 'absolute',
    height: 132,
    width: 339,
    marginTop: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: Colors.signGreen,
  },
  outerContainer: {
    height: 150,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.signGreen,
  },
  whiteBorder: {
    position: 'absolute',
    height: 136,
    width: 344,
    marginTop: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: Colors.pearlWhite,
  },
});