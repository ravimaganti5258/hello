import {strings} from '../I18n';
import {
  EMAIL_REGX,
  EMAIL_REGX2,
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_NUM_REGEX,
  TEXT_ONLY,
} from './regex';

export const emailValidator = (email) => {
  if (email.trim() === '') {
    const response = {
      error: true,
      errMessage: strings('email.enter_email'),
    };
    return response;
  } else if (!checkEmail(email.trim())) {
    const response = {
      error: true,
      errMessage: strings('email.invalid_email'),
    };
    return response;
  } else
    return {
      error: false,
    };
};

function checkEmail(email) {
  return EMAIL_REGX2.test(email);
}

export const passwordValidator = (password) => {
  const minPassLength = 5;
  const maxPassLength = 15;

  if (password.trim() === '') {
    const response = {
      error: true,
      errMessage: strings('password.enter_password'),
    };
    return response;
  } else if (
    password.trim().length < minPassLength ||
    password.trim().length > maxPassLength
  ) {
    const response = {
      error: true,
      errMessage: strings('password.password_length'),
    };
    return response;
  } else if (!checkPassword(password.trim())) {
    const response = {
      error: true,
      errMessage: strings('password.invalid_password'),
    };
    return response;
  } else
    return {
      error: false,
    };
};

const checkPassword = (password) => {
  return PASSWORD_REGEX.test(password);
};

const text_only = (value) => {
  return TEXT_ONLY.test(value);
};

export const nameValidator = (name, type) => {
  if (name.trim() === '') {
    const response = {
      error: true,
      errMessage: `Enter ${type}`,
    };
    return response;
  } else if (name.length < 0 || name.length > 30) {
    const response = {
      error: true,
      errMessage: `${type} length 1 to 30`,
    };
    return response;
  } else if (!text_only(name.trim())) {
    const response = {
      error: true,
      errMessage: strings('validator.CanNotEnterNumber'),
    };
    return response;
  } else if (!isNameValid(name)) {
    const response = {
      error: true,
      errMessage: ` Invalid ${type}`,
    };
    return response;
  } else if (name.trim().split(' ').length > 1) {
    const response = {
      error: true,
      errMessage: strings('validator.CanNotAddSpace'),
    };
    return response;
  } else {
    return {
      error: false,
    };
  }
};
function isNameValid(name) {
  return NAME_REGEX.test(name);
}

export const confirmPassValidator = (password, confPass) => {
  if (password === '') {
    const response = {
      error: true,
      errMessage: strings('conf_password.enter_pass_first'),
    };
    return response;
  } else if (confPass === '') {
    const response = {
      error: true,
      errMessage: strings('conf_password.enter_conf_pass'),
    };
    return response;
  } else if (password != confPass) {
    const response = {
      error: true,
      errMessage: strings('conf_password.incorrect_pass'),
    };
    return response;
  } else
    return {
      error: false,
    };
};

export const phoneNoValidator = (phoneNo) => {
  if (phoneNo.trim() === '') {
    const response = {
      error: true,
      errMessage: strings('phone_number.enter_phone_no'),
    };
    return response;
  } else if (!isPhoneNoValid(phoneNo)) {
    const response = {
      error: true,
      errMessage: strings('phone_number.invalid_phone'),
    };
    return response;
  } else {
    return {
      error: false,
    };
  }
};

function isPhoneNoValid(phoneNo) {
  const regx = /^[0-9]+([0-9]+)+$/;
  // const regx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
  return regx.test(phoneNo);
  // return PHONE_NUM_REGEX.test(phoneNo);
}

export const validateOTP = (OTP) => {
  if (OTP.trim() === '') {
    const response = {
      error: true,
      errMessage: strings('validator.Enter_OTP'),
    };
    return response;
  } else if (isNaN(OTP.trim())) {
    const response = {
      error: true,
      errMessage: strings('validator.Enter_Number'),
    };
    return response;
  } else if (OTP.trim().length < 4 || OTP.trim().length > 4) {
    const response = {
      error: true,
      errMessage: strings('validator.Enter_Four_Digits'),
    };
    return response;
  } else {
    return {
      error: false,
    };
  }
};

export const TimeValidation = (startTime, endTime) => {
  var strStartTime = startTime;
  var strEndTime = endTime;

  var startTime = new Date().setHours(
    GetHours(strStartTime),
    GetMinutes(strStartTime),
    0,
  );
  var endTime = new Date(startTime);
  endTime = endTime.setHours(GetHours(strEndTime), GetMinutes(strEndTime), 0);
  if (startTime > endTime) {
    return {res: true, msg: strings('apply_timeOff.StartTimeGreaterEnd')};
  }
  if (startTime == endTime) {
    return {res: true, msg: strings('apply_timeOff.StartTimeEqualEnd')};
  }
  if (startTime < endTime) {
    return {
      res: false,
      msg: strings('apply_timeOff.StartTimeLessEnd'),
    };
  }
};

function GetHours(d) {
  var h = parseInt(d.split(':')[0]);
  var s = d.split(':')[1].split(' ')[1];
  if (d.split(':')[1].split(' ')[1] == 'PM') {
    h = h + 12;
  }
  if(h==12 && s == 'AM'){
    h=h-12
  }
  return h;
}
function GetMinutes(d) {
  return parseInt(d.split(':')[1].split(' ')[0]);
}

export function allFieldsValidation(type, inputValue) {
  let result = '';
  switch (type) {
    case 'email':
      {
        const response = emailValidator(inputValue);
        result = response;
      }
      break;
    case 'password':
      {
        const response = passwordValidator(inputValue);
        result = response;
      }
      break;
    case 'name':
    case 'First Name':
    case 'Last Name':
      {
        const response = nameValidator(inputValue, type);
        result = response;
      }
      break;
    case 'phone':
    case 'mobile':
      {
        const response = phoneNoValidator(inputValue);
        result = response;
      }
      break;
    default:
      console.log('Invalid Type');
  }

  return result;
}
