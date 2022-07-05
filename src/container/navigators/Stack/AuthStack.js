import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Platform,
} from 'react-native';
import {BlueArrowBack} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import {Text} from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import ChangePassword from '../../screens/AuthScreens/ChangePassword';
import ForgotPassword from '../../screens/AuthScreens/ForgotPassword';
import Password from '../../screens/AuthScreens/Password';
import UserName from '../../screens/AuthScreens/UserName';
import PrivacyPolicy from '../../screens/PrivacyPolicy/PrivacyPolicy';

const Stack = createStackNavigator();
// const [colors] = useColors();
const HeaderBack = (props) => {
  const {colors} = useColors();
  return (
    <TouchableOpacity
      {...props}
      onPress={() => props.navigation.goBack()}
      style={styles.backBtnStyles}>
      <BlueArrowBack
        width={normalize(10)}
        height={normalize(17)}
        color={colors?.PRIMARY_BACKGROUND_COLOR}
        style={{
          transform: I18nManager.isRTL
            ? [{ rotate: '180deg' }]
            : [{ rotate: '0deg' }],
          // color: 'red'
        }}
      />
      <Text style={[styles.backTextStyles,{color:colors?.PRIMARY_BACKGROUND_COLOR}]}>{strings('common.back')}</Text>
    </TouchableOpacity>
  );
};

const AuthStack = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor={Colors.completeTransparent}
        barStyle={'dark-content'}
      />
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTitleAlign: 'left',
          headerBackTitle: '',
          ...TransitionPresets.ScaleFromCenterAndroid,
          headerLeft: (props) => <HeaderBack {...props} />,
          headerBackTitleStyle: styles.backTitleTxt,
        }}
        initialRouteName={'UserName'}>
        <Stack.Screen
          name={'UserName'}
          component={UserName}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={'Password'}
          component={Password}
          options={(props) => ({
            title: '',
            headerLeft: () => <HeaderBack {...props} />,
          })}
        />
        <Stack.Screen
          name={'ForgotPassword'}
          component={ForgotPassword}
          options={(props) => ({
            title: '',
            headerStyle: {
              elevation: 0,
            },
            headerLeft: () => <HeaderBack {...props} />,
            headerTintColor: Colors.darkSecondaryBtn,
            headerTitleStyle: {
              fontFamily: fontFamily.semiBold,
              marginLeft: -20,
              fontSize: normalize(20),
            },
          })}
        />
        <Stack.Screen
          name={'ChangePassword'}
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={'PrivacyPolicy'}
          component={PrivacyPolicy}
          options={(props) => ({
            title: '',
            headerStyle: {
              elevation: Platform.OS == 'android'?7:7,
            },
            headerLeft: () => <HeaderBack {...props} />,
            headerTintColor: Colors.darkSecondaryBtn,
            headerTitleStyle: {
              fontFamily: fontFamily.semiBold,
              marginLeft: -20,
              fontSize: normalize(20),
            },
            // headerShown: false 
          })}
        />
      </Stack.Navigator>
    </>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
  headerStyle: {
    shadowRadius: 0,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: Colors.white,
    elevation: 0,
    backgroundColor: Colors.white,
  },
  backBtnStyles: {
    marginHorizontal: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backTitleTxt: {
    color: Colors.secondryBlue,
    fontFamily: fontFamily.semiBold,
    fontSize: textSizes.h9,
  },
  backTextStyles: {
    color: Colors?.darkSecondaryBtn,
    marginLeft: normalize(10),
    fontFamily: fontFamily?.semiBold,
    fontSize: normalize(18),
  },
});
