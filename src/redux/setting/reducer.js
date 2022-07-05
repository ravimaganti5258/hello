
import { CHANGE_APP_THEME, CHANGE_HOME_PAGE, FIRST_LOGIN_EACH_DAY, ENABLE_PUSH_NOTIFICATION, SAVE_EXISTING_PASSWORD } from './types';

const initialState = {

    theme: { mode: 'Blue' },
    screen: 'Dashboard',
    showDashboard: true,
    pushNotify: true,
    existingPassword: []
};

export const SettingReducer = (state = initialState, action) => {
    switch (action.type) {

        case CHANGE_APP_THEME: {
            return {
                ...state,
                theme: { mode: action?.payload },
            };
        }
            break;

        case CHANGE_HOME_PAGE: {
            return {
                ...state,
                screen: action?.payload
            }
        }
            break;

        case FIRST_LOGIN_EACH_DAY: {
            return {
                ...state,
                showDashboard: action?.payload
            }
        }
            break;

        case ENABLE_PUSH_NOTIFICATION: {
            return {
                ...state,
                pushNotify: action?.payload
            }
        }
            break
        case SAVE_EXISTING_PASSWORD: {
            return {
                ...state,
                existingPassword: action?.payload
            }
        }
            break

        default: {
            return state;
        }
    }
};
