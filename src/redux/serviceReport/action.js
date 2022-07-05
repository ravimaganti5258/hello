import {
  MASTER_SUCCESS,
  FAILURE_RESPONSE,
  REQUEST,
  RESPONSE,
  JOB_RESPONSE,
  SERVICE_VISIBLE,
  SERVICE_DISABLE,
  GET_EMAIL_PRINT_JOB_SETTING,
  GET_PDF_BASE_64,
  GET_HTML_TEMPLATE,
} from '../log/type';

export const serviceReportVisibleAction = (data) => {
  return {
    type: SERVICE_VISIBLE,
    payload: data,
  };
};

export const serviceReportdisable = (data) => {
  return {
    type: SERVICE_DISABLE,
    payload: data,
  };
};

export const getEmailPrintJobSetting = (data) => {
  return {
    type: GET_EMAIL_PRINT_JOB_SETTING,
    payload: data,
  };
};

export const getPDFBase64 = (data) => {
  return {
    type: GET_PDF_BASE_64,
    payload: data,
  };
};

export const getHtmlTemplate = (data) => {
  return {
    type: GET_HTML_TEMPLATE,
    payload: data,
  };
};