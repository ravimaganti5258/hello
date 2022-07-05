import {
  User,
  TodayLog,
  logList,
  LOGLIST,
  TODAYLOG,
  USER,
  CheckIn,
  UserInfo,
} from './Auth/schema';
import Realm from 'realm';
import {
  MasterData,
  SystemSettings,
  TimeOffReasons,
  TimeOffStatus,
  Leavetypes,
  JobStatus,
  CategoryMaster,
  AllWorkTask,
  AllWorkType,
  RejectReasons,
  ContactTypes,
  TitleNames,
  UnResolvedCompletedReasons,
  GeoFensingCategoryList,
  ModelLists,
  BrandLists,
  AttachmentTypes,
  RequestType,
  LocationViolationReasons,
  ContractType,
  TaxGroups,
  Taxes,
  GetConfigDetail,
  PriceTypes,
  PaymentModes,
  GetCheckListMaster,
  GetSlaPriority,
  GetLanguageList,
} from './webSetting/masterSchema';
import { ApplyTimeOff, TimeOffHistory } from './timeOffSchema';
import { JobList } from './JobList/schema';
import { JobDetails } from './JobDetails/schemas';
import { MobilePrevilage } from './MobilePrevi/schema';

export const databaseOptions = {
  path: 'fsmGrid20.realm',
  schema: [
    User,
    TodayLog,
    logList,
    MasterData,
    SystemSettings,
    TimeOffReasons,
    TimeOffStatus,
    Leavetypes,
    CheckIn,
    ApplyTimeOff,
    UserInfo,
    TimeOffHistory,
    JobStatus,
    CategoryMaster,
    AllWorkTask,
    AllWorkType,
    RejectReasons,
    ContactTypes,
    TitleNames,
    UnResolvedCompletedReasons,
    AttachmentTypes,
    GeoFensingCategoryList,
    ModelLists,
    BrandLists,
    RequestType,
    LocationViolationReasons,
    ContractType,
    TaxGroups,
    Taxes,
    GetConfigDetail,
    PriceTypes,
    PaymentModes,
    JobList,
    JobDetails,
    GetCheckListMaster,
    GetSlaPriority,
    GetLanguageList,
    MobilePrevilage
  ],
  schemaVersion: 1,
};

// Insert and create object into realm
export const insertNewRealmObject = (newObj, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          realm.create(realmObj, newObj);
          resolve(newObj);
        });
      })
      .catch((error) => reject(error));
  });

//Update  data from realm  based on id
export const updateRealmObject = (value, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let updatingObj = realm.objectForPrimaryKey(realmObj, value.id);
          updatingObj.name = value.name;
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

//Delete  data from realm  based on id
export const deleteRealmObject = (Id, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let deletingObj = realm.objectForPrimaryKey(realmObj, Id);
          realm.delete(deletingObj);
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

//Delete  all object data from realm
export const deleteAllRealmObject = (realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let allObj = realm.objects(realmObj);
          realm.delete(allObj);
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

//Retrive data from realm
export const queryAllRealmObject = (realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let allData = realm.objects(realmObj);
        resolve(allData);
      })
      .catch((error) => {
        reject(error);
      });
  });

///only for system setting
export const insertNewRealm = (newObj, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          newObj.SystemSettings.forEach((obj) => {
            realm.create(realmObj, obj);
          });
        });
        resolve(obj);
      })
      .catch((error) => reject(error));
  });

export default new Realm(databaseOptions);
