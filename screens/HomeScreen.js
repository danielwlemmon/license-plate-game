import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { DefaultTheme } from 'react-native-paper';
import { Colors } from '../assets/colors';

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../assets/RoadCropped.jpg')} />

        <SafeAreaView style={styles.header}>
          <Text style={styles.headerText}>Collect License Plates</Text>
          <Text style={styles.headerText}>North America</Text>
        </SafeAreaView>
        {/* <TouchableOpacity onPress={() => Alert.alert("Game Begins now")} style={styles.button}>
          <Text style={styles.buttonText}>Start New Roadtrip</Text>
        </TouchableOpacity> */}
        <Button style={styles.button} mode="contained" onPress={() => navigation.navigate('PlatesScreen')}>
          Begin Game
        </Button>
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
    fontSize: 40,
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
    paddingTop: 10
  }
});

export default HomeScreen