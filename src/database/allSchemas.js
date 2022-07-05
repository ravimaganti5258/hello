export const TODAYLOG = 'TodayLog';
export const LOGLIST = 'LogList';
export const USER = 'User';
export const CHECK_IN = 'CHECK_IN';
export const USERINFO = 'User_info';

export const User = {
  name: USER,
  primaryKey: 'id',
  properties: {
    id: 'int',
    userName: 'string',
    password: 'string',
    access_token: 'string',
    expires_in: 'int',
    token_type: 'string',
    refresh_token: 'string',
    scope: 'string',
    PasswordExpiryAlert: 'string',
    LicenseExpiryAlert: 'string',
  },
};

export const UserInfo = {
  name: USERINFO,
  primaryKey: 'id',
  properties: {
    id: 'int',
    BusinessAddressId: 'string',
    CompanyCode: 'string',
    CompanyId: 'string',
    CompanyUniqueId: 'string',
    CompanyVerticalId: 'string',
    CountryId: 'string',
    Culture: 'string',
    Currency: 'string',
    DefaultCountryId: 'string',
    DisplayName: 'string',
    HasAccessToAllRegions: 'string',
    HasAccessToAllWorkTypes: 'string',
    HomePageId: 'string',
    ISCrewEnabled: 'string',
    IsLatLonBased: 'string',
    IsManager: 'string',
    IsPAGMapped: 'string',
    IsProjectEnabled: 'string',
    IsTech: 'string',
    Language: 'string',
    LanguageId: 'string',
    LogoPath: 'string',
    ManagerId: 'string',
    MapId: 'string',
    MapKey: 'string',
    MaxRoleGroup: 'string',
    Mpin: 'string',
    ThemeId: 'string',
    TimeZoneId: 'string',
    VendorId: 'string',
    auth_time: 'int',
    role: {type: 'list', objectType: 'string'},
    sub: 'string',
  },
};

export const logList = {
  name: LOGLIST,
  properties: {
    CheckInTime: 'string',
    CheckOutTime: 'string',
    Duration: 'int',
  },
};

export const TodayLog = {
  name: TODAYLOG,
  properties: {
    id: 'int',
    log: {type: 'list', objectType: LOGLIST},
  },
};

export const CheckIn = {
  name: CHECK_IN,
  properties: {
    id: 'string',
    checkInLabel: 'string',
    time: 'date',
  },
};
