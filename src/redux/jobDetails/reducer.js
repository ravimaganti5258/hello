import {
  FAILURE,
  SUCCESS,
  REQUEST,
  RESPONSE,
  JOB_RESPONSE,
  JOB_REJECT,
} from '../log/type';

const initialState = {
  data: {},
  CompletedStatusReasons: {},
  CustomertimeZone: {},
  GetCustomerFeedback: {},
  GetDynamicChecklist: [],
  GetProjectDetails: {},
  GetTechnicianRemarks: [],
  GetWOJobChecklist: [],
  GetWOJobSignature: [],
  GetWojobServiceNotesDetails: [],
  GetWojobSplInsDetails: [],
  GetWorkOrderAppointment: [],
  TechnicianJobInformation: [],
  WOJobDetails: [],
  WorkOrderCustomerContactDetails: [],
  SLADetails: '',
  utcOffset: '',
  incidents: [],
  GetPriceDetailsEntity: [],
  isLoading: false,
  error: null,
};

export const JobDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST: {
      return {...state, isLoading: true};
    }
    case RESPONSE: {
      return {...state, isLoading: false};
    }
    case JOB_RESPONSE: {
      return {
        ...state,
        error: null,
        isLoading: false,
        data: action.payload,
        CompletedStatusReasons: action.payload?.CompletedStatusReasons,
        CustomertimeZone: action.payload?.CustomertimeZone,
        GetCustomerFeedback: action.payload?.GetCustomerFeedback,
        GetDynamicChecklist: action.payload?.GetDynamicChecklist,
        GetProjectDetails: action.payload?.GetProjectDetails,
        GetTechnicianRemarks: action.payload?.GetTechnicianRemarks,
        GetWOJobChecklist: action.payload?.GetWOJobChecklist,
        GetWOJobSignature: action.payload?.GetWOJobSignature,
        GetWojobServiceNotesDetails:
          action.payload?.GetWojobServiceNotesDetails,
        GetWojobSplInsDetails: action.payload?.GetWojobSplInsDetails,
        GetWorkOrderAppointment: action.payload?.GetWorkOrderAppointment,
        TechnicianJobInformation: action.payload?.TechnicianJobInformation,
        WOJobDetails: action.payload?.WOJobDetails,
        SLADetails: action.payload?.SLADetails,
        WorkOrderCustomerContactDetails:
          action.payload?.WorkOrderCustomerContactDetails,
        utcOffset: '',
        incidents: action.payload?.IncidentDetails,
        GetPriceDetailsEntity: action.payload?.GetPriceDetailsEntity,
      };
    }

    case JOB_REJECT: {
      return {
        ...state,
        data: {},
        error: action.payload,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};
