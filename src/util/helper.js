import {
  Alert,
  AsyncStorage,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from 'react-native-push-notification';
import { isPointWithinRadius, getDistance, convertDistance } from 'geolib';
import LocalAuth from 'react-native-local-auth';
import TouchID from 'react-native-touch-id';
import { decode as atob } from 'base-64';

import { IMAGE_FORMAT_REGEX } from '../lib/validations/regex';
import moment from 'moment';

export const isPointInRange = (point, center, radius) => {
  return new Promise((resolve, reject) => {
    const result = isPointWithinRadius(point, center, radius);
    if (typeof result == 'boolean') {
      resolve(result);
    } else {
      reject('Something went wrong!');
    }
  });
};

export const getDistanceFromLatLong = async (
  lat1,
  long1,
  lat2,
  long2,
  distanceFormat,
) => {
  const distance = await getDistance(
    { latitude: lat1, longitude: long1 },
    { latitude: lat2, longitude: long2 },
  );
  let kmDistance = 0,
    milesDistance = 0;
  if (distanceFormat) {
    kmDistance = convertDistance(distance, 'km');
  } else {
    milesDistance = convertDistance(distance, 'mi').toFixed(2);
  }

  return { distance, kmDistance, milesDistance };
};

export const iosLocationPermission = async () => {
  try {
    const response = await Geolocation.requestAuthorization('whenInUse');
    if (response == 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) { }
};

export const androidLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.ACCESS_FINE_LOCATION',
    );
    if (granted == 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) { }
};

export const getCurrentLocation = () => {
  let hasPermission =
    Platform.OS === 'ios'
      ? iosLocationPermission()
      : androidLocationPermission();
  return new Promise((resolve, reject) => {
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          reject(error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 },
      );
    }
  });
};

export const sendLocalNotification = (
  title,
  message,
  bigPictureUrl = '',
  delay = 2,
) => {
  let bigImage;
  if (bigPictureUrl != '') {
    let isImgPng = isPNG(bigPictureUrl);
    if (isImgPng) {
      bigImage = bigPictureUrl;
    } else {
      bigImage = undefined;
    }
  } else {
    bigImage = undefined;
  }

  PushNotification.localNotificationSchedule({
    title: `${title}`,
    message: `${message}`,
    date: new Date(Date.now() + delay * 1000),
    bigLargeIconUrl: bigImage,
    largeIconUrl: bigImage,
    channelId: 'local_notification',
  });
};

export const isPNG = (imageUrl) => {
  return IMAGE_FORMAT_REGEX.test(imageUrl);
};

const date = new Date();
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

export const dummyWeek = [
  '20 Jan',
  '21 Jan',
  '22 Jan',
  '23 Jan',
  '24 Jan',
  '25 Jan',
  '26 Jan',
];

export const getDate = () => {
  return date.getDate();
};

export const monthIndex = date.getMonth();

export const getMonth = () => {
  return months[date.getMonth()];
};

export const getDay = () => {
  return days[date.getDay()];
};

export const getYear = () => {
  return date.getFullYear();
};

export const getWeek = (year, month, date) => {
  const myDate = new Date(year, month - 1, date);
  return days[myDate.getDay()];
};

export const LocalAuthentication = (successCallBack, errorCallBack) => {
  LocalAuth.authenticate({
    reason: 'Unlock FSM Grid',
    fallbackToPasscode: true,
    suppressEnterPassword: true,
  })
    .then((success) => {
      if (success) {
        successCallBack();
      }
      Alert.alert('Authentication Successfull');
    })
    .catch((error) => {
      // errorCallBack();
      Alert.alert('Authentication Failed', error.message);
    });
};

const checkSupportConfig = {
  unifiedErrors: false,
  passcodeFallback: false,
};

export const checkSupportForBiometric = () => {
  return new Promise((resolve, reject) => {
    TouchID.isSupported(checkSupportConfig)
      .then((biometryType) => {
        resolve(true);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const decryptToken = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = atob(base64);
  return JSON.parse(jsonPayload);
};

export const splitDateString = (dateString) => {
  return dateString?.split('T')[0].split('-');
};

export const getCurrentDateString = () => {
  const date = getDate();
  let reqDate = '';
  if (date < 10) {
    reqDate = `0${date}`;
  } else {
    reqDate = date;
  }
  const year = getYear();

  const month = monthIndex + 1;
  let reqMonth = '';
  if (month < 10) {
    reqMonth = `0${month}`;
  } else {
    reqMonth = month;
  }

  const currentDateStr = `${year}-${reqMonth}-${reqDate}`;

  return currentDateStr;
};

export const convertDateString = (dateString) => {
  const details = dateString.split(' ')[0].split('/');
  let date = details[1];
  let reqDate = '';
  if (date < 10) {
    reqDate = `${date}`;
  } else {
    reqDate = date;
  }
  const year = details[2];
  const month = details[0];
  let reqMonth = '';
  if (month < 10) {
    reqMonth = `${month}`;
  } else {
    reqMonth = month;
  }

  return `${year}-${reqMonth}-${reqDate}`;
};

let keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export const decodeBase64 = (input) => {
  var output = '';
  var chr1,
    chr2,
    chr3 = '';
  var enc1,
    enc2,
    enc3,
    enc4 = '';
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]$/g;
  if (base64test.exec(input)) {
    throw new Error(
      'There were invalid base64 characters in the input text.\n' +
      "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
      'Expect errors in decoding.',
    );
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]$/g, '');

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);
  return output;
};

export const convertKiloMetersToMeters = (value) => {
  try {
    const data = value * 1000;
    return data;
  } catch (error) { }
};

export const convertMilesToMeters = (value) => {
  try {
    const data = value * 1609.344;
    return data;
  } catch (error) { }
};

// function dataURLtoFile(dataurl, filename) {

//   var arr = dataurl.split(','),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);

//   while(n--){
//       u8arr[n] = bstr.charCodeAt(n);
//   }

//   return new File([u8arr], filename, {type:mime});
// }
// //Usage example:
// var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=','hello.txt');
// console.log(file);

export const b64toBlob = (b64Data, contentType, sliceSize) => {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const iosToDMY = (date) => {
  return moment(date).format('D-MMM-YYYY, h:mm A');
};

export const commonStyles = {
  flex: 1,
  backgroundColor: 'white',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
};
export const emptyDropDown = [{ id: 0, lable: 'Not Found', value: 'Not Found' }];

export const IsoFormat = (date) => {
  return date.toISOString();
};

export const StartEndDate = (NoOfDays) => {
  return {
    startDate: moment().subtract(NoOfDays, 'd').format('MM-DD-YYYY'),
    endDate: moment().add(NoOfDays, 'd').format('MM-DD-YYYY'),
  };
};
//Adding function to get all dates array for joblist
// export const GetAllDates = (NoOfDays)=>{

//     var dateArray = [];
//     var startDate = moment().subtract(NoOfDays,'d').format('YYYY-MM-DD');
//     var stopDate = moment().add(NoOfDays,'d').format('YYYY-MM-DD');

//     while (startDate <= stopDate) {
//         const Date =moment(startDate).format('YYYY-MM-DD');
//         dateArray.push({
//           date:Date,
//           event:[]
//         });
//         startDate = moment(startDate).add(1,'d').format('YYYY-MM-DD');

//     }
//     return dateArray;
// }

//Adding currentDate
export const getCurrentDate = () => {
  return {
    dateString: moment().format('YYYY-MM-DD'),
    year: moment().format('YYYY'),
  };
};

//distance calculator
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distanceKM = R * c; // Distance in km
  const factor = 0.621371;
  var distanceMiles = distanceKM * factor;

  return { distanceKM, distanceMiles };
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


export const getCurrentDateWithDay = () => {
  return moment().format('MM/DD/YYYY');
}


