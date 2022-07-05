import {
  FAILURE,
  SUCCESS,
  REQUEST,
  RESPONSE,
  JOB_RESPONSE,
  JOB_REJECT,
  SERVICE_DISABLE,
  SERVICE_VISIBLE,
  GET_EMAIL_PRINT_JOB_SETTING,
  GET_PDF_BASE_64,
  GET_HTML_TEMPLATE,
} from '../log/type';

const initialState = {
  serviceReportVisible: false,
  emailPrintJobSetting: {},
  getPdfBase64: ``,
  htmlData: ``,
};

export const ServiceReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case SERVICE_VISIBLE: {
      return { ...state, serviceReportVisible: action?.payload };
    }
    case SERVICE_DISABLE: {
      return { ...state, serviceReportVisible: false };
    }
    case GET_EMAIL_PRINT_JOB_SETTING: {
      return { ...state, emailPrintJobSetting: action?.payload };
    }
    case GET_PDF_BASE_64: {
      return { ...state, getPdfBase64: action?.payload };
    }
    case GET_HTML_TEMPLATE: {
      return { ...state, htmlData: action?.payload };
    }
    default: {
      return state;
    }
  }
};
