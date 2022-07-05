import {
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,
    EDIT_PROFILE_SUCCESS,
    SHOW_SEARCH_BAR,
} from '../../redux/Profile/types';

export const getProfileDataSuccess = (getProfileData) => {
    return {
        type: FETCH_PROFILE_SUCCESS,
        payload: getProfileData,
    };
};
export const getProfileDataFailure = () => {
    return {
        type: FETCH_PROFILE_FAILURE,
        payload: {},
    };
};
export const setProfileDataFailure = () => {
    return {
        type: EDIT_PROFILE_FAILURE,
    };
};
export const setProfileDataSuccess = (setProfileData) => {
    return {
        type: EDIT_PROFILE_SUCCESS,
        payload: setProfileData,
    };
};
export const setSearchBarVisibility = (show) => {
    return {
        type: SHOW_SEARCH_BAR,
        payload: show,
    };
};