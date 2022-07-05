import { REQUEST, RESPONSE } from '../log/type';
import { EQUIPMENT_ATTACHMET_FAILURE, EQUIPMENT_ATTACHMET_SUCCESS, SAVE_EXISTING_EQUIPMENT_SUCCESS } from './type';

const initialState = {
  data: {},
  isLoading: false,
  error: null,
  existingEquipment: []
};

export const EquipmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST: {
      return { ...state, isLoading: true };
    }
    case RESPONSE: {
      return { ...state, isLoading: false };
    }
    case EQUIPMENT_ATTACHMET_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        data: action.payload,
      };
    }

    case EQUIPMENT_ATTACHMET_FAILURE: {
      return {
        ...state,
        data: {},
        error: action.payload,
        isLoading: false,
      };
    }
    case SAVE_EXISTING_EQUIPMENT_SUCCESS: {
      return {
        ...state,
        error: null,
        isLoading: false,
        existingEquipment: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
