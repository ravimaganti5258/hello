import {insertNewRealmObject} from '..';
import {USER, USERINFO} from './schema';

export const storeUserInfo = (AuthDatail) => {
  let userInfoObj = {
    id: 1,
    ...AuthDatail.userInfo,
  };
  insertNewRealmObject(userInfoObj, USERINFO).then((res) => {});
};

export const storeLoginData = (AuthDatail) => {
  let obj = {
    id: 1,
    userName: AuthDatail.userCredentials.userName,
    password: AuthDatail.userCredentials.password,
    ...AuthDatail.tokenDetails,
  };
  insertNewRealmObject(obj, USER).then((res) => console.log({res}));
};
