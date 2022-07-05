import { request } from './requestApi';
import {
  FORGET_PASSWORD,
  LOGIN_USER,
  CHECK_IN,
  CHECK_OUT,
  TODAY_LOG,
  USER_INFO,
  CHANGE_PASSWORD,
  MASTER_DATA,
  APPLY_TIME_OFF,
  TIME_OFF_HISTORY,
  JOB_LISTING,
  DELETE_TIME_OFF,
  GET_MANAGER_NAME,
  JOB_DETAILS,
  UPDATE_ACCEPT_REJECT_JOB,
  UPDATE_WORK_ORDER_CONTACT_DETAIL,
  GET_CREW_MEMBERS,
  INSERT_WORK_TASK_DETAILS,
  UPDATE_WORK_TASK_DETAILS,
  DELETE_WORK_TASK_DETAILS,
  INSERT_WO_JOB_SERVICE_NOTES,
  UPDATE_NOTES_DETAILS,
  DELETE_SPL_NOTES,
  GET_OTP_REASON,
  UPDATE_STATUS,
  GET_ATTACHMENTS,
  GET_PART_REQUEST_LIST,
  SAVE_ATTACHMENT,
  PULL_SYNC_CHECKLIST_ATTACHMENT,
  DELETE_CHECKLIST_ATTACHMENT,
  RESUME_JOB_GET_TECH_SCHEDULE,
  SAVE_RESUME_JOB_SCHEDULE_APPOINRMENT,
  SAVE_DYNAMIC_CHECKLIST_DETAILS,
  ADD_PARTS_REQUEST,
  GET_PARTS_LOOKUP_LIST,
  INSERT_OTP,
  SUBMIT_JOB,
  DELETE_CHECK_LIST_ATTACHMENT,
  GET_CHECK_LIST_ATTACHMENT,
  DELETE_ATTACHMENTS,
  RESEND_OTP,
  GET_OTP_DETAILS,
  UPDATE_INSERT_BOQ_PART,
  GET_EQUIPMENT_ATTACHMENT,
  GET_MOBILE_OTP_TYPE_ID,
  OTP_VALIDATION,
  SAVE_FORM_ATTACHMENT,
  GET_PART_WAREHOUSE,
  SAVE_INCEDENTS,
  GET_SERIAL_NO,
  SAVE_CONTRACT_TYPE,
  GET_CONTRACT_LIST,
  ADD_NEW_EQUIPMENT,
  ADD_PRICE,
  EDIT_PRICE,
  DELETE_PRICE,
  EDIT_EQUIPMENT,
  DELETE_EQUIPMENT,
  INSERT_CUSTOM_FIELDS,
  GET_NEAR_BY_TECHNICIAN,
  SCHEDULE_TO_ME,
  CANCEL_PART,
  SAVE_SIGN_FEEDBACK,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  GET_RECENTJOB,
  SERVICE_REPORT_EMAIL,
  GET_CUSTOMER_AND_TECH_DETAILS,
  DELETE_INCEDENTS,
  EJOB_ATTACHMENT,
  JOB_ATTACHMENT_DOWNLOAD,
  ADD_JOB_FORM_INCIDENT,
  SELECT_EQUIPMENT,
  SAVE_PAYMENT,
  GET_EMAIL_PRINT_JOB_SETTING,
  GET_JOB_TIMELINE,
  SAVE_EXISTING_EQUIPMENT,
  DELETE_INCEDENT_ATTEECHMENT,
  NOTIFICATIONS,
  PART_REQUIREMENT,
  GET_JOB_EDIT_DATA,
  NEAR_BY_PARTS,
  GET_PART_INVENTORY,
  GET_PART_INVENTORY_DETAIL,
  UPLOAD_INCIDENT_ATTECHMENT,
  GET_INCIDENT_ATTECHMENT,
  GET_PARTWAREHOUSE_QUANTITY,
  PART_REQUIREMENT_INSERTALLOCATE,
  GET_DASHBOARD_DATA,
  INSERT_WO_JOB_CHECKLIST_DETAILS,
  GET_CHECKLIST_DOWNLOAD_FILE,
  INSERT_TRACK_ROUTE,
  GET_MOBILE_CHILD_PRIVILEGES,
  DELETE_CHECKLIST,
  GET_DYNAMIC_CHECKLIST_DETAIL_1,
  GET_CHECKLIST_QUESTIONS,
  INSERT_NOTES,
  LANGUAGE_DATA,
  GET_USER_NOTIFICATION,
  GET_JOB_EQUIPMENT,
  GET_ALL_ATTACHMENT,
  GET_PRICE_DETAILS_ENTITY,
  GET_JOB_EQUIPMENT_ONLINE,
  GET_PART_REQUEST_LIST_ONLINE,
  GET_PRICE_DETAILS_ENTITY_ONLINE,
  GET_ALL_ATTACHMENT_ONLINE,
  GET_PROJECT_DETAILS,
  GET_CUSTOMER_DETAILS,
  GET_NOTES_ONLINE,
  GET_INCIDENT_DETAILS_ONLINE,
  GET_CUSTOM_FEILDS_MOBILE_ONLINE,
  GET_JOB_CHECKLIST_MOBILE_ONLINE,
  GET_SLA_DETAILS_ONLINE,
  GET_WOJOB_PAYMENT_ONLINE,
  GET_FEEDBACK_ONLINE,
  GET_WOJOBSIGNATURE_ONLINE,
  GET_COMPLETED_STATUS_REASON,
  GET_WO_JOB_ONLINE,
  GET_TECH_DETAIL_ONLINE,
  PART_ALL_REQUIREMENT,
  UPDATE_NOTIFICATION
} from './requestTypes';

export default {
  loginUser: (data, cb) => request(LOGIN_USER, cb, data),
  userInfo: (data, cb, header) => request(USER_INFO, cb, data, header),
  forgetPassword: (data, cb) => request(FORGET_PASSWORD, cb, data),
  changePssword: (data, cb, header) =>
    request(CHANGE_PASSWORD, cb, data, header),
  checkIn: (data, cb, header) => request(CHECK_IN, cb, data, header),
  checkOut: (data, cb, header) => request(CHECK_OUT, cb, data, header),
  todayLog: (data, cb, header, endPoint) =>
    request(TODAY_LOG, cb, data, header, endPoint),
  masterData: (data, cb, header, endPoint) =>
    request(MASTER_DATA, cb, data, header, endPoint),
  applyTimeOff: (data, cb, header) => request(APPLY_TIME_OFF, cb, data, header),
  timeOffHistory: (data, cb, header) =>
    request(TIME_OFF_HISTORY, cb, data, header),
  jobListing: (data, cb, header) => request(JOB_LISTING, cb, data, header),
  deleteTimeOFF: (data, cb, header, endPoint) =>
    request(DELETE_TIME_OFF, cb, data, header, endPoint),
  getManagerName: (data, cb, header, endPoint) =>
    request(GET_MANAGER_NAME, cb, data, header, endPoint),
  jobDetails: (data, cb, header) => request(JOB_DETAILS, cb, data, header),
  updateAcceptRejectJob: (data, cb, header) =>
    request(UPDATE_ACCEPT_REJECT_JOB, cb, data, header),
  updateContactDetails: (data, cb, header) =>
    request(UPDATE_WORK_ORDER_CONTACT_DETAIL, cb, data, header),

  getCrewMembers: (data, cb, header, endPoint) =>
    request(GET_CREW_MEMBERS, cb, data, header, endPoint),
  addTask: (data, cb, header) =>
    request(INSERT_WORK_TASK_DETAILS, cb, data, header),
  updateTask: (data, cb, header) =>
    request(UPDATE_WORK_TASK_DETAILS, cb, data, header),
  deleteTask: (data, cb, header, endPoint) =>
    request(DELETE_WORK_TASK_DETAILS, cb, data, header, endPoint),
  getAllPartRequirement: (data, cb, header, endPoint) =>
    request(PART_ALL_REQUIREMENT, cb, data, header, endPoint),
  insetNotes: (data, cb, header) =>
    request(INSERT_WO_JOB_SERVICE_NOTES, cb, data, header),
  updateNotes: (data, cb, header) =>
    request(UPDATE_NOTES_DETAILS, cb, data, header),
  deleteNotes: (data, cb, header, endPoint) =>
    request(DELETE_SPL_NOTES, cb, data, header, endPoint),

  getOtpReason: (data, cb, header, endPoint) =>
    request(GET_OTP_REASON, cb, data, header, endPoint),
  updateStatus: (data, cb, header) => request(UPDATE_STATUS, cb, data, header),
  getAttachments: (data, cb, header) =>
    request(GET_ATTACHMENTS, cb, data, header),
  getPartRequestList: (data, cb, header, endPoint) =>
    request(GET_PART_REQUEST_LIST, cb, data, header, endPoint),
  saveAttchment: (data, cb, header) =>
    request(SAVE_ATTACHMENT, cb, data, header),
  pullSyncCheckListAttchment: (data, cb, header) =>
    request(PULL_SYNC_CHECKLIST_ATTACHMENT, cb, data, header),
  deleteCheckListAttchment: (data, cb, header, endPoint) =>
    request(DELETE_CHECKLIST_ATTACHMENT, cb, data, header, endPoint),
  fetchResumeJobSchedule: (data, cb, header) =>
    request(RESUME_JOB_GET_TECH_SCHEDULE, cb, data, header),
  saveResumeJob: (data, cb, header) =>
    request(SAVE_RESUME_JOB_SCHEDULE_APPOINRMENT, cb, data, header),
  saveDaynamicCheckListDetails: (data, cb, header) =>
    request(SAVE_DYNAMIC_CHECKLIST_DETAILS, cb, data, header),
  addPartRequest: (data, cb, header) =>
    request(ADD_PARTS_REQUEST, cb, data, header),
  getPartsLookupList: (data, cb, header, endPoint) =>
    request(GET_PARTS_LOOKUP_LIST, cb, data, header, endPoint),
  insertOTP: (data, cb, header) => request(INSERT_OTP, cb, data, header),
  submitJob: (data, cb, header) => request(SUBMIT_JOB, cb, data, header),
  deleteCheckListAttachment: (data, cb, header, endPoint) =>
    request(DELETE_CHECK_LIST_ATTACHMENT, cb, data, header, endPoint),
  getCheckListAttachment: (data, cb, header) =>
    request(GET_CHECK_LIST_ATTACHMENT, cb, data, header),
  deleteAttachments: (data, cb, header, endPoint) =>
    request(DELETE_ATTACHMENTS, cb, data, header, endPoint),
  resendOTP: (data, cb, header, endPoint) =>
    request(RESEND_OTP, cb, data, header, endPoint),
  getOTPDetails: (data, cb, header, endPoint) =>
    request(GET_OTP_DETAILS, cb, data, header, endPoint),
  updateInsertBOQParts: (data, cb, header) =>
    request(UPDATE_INSERT_BOQ_PART, cb, data, header),
  getEquipmentAttachment: (data, cb, header) =>
    request(GET_EQUIPMENT_ATTACHMENT, cb, data, header),
  getMobileOTPTypeID: (data, cb, header, endPoint) =>
    request(GET_MOBILE_OTP_TYPE_ID, cb, data, header, endPoint),
  otpValidation: (data, cb, header, endPoint) =>
    request(OTP_VALIDATION, cb, data, header, endPoint),
  saveFormAttachment: (data, cb, header) =>
    request(SAVE_FORM_ATTACHMENT, cb, data, header),
  getPartsWarehouse: (data, cb, header, endPoint) =>
    request(GET_PART_WAREHOUSE, cb, data, header, endPoint),
  saveIncidents: (data, cb, header) =>
    request(SAVE_INCEDENTS, cb, data, header),
  deleteIncident: (data, cb, header, endPoint) =>
    request(DELETE_INCEDENTS, cb, data, header, endPoint),

  getSerialNo: (data, cb, header, endPoint) =>
    request(GET_SERIAL_NO, cb, data, header, endPoint),
  saveContractType: (data, cb, header) =>
    request(SAVE_CONTRACT_TYPE, cb, data, header),
  getContractList: (data, cb, header, endPoint) =>
    request(GET_CONTRACT_LIST, cb, data, header, endPoint),
  addNewEquipment: (data, cb, header) =>
    request(ADD_NEW_EQUIPMENT, cb, data, header),
  addPrice: (data, cb, header) => request(ADD_PRICE, cb, data, header),
  editPrice: (data, cb, header) => request(EDIT_PRICE, cb, data, header),

  getNearbyTechnician: (data, cb, header, endPoint) =>
    request(GET_NEAR_BY_TECHNICIAN, cb, data, header, endPoint),

  deletePrice: (data, cb, header, endPoint) =>
    request(DELETE_PRICE, cb, data, header, endPoint),
  editEquipment: (data, cb, header) =>
    request(EDIT_EQUIPMENT, cb, data, header),
  deleteEquipment: (data, cb, header, endPoint) =>
    request(DELETE_EQUIPMENT, cb, data, header, endPoint),
  insertcustomFields: (data, cb, header) =>
    request(INSERT_CUSTOM_FIELDS, cb, data, header),

  getNearbyTechnician: (data, cb, header, endPoint) =>
    request(GET_NEAR_BY_TECHNICIAN, cb, data, header, endPoint),
  getUserProfile: (data, cb, header, endPoint) =>
    request(GET_USER_PROFILE, cb, data, header, endPoint),
  updateUserProfile: (data, cb, header) =>
    request(UPDATE_USER_PROFILE, cb, data, header),
  eJobAttachment: (data, cb, header) =>
    request(EJOB_ATTACHMENT, cb, data, header),

  cancelParts: (data, cb, header) => request(CANCEL_PART, cb, data, header),
  saveSignAndFeedback: (data, cb, header) =>
    request(SAVE_SIGN_FEEDBACK, cb, data, header),
  serviceReportEmail: (data, cb, header) =>
    request(SERVICE_REPORT_EMAIL, cb, data, header),
  getCustomerAndTechDetails: (data, cb, header, endPoint) =>
    request(GET_CUSTOMER_AND_TECH_DETAILS, cb, data, header, endPoint),
  scheduleToMe: (data, cb, header) => request(SCHEDULE_TO_ME, cb, data, header),
  jobAttachmentDownload: (data, cb, header, endPoint) =>
    request(JOB_ATTACHMENT_DOWNLOAD, cb, data, header, endPoint),
  addJobFromIncidents: (data, cb, header, endPoint) =>
    request(ADD_JOB_FORM_INCIDENT, cb, data, header, endPoint),
  selectEquipment: (data, cb, header, endPoint) =>
    request(SELECT_EQUIPMENT, cb, data, header, endPoint),

  savePayment: (data, cb, header) => request(SAVE_PAYMENT, cb, data, header),
  getEmailPrintJobSetting: (data, cb, header, endPoint) =>
    request(GET_EMAIL_PRINT_JOB_SETTING, cb, data, header, endPoint),
  getRecentJob: (data, cb, header, endPoint) =>
    request(GET_RECENTJOB, cb, data, header, endPoint),

  getJobTimeLine: (data, cb, header, endPoint) =>
    request(GET_JOB_TIMELINE, cb, data, header, endPoint),
  saveExistingEquipment: (data, cb, header) =>
    request(SAVE_EXISTING_EQUIPMENT, cb, data, header),
  getJobeditdata: (data, cb, header, endPoint) =>
    request(GET_JOB_EDIT_DATA, cb, data, header, endPoint),

  deleteIncidentAttachments: (data, cb, header, endPoint) =>
    request(DELETE_INCEDENT_ATTEECHMENT, cb, data, header, endPoint),
  getNotification: (data, cb, header) =>
    request(NOTIFICATIONS, cb, data, header),

  getPartRequirement: (data, cb, header, endPoint) =>
    request(PART_REQUIREMENT, cb, data, header, endPoint),
  getPartRequirementInsertAllocate: (data, cb, header, endPoint) =>
    request(PART_REQUIREMENT_INSERTALLOCATE, cb, data, header, endPoint),

  getPartInventory: (data, cb, header, endPoint) =>
    request(GET_PART_INVENTORY, cb, data, header, endPoint),

  getNearByParts: (data, cb, header) =>
    request(NEAR_BY_PARTS, cb, data, header),
  getPartInventoryDetail: (data, cb, header, endPoint) =>
    request(GET_PART_INVENTORY_DETAIL, cb, data, header, endPoint),

  uploadIncidentAttechment: (data, cb, header) =>
    request(UPLOAD_INCIDENT_ATTECHMENT, cb, data, header),

  getIncidentAttechmentList: (data, cb, header, endPoint) =>
    request(GET_INCIDENT_ATTECHMENT, cb, data, header, endPoint),

  getPartWareHouseQuantity: (data, cb, header, endPoint) =>
    request(GET_PARTWAREHOUSE_QUANTITY, cb, data, header, endPoint),

  getDashboardData: (data, cb, header, endPoint) =>
    request(GET_DASHBOARD_DATA, cb, data, header, endPoint),
  insertWOJobChecklistDetails: (data, cb, header) =>
    request(INSERT_WO_JOB_CHECKLIST_DETAILS, cb, data, header),
  getCheckListDownloadFile: (data, cb, header, endPoint) =>
    request(GET_CHECKLIST_DOWNLOAD_FILE, cb, data, header, endPoint),
  insertTrackRoute: (data, cb, header) =>
    request(INSERT_TRACK_ROUTE, cb, data, header),
  getMobileChildPrivileges: (data, cb, header, endPoint) =>
    request(GET_MOBILE_CHILD_PRIVILEGES, cb, data, header, endPoint),
  deleteCheckList: (data, cb, header, endPoint) =>
    request(DELETE_CHECKLIST, cb, data, header, endPoint),

  getDynamicCheckListDetails1: (data, cb, header, endPoint) =>
    request(GET_DYNAMIC_CHECKLIST_DETAIL_1, cb, data, header, endPoint),
  getChecklistQuestions: (data, cb, header, endPoint) =>
    request(GET_CHECKLIST_QUESTIONS, cb, data, header, endPoint),
  insertTechNotes: (data, cb, header) =>
    request(INSERT_NOTES, cb, data, header),
  getLanguage_Data: (data, cb, header, endPoint) =>
    request(LANGUAGE_DATA, cb, data, header, endPoint),
  GetUserNotifications: (data, cb, header) =>
    request(GET_USER_NOTIFICATION, cb, data, header),

  GetJobEquimentOnline: (data, cb, header, endpoint) =>
    request(GET_JOB_EQUIPMENT_ONLINE, cb, data, header, endpoint),
  GetPartRequestOnline: (data, cb, header, endpoint) =>
    request(GET_PART_REQUEST_LIST_ONLINE, cb, data, header, endpoint),
  GetPriceDetailsEnityOnline: (data, cb, header, endpoint) =>
    request(GET_PRICE_DETAILS_ENTITY_ONLINE, cb, data, header, endpoint),
  GetAllAttachmentOnline: (data, cb, header, endpoint) =>
    request(GET_ALL_ATTACHMENT_ONLINE, cb, data, header, endpoint),
  GetProjectDetailsOnline: (data, cb, header, endpoint) =>
    request(GET_PROJECT_DETAILS, cb, data, header, endpoint),
  GetCustomerContactOnline: (data, cb, header, endpoint) =>
    request(GET_CUSTOMER_DETAILS, cb, data, header, endpoint),
  GetNotesOnline: (data, cb, header, endpoint) =>
    request(GET_NOTES_ONLINE, cb, data, header, endpoint),
  GetIncidentDetailsOnline: (data, cb, header, endpoint) =>
    request(GET_INCIDENT_DETAILS_ONLINE, cb, data, header, endpoint),

  GetCustomFeildsMobileOnline: (data, cb, header, endpoint) =>
    request(GET_CUSTOM_FEILDS_MOBILE_ONLINE, cb, data, header, endpoint),

  GetJobChecklistMobileOnline: (data, cb, header, endpoint) =>
    request(GET_JOB_CHECKLIST_MOBILE_ONLINE, cb, data, header, endpoint),
  GetSlaDetailsOnline: (data, cb, header, endpoint) =>
    request(GET_SLA_DETAILS_ONLINE, cb, data, header, endpoint),
  GetWoJobPaymentOnline: (data, cb, header, endpoint) =>
    request(GET_WOJOB_PAYMENT_ONLINE, cb, data, header, endpoint),
  GetFeedbackOnline: (data, cb, header, endpoint) =>
    request(GET_FEEDBACK_ONLINE, cb, data, header, endpoint),
  GetWojobSignOnline: (data, cb, header, endpoint) =>
    request(GET_WOJOBSIGNATURE_ONLINE, cb, data, header, endpoint),

  GetCompletedStausReasonOnline: (data, cb, header, endpoint) =>
    request(GET_COMPLETED_STATUS_REASON, cb, data, header, endpoint),
  GetWoJobsOnline: (data, cb, header) =>
    request(GET_WO_JOB_ONLINE, cb, data, header),
  GetTechnicianDetailsOnline: (data, cb, header) =>
    request(GET_TECH_DETAIL_ONLINE, cb, data, header),
    updateNotification:(data, cb, header, endpoint) =>
    request(UPDATE_NOTIFICATION, cb, data, header, endpoint),

    
};
