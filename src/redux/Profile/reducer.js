import {
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,
    EDIT_PROFILE_SUCCESS,
    SHOW_SEARCH_BAR,
} from '../../redux/Profile/types';

const initialState = {
    profileInfo: {},
    isSearch: false,
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PROFILE_SUCCESS: {
            return {
                ...state,
                profileInfo: action?.payload,
            };
        }
        case FETCH_PROFILE_FAILURE: {
            return {
                ...state,
                profileInfo: {},
            };
        }
        case EDIT_PROFILE_FAILURE: {
            return {
                ...state,
            };
        }
        case EDIT_PROFILE_SUCCESS: {
            return {
                ...state,
                profileInfo: action?.payload,
            };
        }
        case SHOW_SEARCH_BAR: {
            return {
                ...state,
                isSearch: action?.payload,
            };
        }
        default: {
            return state;
        }
    }
}