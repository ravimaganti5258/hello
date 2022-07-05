import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import UserName from '../../screens/AuthScreens/UserName';
import JobList from '../../screens/JobList';
import Notification from '../../screens/Notifications';
import Settings from '../../screens/Settings';
import MainStack from '../Stack/mainStack';
import TabShape from './TabShape';

export default () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator tabBar={(props) => <TabShape {...props} />}>
      <Tab.Screen name={'DashboardTab'} component={MainStack} />
      <Tab.Screen name={'JobList'} component={JobList} />
      <Tab.Screen name={'DemoTab'} component={UserName} />
      <Tab.Screen name={'SettingsTab'} component={Settings} />
      <Tab.Screen name={'NotificationTab'} component={Notification} />
    </Tab.Navigator>
  );
};
