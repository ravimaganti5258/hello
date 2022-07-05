const auth = 'FPIdentity/connect';
const mobileApi = 'FPIntegration/api/Mobile';

export const LOGIN_USER = { type: 'POST', url: `${auth}/token` };
export const USER_INFO = { type: 'POST', url: `${auth}/userinfo` };
export const FORGET_PASSWORD = {
  type: 'POST',
  url: `${mobileApi}/ForgetPassword`,
};
export const CHANGE_PASSWORD = {
  type: 'PUT',
  url: `${mobileApi}/UpdateChangePassword`,
};
export const CHECK_IN = {
  type: 'POST',
  url: `${mobileApi}/InsertMobUsercheckin`,
};
export const CHECK_OUT = {
  type: 'POST',
  url: `${mobileApi}/UpdateMobUserCheckout`,
};
export const TODAY_LOG = { type: 'GET', url: `${mobileApi}/GetTodaysLog` };
export const MASTER_DATA = {
  type: 'POST',
  url: `${mobileApi}/GetAllMobileMasterData`,
};
export const TIME_OFF_HISTORY = {
  type: 'POST',
  url: `${mobileApi}/GetTimeOffHistory`,
};
export const APPLY_TIME_OFF = {
  type: 'POST',
  url: `${mobileApi}/InsertTechOffTime`,
};
export const JOB_LISTING = { type: 'POST', url: `${mobileApi}/GetJobList` };
export const DELETE_TIME_OFF = {
  type: 'POST',
  url: `${mobileApi}/DeleteTimeOff`,
};
export const GET_MANAGER_NAME = {
  type: 'GET',
  url: `${mobileApi}/GetManagerName`,
};
export const JOB_DETAILS = {
  type: 'POST',
  url: `${mobileApi}/PullSyncMobileOfflineJobs`,
};
export const UPDATE_ACCEPT_REJECT_JOB = {
  type: 'PUT',
  url: `${mobileApi}/UpdateAcceptRejectJob`,
};

export const UPDATE_WORK_ORDER_CONTACT_DETAIL = {
  type: 'PUT',
  url: `${mobileApi}/UpdateWorkOrderCustomerContactDetails`,
};

export const GET_CREW_MEMBERS = {
  type: 'GET',
  url: `${mobileApi}/GetCrewMembers`,
};

export const INSERT_WORK_TASK_DETAILS = {
  type: 'POST',
  url: `${mobileApi}/InsertWoTaskDetails`,
};
export const UPDATE_WORK_TASK_DETAILS = {
  type: 'PUT',
  url: `${mobileApi}/UpdateWoTaskDetails`,
};
export const DELETE_WORK_TASK_DETAILS = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteWoTaskDetails`,
};
export const INSERT_WO_JOB_SERVICE_NOTES = {
  type: 'POST',
  url: `${mobileApi}/InsertWojobServiceNotes`,
};

export const DELETE_SPL_NOTES = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteSplNotes`,
};

export const UPDATE_NOTES_DETAILS = {
  type: 'PUT',
  url: `${mobileApi}/UpdateSplNotesDetails`,
};

export const SAVE_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/SaveAttachment`,
};
export const PART_ALL_REQUIREMENT = {
  type: 'GET',
  url: `${mobileApi}/GetAllPartRequirement`,
};
export const GET_OTP_REASON = {
  type: 'GET',
  url: `${mobileApi}/GetReason`,
};

export const UPDATE_STATUS = {
  type: 'POST',
  url: `${mobileApi}/UpdateTechnicianJobStatusmobile`,
};

export const GET_ATTACHMENTS = {
  type: 'POST',
  url: `${mobileApi}/PullSyncMobileOfflineAttachments`,
};

export const GET_PART_REQUEST_LIST = {
  type: 'GET',
  url: `${mobileApi}/GetPartRequestList`,
};

export const PULL_SYNC_CHECKLIST_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/PullSyncChecklistAttchment`,
};

export const DELETE_CHECKLIST_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/DeleteChecklistAttachment`,
};

export const RESUME_JOB_GET_TECH_SCHEDULE = {
  type: 'POST',
  url: `${mobileApi}/GetTechWorkSchedule`,
};

export const SAVE_RESUME_JOB_SCHEDULE_APPOINRMENT = {
  type: 'POST',
  url: `${mobileApi}/ScheduleAppointment`,
};

export const SAVE_DYNAMIC_CHECKLIST_DETAILS = {
  type: 'POST',
  url: `${mobileApi}/SaveDynamicCheckListDetails`,
};
export const ADD_PARTS_REQUEST = {
  type: 'POST',
  url: `${mobileApi}/InsertAllocatePartRequest`,
};

export const GET_PARTS_LOOKUP_LIST = {
  type: 'GET',
  url: `${mobileApi}/GetPartLookupList`,
};

export const INSERT_OTP = {
  type: 'POST',
  url: `${mobileApi}/InsertOTP`,
};

export const SUBMIT_JOB = {
  type: 'POST',
  url: `${mobileApi}/TechJobSubmitButtonValidate`,
};

export const DELETE_CHECK_LIST_ATTACHMENT = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteChecklistAttachment`,
};

export const GET_CHECK_LIST_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/PullSyncChecklistAttchment`,
};

export const DELETE_ATTACHMENTS = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteAttachment`,
};

export const RESEND_OTP = {
  type: 'GET',
  url: `${mobileApi}/ResendOTP`,
};

export const GET_OTP_DETAILS = {
  type: 'GET',
  url: `${mobileApi}/GetOTPDetails`,
};

export const UPDATE_INSERT_BOQ_PART = {
  type: 'POST',
  url: `${mobileApi}/InsertUpdateBOQPartRequest`,
};

export const GET_EQUIPMENT_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/MobilePullSyncEquipmentAttachments`,
};

export const GET_MOBILE_OTP_TYPE_ID = {
  type: 'GET',
  url: `${mobileApi}/GetMobOTPTypeId`,
};

export const OTP_VALIDATION = {
  type: 'POST',
  url: `${mobileApi}/OTPValidation`,
};

export const SAVE_FORM_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/ChklistSaveAttachment`,
};

export const GET_PART_WAREHOUSE = {
  type: 'GET',
  url: `${mobileApi}/GetPartWareHouse`,
};

export const SAVE_INCEDENTS = {
  type: 'POST',
  url: `${mobileApi}/SaveWOIncidents`,
};
export const DELETE_INCEDENTS = {
  type: 'GET',
  url: `${mobileApi}/DeleteIncidents`,
};

export const GET_SERIAL_NO = {
  type: 'POST',
  url: `${mobileApi}/GetSerialNumbers`,
};
export const SAVE_CONTRACT_TYPE = {
  type: 'POST',
  url: `${mobileApi}/savecontracttype`,
};
export const GET_CONTRACT_LIST = {
  type: 'GET',
  url: `${mobileApi}/GetContract`,
};
export const ADD_NEW_EQUIPMENT = {
  type: 'POST',
  url: `${mobileApi}/SaveEquipmentcf`,
};
export const ADD_PRICE = {
  type: 'POST',
  url: `${mobileApi}/InsertWoJobPrice`,
};
export const EDIT_PRICE = {
  type: 'PUT',
  url: `${mobileApi}/UpdateWoJobPrice`,
};
export const EDIT_EQUIPMENT = {
  type: 'PUT',
  url: `${mobileApi}/UpdateEquipmentcf`,
};
export const DELETE_EQUIPMENT = {
  type: 'DELETE',
  url: `${mobileApi}/DeletWojobEquipment`,
};
export const SELECT_EQUIPMENT = {
  type: 'GET',
  url: `${mobileApi}/GetExistingCustomerEquipments`,
};

export const INSERT_CUSTOM_FIELDS = {
  type: 'POST',
  url: `${mobileApi}/CustomFieldInsert`,
};

export const GET_NEAR_BY_TECHNICIAN = {
  type: 'GET',
  url: `${mobileApi}/GetNearByTech`,
};
export const DELETE_PRICE = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteWoJobPrice`,
};
export const GET_USER_PROFILE = {
  type: 'GET',
  url: `${mobileApi}/GetUserProfile`,
};
export const UPDATE_USER_PROFILE = {
  type: 'PUT',
  url: `${mobileApi}/UpdateMobile`,
};

export const CANCEL_PART = {
  type: 'PUT',
  url: `${mobileApi}/UpdateallocatedPartRequest`,
};

export const SAVE_SIGN_FEEDBACK = {
  type: 'POST',
  url: `${mobileApi}/UpdateWOJobSignature`,
};

export const GET_RECENTJOB = {
  type: 'GET',
  url: `${mobileApi}/GetRecentjobs`,
};
export const SERVICE_REPORT_EMAIL = {
  type: 'POST',
  url: `${mobileApi}/SendEmailJob`,
};
export const GET_CUSTOMER_AND_TECH_DETAILS = {
  type: 'GET',
  url: `${mobileApi}/GetCustomerAndTechDeails`,
};

export const SCHEDULE_TO_ME = {
  type: 'POST',
  url: `${mobileApi}/GetAvilableTime`,
};

export const EJOB_ATTACHMENT = {
  type: 'POST',
  url: `${mobileApi}/eJobAttachement`,
};

export const JOB_ATTACHMENT_DOWNLOAD = {
  type: 'GET',
  url: `${mobileApi}/JobAttachmentDownload`,
};
export const ADD_JOB_FORM_INCIDENT = {
  type: 'POST',
  url: `${mobileApi}/AddJobfromIncidentMobile`,
};

export const SAVE_PAYMENT = {
  type: 'POST',
  url: `${mobileApi}/SaveWoJobPayment`,
};

export const GET_EMAIL_PRINT_JOB_SETTING = {
  type: 'GET',
  url: `${mobileApi}/GetEmailPrintJobSetting`,
};

export const GET_JOB_TIMELINE = {
  type: 'GET',
  url: `${mobileApi}/GetJobStatusTimeLine`,
};

export const SAVE_EXISTING_EQUIPMENT = {
  type: 'POST',
  url: `${mobileApi}/SaveExistEquipment`,
};
export const DELETE_INCEDENT_ATTEECHMENT = {
  type: 'GET',
  url: `${mobileApi}/DeleteIncidentAttachment`,
};
export const NOTIFICATIONS = {
  type: 'POST',
  url: `${mobileApi}/SaveUserPushNotify`,
};

export const PART_REQUIREMENT = {
  type: 'GET',
  url: `${mobileApi}/GetPartRequirement`,
};
export const PART_REQUIREMENT_INSERTALLOCATE = {
  type: 'POST',
  url: `${mobileApi}/InsertAllocatePartRequest`,
};

export const GET_PART_INVENTORY = {
  type: 'GET',
  url: `${mobileApi}/GetPartInventory`,
};

export const NEAR_BY_PARTS = {
  type: 'POST',
  url: `${mobileApi}/GetNearByParts`,
};
export const GET_PART_INVENTORY_DETAIL = {
  type: 'GET',
  url: `${mobileApi}/GetPartInventoryDetail`,
};
export const UPLOAD_INCIDENT_ATTECHMENT = {
  type: 'POST',
  url: `${mobileApi}/UploadMobileIncidentAttachment`,
};

export const GET_INCIDENT_ATTECHMENT = {
  type: 'GET',
  url: `${mobileApi}/GetWoIncidentAttachment`,
};

export const GET_PARTWAREHOUSE_QUANTITY = {
  type: 'GET',
  url: `${mobileApi}/GetPartWareHouseQuantity`,
};

export const GET_DASHBOARD_DATA = {
  type: 'POST',
  url: `${mobileApi}/GetDashBoardData`,
};
export const INSERT_WO_JOB_CHECKLIST_DETAILS = {
  type: 'POST',
  url: `${mobileApi}/InsertWOJobChecklistDetails`,
};
export const GET_CHECKLIST_DOWNLOAD_FILE = {
  type: 'GET',
  url: `${mobileApi}/GetCheckListDownloadFile`,
};
export const GET_JOB_EDIT_DATA = {
  type: 'GET',
  url: `${mobileApi}/GetByPartRequest`,
};

export const INSERT_TRACK_ROUTE = {
  type: 'POST',
  url: `${mobileApi}/InsertTrackRoute`,
};
export const GET_MOBILE_CHILD_PRIVILEGES = {
  type: 'GET',
  url: `${mobileApi}/GetMobileChildPrivileges`,
};
export const DELETE_CHECKLIST = {
  type: 'DELETE',
  url: `${mobileApi}/DeleteWOJobChecklistDetails`,
};
export const GET_DYNAMIC_CHECKLIST_DETAIL_1 = {
  type: 'GET',
  url: `${mobileApi}/GetDynamicCheckListDetails1`,
};
export const GET_CHECKLIST_QUESTIONS = {
  type: 'POST',
  url: `${mobileApi}/GetChecklistQuestions`,
};

export const INSERT_NOTES = {
  type: 'POST',
  url: `${mobileApi}/InsertNotes`,
};

export const LANGUAGE_DATA = {
  type: 'GET',
  url: `${mobileApi}/GetMobileResource`,
};

export const GET_USER_NOTIFICATION = {
  type: 'POST',
  url: `${mobileApi}/GetUserNotifications`,
};

export const GET_JOB_EQUIPMENT_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetJobEquipmentOnline`,
};

export const GET_PART_REQUEST_LIST_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetPartRequestListOnline`,
};
export const GET_PRICE_DETAILS_ENTITY_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetJobPriceOnline`,
};
export const GET_ALL_ATTACHMENT_ONLINE = {
  type: 'POST',
  url: `${mobileApi}/GetAllAttachmentsMobileOnline`,
};

export const GET_NOTES_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetNotesOnline`,
};

export const GET_PROJECT_DETAILS = {
  type: 'GET',
  url: `${mobileApi}/GetProjectDetailsOnline`,
};

export const GET_CUSTOMER_DETAILS = {
  type: 'GET',
  url: `${mobileApi}/GetCustomerContactOnline`,
};

export const GET_INCIDENT_DETAILS_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetIncidentDetailsOnline`,
};

export const GET_CUSTOM_FEILDS_MOBILE_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetCustomFieldMobileOnline`,
};

export const GET_JOB_CHECKLIST_MOBILE_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetWOJobChecklistMobileOnline`,
};
export const GET_SLA_DETAILS_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetSLAHistoryOnline`,
};
export const GET_WOJOB_PAYMENT_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetWoJobPaymentOnline`,
};
export const GET_FEEDBACK_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetFeedBackOnline`,
};
export const GET_WOJOBSIGNATURE_ONLINE = {
  type: 'GET',
  url: `${mobileApi}/GetWOJobSignature`,
};

export const GET_COMPLETED_STATUS_REASON = {
  type: 'GET',
  url: `${mobileApi}/GetCompletedStausReasonOnline`,
};

export const GET_WO_JOB_ONLINE = {
  type: 'POST',
  url: `${mobileApi}/GetWoJobsOnline`,
};

export const GET_TECH_DETAIL_ONLINE = {
  type: 'POST',
  url: `${mobileApi}/GetTechnicianDetailsOnline`
};
export const UPDATE_NOTIFICATION = {
  type: 'POST',
  url: `${mobileApi}/UpdateUserNotifications`
};

