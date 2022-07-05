import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {Alert, BackHandler} from 'react-native';
import LocalAuth from 'react-native-local-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigation from './src/container/navigators/rootNavigation';
import FlashMessage from 'react-native-flash-message';
import {normalize} from './src/lib/globals';
import {PersistGate} from 'redux-persist/integration/react';
import useFirebaseCloudMessaging from './src/components/FirebaseCloudMessaging/useFirebaseCloudMessaging';
console.disableYellowBox = true;

const App = () => {
  const [securityAccess, setsecurityAccess] = useState(true);
  const {getToken, requestUserPermission,notificationListners} = useFirebaseCloudMessaging();
  useEffect(() => {
    requestUserPermission();
    getToken();
    notificationListners();
  }, []);

  useEffect(() => {
    showSecurityShield();
  }, []);

  const showSecurityShield = async () => {
    try {
      const enableSecurityValue = await AsyncStorage.getItem('enableSecurity');
      const enableSecurity = JSON.parse(enableSecurityValue);
      if (enableSecurity) {
        localAuthentication();
      }
    } catch (error) {}
  };

  const localAuthentication = () => {
    LocalAuth.authenticate({
      reason: 'Unlock FSM Grid',
      fallbackToPasscode: true, // fallback to passcode on cancel
      suppressEnterPassword: true, // disallow Enter Password fallback
    })
      .then((success) => {
        setsecurityAccess(true);
      })
      .catch((error) => {
        Alert.alert('Authentication Failed', JSON.stringify(error?.message));
        BackHandler.exitApp();
      });
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {securityAccess && <RootNavigation />}
        </PersistGate>
      </Provider>
      <FlashMessage position="top"  hideOnPress={false} style={{marginTop: normalize(80)}} duration={900}/>
      {/* <Provider store={store}>{securityAccess && <RootNavigation />}</Provider>
      <FlashMessage position="top" style={{marginTop: normalize(80)}} /> */}
    </>
  );
};

export default App;
