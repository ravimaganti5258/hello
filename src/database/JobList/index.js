import {
  databaseOptions,
  insertNewRealmObject,
  queryAllRealmObject,
} from '../index';
import Realm from 'realm';
import {JOB_LIST} from './schema';

export const checkExistOrNot = (value, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let existObj = realm.objectForPrimaryKey(realmObj, value.id);
        if (existObj === undefined) {
          insertNewRealmObject(value, realmObj);
        }
      })
      .catch((error) => reject(error));
  });

export const storeJobListInLocal = (Data) => {
  Data?.map((item, index) => {
    let data = {
      id: item?.jobno,
      ...item,
    };
    checkExistOrNot(data, JOB_LIST);
  });
};

export const getJobListFromLocal = async () => {
  await queryAllRealmObject(JOB_LIST).then((res) => {
    let jobListData = res[0];
    return {jobListData};

    // if (jobListData.length < 1) {
    //   return false;
    // }

    // jobListData = {...jobListData[0]};
    // console.log({jobListData});
  });
};
