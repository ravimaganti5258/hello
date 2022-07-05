import {databaseOptions, insertNewRealmObject} from '../index';
import Realm from 'realm';
import {JOB_DETAILS} from './schemas';

export const checkJobDetailsExistOrNot = (value, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let existObj = realm.objectForPrimaryKey(realmObj, value.id);
        if (existObj === undefined) {
          insertNewRealmObject(value, realmObj);
        }
        //update
      })
      .catch((error) => reject(error));
  });

export const saveJobDetailInLocal = (data) => {
  data?.map((item, index) => {
    let obj = {
      id: item?.TechnicianJobInformation?.WoJobId,
      GetWojobServiceNotesDetails: JSON.stringify(
        item?.GetWojobServiceNotesDetails,
      ),
      TechnicianJobInformation: JSON.stringify(item?.TechnicianJobInformation),
      utcOffset: JSON.stringify(item?.utcOffset),
      CustomFields: JSON.stringify(item?.utcOffset),
      CustomertimeZone: JSON.stringify(item?.CustomertimeZone),
      GetCustomerFeedback: JSON.stringify(item?.GetCustomerFeedback),
      GetDynamicChecklist: JSON.stringify(item?.GetDynamicChecklist),
      GetJobEquipment: JSON.stringify(item?.GetJobEquipment),
      GetJobPaymentDetailsEntity: JSON.stringify(
        item?.GetJobPaymentDetailsEntity,
      ),
      GetPriceDetailsEntity: JSON.stringify(item?.GetPriceDetailsEntity),
      GetProjectDetails: JSON.stringify(item?.GetProjectDetails),
      GetTechnicianRemarks: JSON.stringify(item?.GetTechnicianRemarks),
      GetWOJobChecklist: JSON.stringify(item?.GetWOJobChecklist),
      GetWOJobSignature: JSON.stringify(item?.GetWOJobSignature),
      GetWojobServiceNotesDetails: JSON.stringify(
        item?.GetWojobServiceNotesDetails,
      ),
      GetWojobSplInsDetails: JSON.stringify(item?.GetWojobSplInsDetails),
      GetWorkOrderAppointment: JSON.stringify(item?.GetWorkOrderAppointment),
      IncidentDetails: JSON.stringify(item?.IncidentDetails),
      JobApprovalStatus: JSON.stringify(item?.JobApprovalStatus),
      OTPEnable: JSON.stringify(item?.OTPEnable),
      OTPTypeId: JSON.stringify(item?.OTPTypeId),
      SLADetails: JSON.stringify(item?.SLADetails),
      WOJobDetail: JSON.stringify(item?.WOJobDetail),
      WorkOrderCustomerContactDetails: JSON.stringify(
        item?.WorkOrderCustomerContactDetails,
      ),
      GetPartWarehouse: JSON.stringify(item?.GetPartWarehouse),
      GetJobStatusTimeLine: JSON.stringify(item?.GetJobStatusTimeLine),
      GetPartRequestList: JSON.stringify(item?.GetPartRequestList),
    };
    checkJobDetailsExistOrNot(obj, JOB_DETAILS);
  });
};
