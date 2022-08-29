import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View, ImageBackground, SafeAreaView, Text, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';

import { Colors } from '../assets/colors';

function History({ navigation }) {


  return (
    <SafeAreaView>
      <ScrollView>
        <Text>history screen</Text>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.goBack()}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
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