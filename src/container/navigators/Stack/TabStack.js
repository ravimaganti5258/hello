import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import BottomTab from '../BottomTab';

const TabStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'TabStack'}
        component={BottomTab}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default TabStack;
