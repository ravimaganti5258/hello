import Realm from 'realm';
import { databaseOptions, queryAllRealmObject } from '../index';
import { MASTER_DATA } from './masterSchema';

export const storeMasterData = async (data) => {
  await Realm.open(databaseOptions).then((realm) => {
    realm.write(() => {
      let obj = {
        id: 1,
        SystemSettings: data?.SystemSettings,
        TimeOffReasons: data?.TimeOffReasons,
        Leavetypes: data?.Leavetypes,
        TimeOffStatus: data?.TimeOffStatus,
        CategoryMaster: data?.CategoryMaster,
        JobStatus: data?.JobStatus,
        AllWorkType: data?.AllWorkType,
        AllWorkTask: data?.AllWorkTask,
        RejectReasons: data?.RejectReasons,
        ContactTypes: data?.ContactTypes,
        TitleNames: data?.TitleNames,
        UnResolvedCompletedReasons: data?.UnResolvedCompletedReasons,
        ModelLists: data?.ModelLists,
        AttachmentTypes: data?.AttachmentTypes,
        GeoFensingCategoryList: data?.GeoFensingCategoryList,
        BrandLists: data?.BrandLists,
        RequestType: data?.RequestType,
        LocationViolationReasons: data?.LocationViolationReasons,
        PriceTypes: data?.PriceTypes,
        PaymentModes: data?.PaymentModes,
        TaxGroups: data?.TaxGroups,
        Taxes: data?.Taxes,
        ContractType: data?.ContractType,
        GetConfigDetail: data?.GetConfigDetail,
        GetCheckListMaster: data?.GetCheckListMaster,
        GetSlaPriority: data?.GetSlaPriority,
        GetLanguageList: data?.GetLanguageList
      };
      realm.create(MASTER_DATA, obj);
    });
  });
};

export const fetchJobCalenderSetting = async () => {
  let data = {
    jobDetails: '',
    jobList: '',
  };
  await queryAllRealmObject(MASTER_DATA)
    .then((data) => {
      const res = data[0];
      const jobListCalender = res?.SystemSettings.filter(
        (obj) => obj?.SettingId === 77,
      );
      const jobDetailsCalender = res?.SystemSettings.filter(
        (obj) => obj?.SettingId === 78,
      );
      return jobDetailsCalender, jobListCalender;
    })

    .catch((error) => { });

};


export const fetchLanguageListRelam = async (setLanguageList) => {

  await queryAllRealmObject(MASTER_DATA)
    .then((data) => {
      const res = data[0];
      const list = res?.GetLanguageList.map((ele) => { return ele })
      setLanguageList(list)

    })

    .catch((error) => { });

}