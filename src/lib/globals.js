import { Dimensions, Platform, PixelRatio } from 'react-native';
import moment from 'moment';
import { months, splitDateString } from '../util/helper';

export const WINDOW = Dimensions.get('window');

export const percent = (percentage) => {
  return (percentage / 100) * WINDOW.width - 20;
};

const { width: screenWidth, height: screenHeight } = WINDOW;

export const deviceWidth = screenWidth;
export const deviceHeight = screenHeight;

export const fontFamily = {
  regular: 'OpenSans-Regular',
  black: 'OpenSans-Bold',
  extraBold: 'OpenSans-ExtraBold',
  extraLight: 'OpenSans-Light',
  light: 'OpenSans-Light',
  bold: 'OpenSans-Bold',
  medium: 'OpenSans-Medium',
  semiBold: 'OpenSans-SemiBold',
  thin: 'OpenSans-Light',
  italic: 'OpenSans-Italic',
  boldItalic: 'OpenSans-BoldItalic',
  lightItalic: 'OpenSans-LightItalic',
  extraBoldItalic: 'OpenSans-ExtraBoldItalic',
  mediumItalic: 'OpenSans-MediumItalic',
  semiBoldItalic: 'OpenSans-SemiBoldItalic',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 410;

export function normalize(size) {
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

const scale1 = SCREEN_HEIGHT / 784;

export function normalizeHeight(size) {
  const newSize = size * scale1;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const textSizes = {
  h1: normalize(38),
  h2: normalize(36),
  h3: normalize(34),
  h4: normalize(32),
  h5: normalize(29),
  h6: normalize(27),
  h7: normalize(25),
  h8: normalize(20),
  h9: normalize(18),
  h10: normalize(16),
  h11: normalize(14),
  h12: normalize(13),
  h13: normalize(10),
};

//****** date Formatter */

export function dateFormat(date, format = 'DD/MM/YYYY') {
  try {
    let d = new Date(date);
    switch (format) {
      case 'DD/MM/YYYY':
        return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${d.getFullYear()}`;

      case 'MM/DD/YYYY':
        return `${addZeroPrecesion(d.getMonth() + 1)}/${addZeroPrecesion(
          d.getDate(),
        )}/${d.getFullYear()}`;

      case 'YYYY/MM/DD':
        return `${d.getFullYear()}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${addZeroPrecesion(d.getDate())}`;

      case 'DD-MM-YYYY':
        return `${addZeroPrecesion(d.getDate())}-${addZeroPrecesion(
          d.getMonth() + 1,
        )}-${d.getFullYear()}`;

      case 'YYYY-MM-DD':
        return `${d.getFullYear()}-${addZeroPrecesion(
          d.getMonth() + 1,
        )}-${addZeroPrecesion(d.getDate())}`;

      case 'DD/MM/YYYY HH:MM:MS 12TF':
        return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${d.getFullYear()} ${timeFormatAMPM(d)}`;

        case 'DD/MM/YYYY  HH:MM:MS 12TF':
          return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
            d.getMonth() + 1,
          )}/${d.getFullYear()}   ${timeFormatAMPM(d)}`;

      case 'DD/MM/YYYY HH:MM 12TF':
        return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${d.getFullYear()} ${timeFormatAMPM(d, false)}`;

      case 'DD/MM/YYYY HH:MM:MS':
        return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${d.getFullYear()} ${addZeroPrecesion(
          d.getHours(),
        )}:${addZeroPrecesion(d.getMinutes())}:${addZeroPrecesion(
          d.getSeconds(),
        )}`;

      case 'YYYY-MM-DD HH:MM:MS':
        return `${d.getFullYear()}-${addZeroPrecesion(
          d.getMonth() + 1,
        )}-${addZeroPrecesion(
          d.getDate(),
        )}  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

      case 'ddmOyy':
        return `${addZeroPrecesion(d.getDate())} ${months[d.getMonth()]} ${d
          .getFullYear()
          .toString()
          .substr(-2)}`;

      case 'ddmOYYYY':
        return `${addZeroPrecesion(d.getDate())} ${months[d.getMonth()]
          } ${d.getFullYear()}`;

      case 'ddmOyy12T':
        return `${addZeroPrecesion(d.getDate())} ${months[d.getMonth()]} ${d
          .getFullYear()
          .toString()
          .substr(-2)} ${timeFormatAMPM(d)}`;

      case 'MM/DD/YYYY HH:MM:MS 12TF':
        return `${addZeroPrecesion(d.getMonth() + 1)}/${addZeroPrecesion(
          d.getDate(),
        )}/${d.getFullYear()} ${timeFormatAMPM(d)}`;

        case 'MM/DD/YYYY  HH:MM:MS 12TF':
        return `${addZeroPrecesion(d.getMonth() + 1)}/${addZeroPrecesion(
          d.getDate(),
        )}/${d.getFullYear()}   ${timeFormatAMPM(d)}`;

      case 'MM/DD/YYYY HH:MM:MS 24TF':
        return `${addZeroPrecesion(d.getMonth() + 1)}/${addZeroPrecesion(
          d.getDate(),
        )}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

      default:
        return `${addZeroPrecesion(d.getDate())}/${addZeroPrecesion(
          d.getMonth() + 1,
        )}/${d.getFullYear()}`;
    }
  } catch (error) { }
}

export function timeFormat(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
export const addZeroPrecesion = (value) => {
  if (typeof value == 'string') {
    if (parseInt(value) < 10) {
      return `0${value}`;
    } else {
      return value;
    }
  } else if (typeof value == 'number') {
    if (value < 10) {
      return `0${value}`;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

export const getDayDiff = (startDate, endDate) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getTimeDiff = (start, end) => {
  return moment.duration(
    moment(end, 'HH:mm:ss a').diff(moment(start, 'HH:mm:ss a')),
  );
};

export const Timediff = (start, end) => {
  start = start.split(':');
  end = end.split(':');
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60);

  // If using time pickers with 24 hours format, add the below line get exact hours
  if (hours < 0) hours = hours + 24;

  return (
    (hours <= 9 ? '0' : '') + hours + ':' + (minutes <= 9 ? '0' : '') + minutes
  );
};

export function timConvert(time) {
  var timeString = time;
  var H = +timeString.substr(0, 2);
  var h = H % 12 || 12;
  var ampm = H < 12 || H === 24 ? 'AM' : 'PM';
  timeString = h + timeString.substr(2, 3) + ' ' + ampm;
  return timeString;
}

export function convertFrom24To12Format(time24) {
  const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
  const period = +sHours < 12 ? 'AM' : 'PM';
  const hours = +sHours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

export const convertFrom12To24Format = (time12) => {
  const [sHours, minutes, period] = time12
    .match(/([0-9]{1,2}):([0-9]{2}) (AM|PM)/)
    .slice(1);
  const PM = period === 'PM';
  const hours = (+sHours % 12) + (PM ? 12 : 0);

  return `${('0' + hours).slice(-2)}:${minutes}`;
};

export function timeFormatAMPM(date, second = true) {
  let strTime = '';
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var second = date.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? minutes : minutes;
  if (second) {
    strTime =
      addZeroPrecesion(hours) +
      ':' +
      addZeroPrecesion(minutes) +
      ':' +
      addZeroPrecesion(second) +
      ' ' +
      ampm;
  } else {
    strTime =
      addZeroPrecesion(hours) + ':' + addZeroPrecesion(minutes) + ' ' + ampm;
  }
  return strTime;
}
