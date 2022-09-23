import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Fonts, Colors } from '../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseScavengerData from '../ScavengerData.json';
import { TextInput } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function CustomScreen({ navigation }) {
  const [allScavengerItems, setAllScavengerItems] = useState();
  const [mappedItems, setMappedItems] = useState();
  const [buttonSelect, setButtonSelect] = useState([true, false, false]);
  const [levelSelect, setLevelSelect] = useState();
  const [inputText, onChangeText] = useState('');

  useEffect(() => {
    const getStoredData = async () => {
      try {
        let dataRetrieved = await AsyncStorage.getItem('scavengerItems')

        if (!dataRetrieved) {
          //console.log('data not exist')
          setAllScavengerItems(JSON.parse(JSON.stringify(BaseScavengerData.ScavengerData)));
          levelChange(JSON.parse(JSON.stringify(BaseScavengerData.ScavengerData)), 1);
        } else {
          dataRetrieved = JSON.parse(dataRetrieved);
          setAllScavengerItems([...dataRetrieved]);
          levelChange(dataRetrieved, 1);
        };
      } catch (e) {
        console.log('unable to get data');
      }
    }
    getStoredData();
  }, []);

  const levelChange = (allItems, l) => {
    const selectItems = []
    onChangeText('');
    allItems.forEach((item) => {
      return ((item.difficulty == l) ? selectItems.push(item) : null);
    });

    setMappedItems(
      selectItems.map((item, i) => ({
        key: `${i}`,
        id: item.id,
        text: item.text,
        difficulty: item.difficulty
      }))
    );


    let tempButtonSelect = [...buttonSelect];
    tempButtonSelect = [false, false, false];
    tempButtonSelect[l - 1] = true;
    setButtonSelect([...tempButtonSelect]);
    setLevelSelect(l);
  };

  const handleDelete = async (rowMap, rowKey, item) => {
    closeRow(rowMap, rowKey);

    let numLevelItems = 0;
    allScavengerItems.forEach(element => {
      (element.difficulty === item.difficulty) ? numLevelItems++ : null
    });

    if (numLevelItems == 9) {
      Alert.alert(
        "Unable to remove",
        "There must be at least 9 items",
        [{
          text: "OK",
        }]
      )
    } else {
      //update mapped items
      const tempMappedItems = [...mappedItems];
      const prevIndex = tempMappedItems.findIndex(item => item.key === rowKey);
      tempMappedItems.splice(prevIndex, 1);
      setMappedItems([...tempMappedItems]);

      //update full list
      const tempAllItems = [...allScavengerItems];
      const longIndex = tempAllItems.findIndex(itemFromAll => item.id === itemFromAll.id)
      tempAllItems.splice(longIndex, 1);
      setAllScavengerItems(JSON.parse(JSON.stringify(tempAllItems)));
      storeData(tempAllItems);
    }
  };

  const restoreDefault = async () => {
    try {
      await AsyncStorage.setItem('scavengerItems', '');
    } catch (e) {
      console.log(e);
    }
    setAllScavengerItems([...BaseScavengerData.ScavengerData]);
    levelChange([...BaseScavengerData.ScavengerData], levelSelect);
  };

  const addItem = (itemText, level) => {
    const tempAllItems = [...allScavengerItems];
    const ids = tempAllItems.map(item => {
      return item.id;
    });
    const maxID = Math.max(...ids);
    const newItem = {
      "id": (maxID + 1),
      "text": inputText,
      "difficulty": levelSelect,
      "found": false
    };
    tempAllItems.push(newItem);
    setAllScavengerItems([...tempAllItems]);
    levelChange(tempAllItems, levelSelect);
    storeData(tempAllItems);
  };

  const storeData = async (allItems) => {
    const allItemsStr = JSON.stringify(allItems);
    await AsyncStorage.setItem('scavengerItems', allItemsStr);
  }

  const renderItem = (data, rowMap) => (
    <View style={[styles.rowFront]}>
      <Text style={styles.deleteText}>{data.item.text}</Text>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={[styles.rowBack]}>
      <View>
        <Text>Left</Text>
      </View>
      <View style={styles.backRightBtn}>
        <TouchableOpacity onPress={() => closeRow(rowMap, data.item.key)} style={{ flexDirection: 'row' }}>
          <View style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={30}
              style={styles.trash}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(rowMap, data.item.key, data.item)} style={{ flexDirection: 'row' }}>
          <View style={styles.deleteButton}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const closeRow = (rowMap, rowKey) => {

    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container,]}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.slateBlue}
        />
        <View style={styles.topSectionContainer}>

          <View style={styles.navBackContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBackBtn}>
              <View style={styles.navBackTextContainer}>
                <Text style={styles.navBackText}>←</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.restoreDefaultContainer}>
              <TouchableOpacity onPress={() => restoreDefault()} >
                <Text style={styles.restoreDefaultText}>Restore Default Items</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.levelButtonsContainer}>
            {buttonSelect.map((b, i) => {
              return (
                <TouchableOpacity onPress={() => levelChange(allScavengerItems, i + 1)} key={i} style={b ? styles.levelButtonPressed : styles.levelButton}>
                  <Text style={styles.deleteText}>Level {i + 1}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onSubmitEditing={() => {
                (inputText.length < 2) ? console.log('test') : addItem()
              }}
              maxLength={24}
              autoCorrect={false}
              onChangeText={onChangeText}
              placeholder={'Scavenger Hunt Item'}
              value={inputText}>
            </TextInput>
            <TouchableOpacity onPress={() => addItem()} style={[(inputText.length < 2) ? { display: 'none' } : null, styles.addButton]} disabled={(inputText.length < 2) ? true : false}>
              <Text style={[styles.deleteText, { fontWeight: 'bold' }]}>+</Text>
            </TouchableOpacity>

          </View>

        </View>

        {
          allScavengerItems ?
            <SwipeListView
              showsHorizontalScrollIndicator={false}
              disableRightSwipe={true}
              data={mappedItems}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-120}
            />
            : <Text>Loading Items</Text>
        }

      </SafeAreaView>
    </View >
  )
};

const styles = StyleSheet.create({
  addButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: Colors.scavengerButtonPress,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backBtn: {
  },
  backBtnInner: {
    alignItems: 'center',
  },
  backLeftBtn: {
    alignItems: 'flex-end',
    backgroundColor: 'green',
    paddingRight: 16,
  },
  backRightBtn: {
    flexDirection: 'row'
  },
  backRightBtnLeft: {
    backgroundColor: Colors.slateBlue
  },
  backRightBtnRight: {
    backgroundColor: 'red',
  },
  closeButton: {
    width: 60,
    backgroundColor: Colors.slateBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    width: 60,
    backgroundColor: Colors.signRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    padding: 2,
    textAlign: 'center',
    color: 'black',
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Avenir,
        fontSize: 23,
      },
      android: {
        fontSize: 20,
      }
    })
  },
  input: {
    marginLeft: 10,
    marginRight: 5,
    flex: 5,
    paddingLeft: 10,
    borderWidth: 3,
    borderColor: Colors.slateGrey,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        fontFamily: Fonts.Avenir,
        fontSize: 25,
      },
      android: {
        fontSize: 20,
      }
    })
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    marginBottom: 5
  },
  itemContainer: {
    height: 50,
    marginBottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: Colors.slateGrey,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  levelButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: Colors.scavengerButton
  },
  levelButtonPressed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: Colors.scavengerButtonPress,
    borderWidth: 2,
    borderColor: Colors.black
  },
  navBackBtn: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  navBackContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  navBackText: {
    fontSize: 40,
    fontWeight: '300',
    ...Platform.select({
      android: {
        fontSize: 45,
        top: -5
      }
    })
  },
  navBackTextContainer: {
    ...Platform.select({
      android: {
        display: 'none'
      }
    }),
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreDefaultContainer: {
    flex: 1,
    marginRight: 20,
    alignItems: 'flex-end'
  },
  restoreDefaultText: {
    color: Colors.signRed,
    fontSize: 20
  },
  rowBack: {
    flex: 1,
    backgroundColor: Colors.pearlWhite,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: Colors.slateGrey,
    borderBottomWidth: 1,
  },
  rowFront: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pearlWhite,
    borderBottomColor: Colors.slateGrey,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',

  },
  topSectionContainer: {
    height: 200
  }
});