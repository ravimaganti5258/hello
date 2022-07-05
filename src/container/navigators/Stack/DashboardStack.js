import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Dashboard from '../../screens/Dashboard';

const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={'Dashboard'} component={Dashboard} />
    </Stack.Navigator>
  );
};

export default DashboardStack;

const styles = StyleSheet.create({});
