import {Platform, AppState} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {pendingApi} from '../redux/pendingApi/action';

export const BackgroundTimerHandler = (connection, pendingApi, dispatch) => {
  if (Platform.OS == 'ios') {
    BackgroundTimer.start(1000);
    if (connection) {
      if (pendingApi.length > 0) {
        // pendingApi.map((ele) => {
        //   requestPendingApi(ele, dispatch);
        // });
      } else {
        BackgroundTimer.stop();
      }
    } else {
      console.log(' offlin Mode  ');
    }
  }
  if (pendingApi.length > 0) {
    let interval = BackgroundTimer.setInterval(() => {
      console.log('background running process ', connection);
      if (connection) {
        console.log('Internet conncted ,push dat to server ', {pendingApi});
        if (pendingApi.length > 0) {
          //   pendingApi.map((ele) => {
          //     requestPendingApi(ele, dispatch);
          //   });
        } else {
          BackgroundTimer.clearInterval(interval);
        }
      } else {
        console.log(' offline Mode  ');
      }
    }, 30000);
  }
};
