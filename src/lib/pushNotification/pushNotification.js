import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {isPNG} from '../../util/helper';

const configure = () => {
  PushNotification.configure({
    onRegister: function (token) {},

    onNotification: function (notification) {
      if (
        notification?.foreground && Platform.OS === 'android'
          ? notification?.channelId != 'local_notification'
          : null
      ) {
        PushNotification.localNotification({
          ...notification,
          bigPictureUrl: isPNG(notification?.bigPictureUrl)
            ? notification?.bigPictureUrl
            : undefined,
          channelId: 'local_notification',
        });
      }
      Platform.OS === 'ios'
        ? notification.finish(PushNotificationIOS.FetchResult.NoData)
        : null;
    },

    onRegistrationError: function (err) {},
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS ==='ios',
  });

  PushNotification.createChannel({
    channelId: 'local_notification',
    channelName: 'My channel',
    channelDescription: 'A channel to categorise your notifications',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  });
};

export {configure};
