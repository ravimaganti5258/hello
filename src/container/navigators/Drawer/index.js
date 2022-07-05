import React from 'react';

import {StatusBar} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import MainStack from '../Stack/mainStack';
import DrawerComponent from './drawerComponent';
import {useSelector} from 'react-redux';
import JobListMainStack from '../Stack/mainJobListStack';

export default () => {
  const Drawer = createDrawerNavigator();
  const defaultScreen = useSelector((state) => state?.authReducer?.screen);
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'#00000031'}
      />
      <Drawer.Navigator
        drawerContent={(props) => <DrawerComponent {...props} />}
        drawerStyle={{width: '80%'}}>
        {defaultScreen != 'JobList' ? (
          <Drawer.Screen name={'Mainstack'} component={MainStack} />
        ) : (
          <Drawer.Screen
            name={'JobListMainStack'}
            component={JobListMainStack}
          />
        )}
      </Drawer.Navigator>
    </>
  );
};
