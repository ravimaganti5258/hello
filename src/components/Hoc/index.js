import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Text,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const MainHoc = (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <SafeAreaView
          style={[
            {
              flex: 1,
              backgroundColor: 'white',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            },
          ]}>
          <View style={{flex: 1}}>
            <WrappedComponent {...props} />
          </View>
        </SafeAreaView>
      </>
    );
  };
};

export default MainHoc;
