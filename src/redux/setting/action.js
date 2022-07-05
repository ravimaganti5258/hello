import { CHANGE_APP_THEME, CHANGE_HOME_PAGE, FIRST_LOGIN_EACH_DAY, ENABLE_PUSH_NOTIFICATION, SAVE_EXISTING_PASSWORD } from "./types";

export const changeAppTheme = (themeMode) => {
    return {
        type: CHANGE_APP_THEME,
        payload: themeMode,
    };
};

export const changeHomePage = (homepage) => {
    return {
        type: CHANGE_HOME_PAGE,
        payload: homepage
    }
}

export const firstLogin = (value) => {
    return {
        type: FIRST_LOGIN_EACH_DAY,
        payload: value
    }
}

export const pushNotification = (value) => {
    return {
        type: ENABLE_PUSH_NOTIFICATION,
        payload: value
    }
}
export const saveExistingPassword = (value) => {
    return {
        type: SAVE_EXISTING_PASSWORD,
        payload: value
    }
}