import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { DefaultTheme } from 'react-native-paper';
import { Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const [buttonText, setButtonText] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('gameInProgress')
      .then((res) => {
        if (res == 'false' || !res) {
          setButtonText('Begin Game')
        } else {
          setButtonText('Continue Game')
          console.log(res);
        };
      });
  }, [])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollView}>
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../assets/RoadCropped.jpg')} />

        <SafeAreaView style={styles.header}>
          <Text style={styles.headerText}>Collect License Plates</Text>
          <Text style={styles.headerText}>North America</Text>
        </SafeAreaView>
        <TouchableOpacity onPress={() => navigation.navigate('PlatesScreen')} style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  button: {
    height: 75,
    width: 350,
    marginTop: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.signGreen,
  },
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: '30%',
    position: 'absolute',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 30,
    color: Colors.white,
    alignSelf: "center",
    textTransform: "uppercase"
  },
  scrollView: {
    backgroundColor: DefaultTheme.colors.background,
  }
});

export default HomeScreen