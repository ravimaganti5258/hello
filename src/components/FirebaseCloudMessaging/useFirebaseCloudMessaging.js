import React, { useEffect } from "react";

import messaging from "@react-native-firebase/messaging";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
const useFirebaseCloudMessaging = () => {
  const { getItem: getFcmToken, setItem: saveFcmToken } = useAsyncStorage(
    "fcmToken"
  );
  const [fcmToken, setFcmToken] = React.useState(null);
  const getToken = async () => {
    var token1 = await getFcmToken();
    if (!token1) {
      // Get the device token
      return await messaging()
        .getToken()
        .then((token2) => {
          token1 = token2;
          setFcmToken(token2);
          saveFcmToken(token2);
          return token2;
        });
    }
    return token1;
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  useEffect(() => {
    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }
    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log('refresh token ===>',token)
      saveFcmToken(token);
    });
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("@remoteMessage cloud", remoteMessage);
      // Alert.alert(remoteMessage.title, remoteMessage.body);
    });
    return unsubscribe;
  }, []);
const notificationListners =()=>{

   // Assume a message-notification contains a "type" property in the data payload of the screen to open
   messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("@remoteMessage background", remoteMessage);
      // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
    // navigation.navigate(remoteMessage.data.type);
  });
  messaging().onMessage(async (remoteMessage) => {
    console.log("@remoteMessage cloud", remoteMessage);
    // Alert.alert(remoteMessage.title, remoteMessage.body);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("@remoteMessage background", remoteMessage);
    // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
       
      }
    });

}


  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
     
      // navigation.navigate(remoteMessage.data.type);
    });
   

    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log("@remoteMessage background", remoteMessage);
    //   // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    // });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
         
        }
      });
  }, []);
  return {
    fcmToken,
    getToken,
    requestUserPermission,
    notificationListners
  };
};
export default useFirebaseCloudMessaging;


