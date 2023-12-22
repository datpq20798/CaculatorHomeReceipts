import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CreateInvoice from './components/CreateInvoice';
import MngInvoice from './components/MngInvoice'
import  Setting from './components/Setting'
import DetailReceipts from './components/DetailReceipts';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const handleCreateInvoice = () => {
    navigation.navigate('Tạo Phiếu thu');
    
  };
  const handleMngInvoice = () => {
    navigation.navigate('Quản lý Phiếu thu');
  };

  const handleSetting = () => {
    navigation.navigate('Setting');
  };

  const handledDetail = () =>{
    navigation.navigate('Chi tiết Phiếu thu');
  }
  
  const [button1Clicked, setButton1Clicked] = useState(false);
  const [button2Clicked, setButton2Clicked] = useState(false);
  const [button3Clicked, setButton3Clicked] = useState(false);



  return (
    <View style={styles.container}>
      <Text style={styles.textTitleHeader}>Quản lý tiền nhà</Text>
      <TouchableOpacity
        style={[styles.buttonCreateInvoice, button1Clicked && styles.clicked]}
        onPress={handleCreateInvoice}>
        <Text style={styles.textTitle}>Tạo phiếu thu</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={[styles.buttonMngInvoice, button2Clicked && styles.clicked]}
          onPress={handleMngInvoice}>
          <Text style={styles.textTitle}>Quản lý phiếu thu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSetting, button3Clicked && styles.clicked]}
          onPress={handleSetting}>
          <Text style={styles.textTitle}>Thiết lập giá tiền</Text>
        </TouchableOpacity>

      {/* ... */}
    </View>
  );
};


const App = () => {
  

  return (
    <>
   <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tạo Phiếu thu" component={CreateInvoice} />
        <Stack.Screen name="Quản lý Phiếu thu" component={MngInvoice} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Chi tiết Phiếu thu" component={DetailReceipts} />
      </Stack.Navigator>
    </NavigationContainer>
      
    </>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FFFF',
  },
  buttonCreateInvoice: {
    width: 250,
    height: 100,
    backgroundColor: '#03A9F4',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 15,
  },
  buttonMngInvoice: {
    width: 250,
    height: 100,
    backgroundColor: '#FFBC49',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 15,
  },
  buttonSetting: {
    width: 250,
    height: 100,
    backgroundColor: '#58AD69',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 15,
  },
  textTitle: {
    fontSize: 30,
  },
  textTitleHeader: {
    fontSize: 40,
    marginBottom: 50,
  },
});

export default App;
