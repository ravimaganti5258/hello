import { EQUIPMENT_ATTACHMET_SUCCESS, SAVE_EXISTING_EQUIPMENT, SAVE_EXISTING_EQUIPMENT_SUCCESS } from './type';

export const saveEquimentattchment = (data) => {
  return {
    type: EQUIPMENT_ATTACHMET_SUCCESS,
    payload: data,
  };
};


export const saveExistingEquipment = (data) => {
  return {
    type: SAVE_EXISTING_EQUIPMENT_SUCCESS,
    payload: data,
  };
};
