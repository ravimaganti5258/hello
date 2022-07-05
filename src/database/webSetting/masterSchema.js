export const MASTER_DATA = 'MasterData';
export const SYSTEM_SETTING = 'SystemSettings[]';
export const TIME_OFF_REASON = 'TimeOffReasons[]';
export const LEAVE_TYPES = 'Leavetypes[]';
export const TIME_OFF_STATUS = 'TimeOffStatus[]';
export const JOB_STATUS = 'JobStatus[]';
export const CATEGORY_MASTER = ' CategoryMaster[]';
export const ALL_WORK_TYPE = 'AllWorkType[]';
export const ALL_WORK_TASK = 'AllWorkTask[]';
export const REJECT_REASON = 'RejectReason[]';
export const CONTACT_TYPES = 'ContactType[]';
export const TITLE_NAMES = 'TitleNames[]';
export const UNRESOLVED_COMPLETED_REASON = 'UnResolvedCompletedReasons[]';
export const MODAL_LISTS = 'ModelLists[]';
export const GEOFENCING_CATEGORY_LIST = 'GeoFensingCategoryList[]';
export const BRAND_LISTS = 'BrandLists[]';
export const ATTACHMENT_TYPE = 'AttachmentTypes[]';
export const REQUEST_TYPE = 'RequestType[]';
export const LOCATION_VIOLATION_REASONS = 'LocationViolationReasons[]';
export const GET_CONFIG_DETAIL = 'GetConfigDetail[]';
export const PAYMENT_MODE = 'PaymentModes[]';
export const PRICING_TYPE = 'PriceTypes[]';
export const TAX_GROUP = 'TaxGroups[]';
export const TAXS = 'Taxes[]';
export const CONTRACT_TYPE = 'ContractType[]';
export const GET_CHECKLIST_MASTER = 'GetCheckListMaster[]';
export const GET_SLA_PRIORITY = 'GET_SLA_PRIORITY[]';
export const GET_LANGUAGE_LIST = 'GET_LANGUAGE_LIST[]'

export const SystemSettings = {
  name: SYSTEM_SETTING,
  embedded: true,
  properties: {
    CompanyId: 'int?',
    SettingId: 'int?',
    Setting: 'string?',
    SettingValue: 'string?',
  },
};

export const TimeOffReasons = {
  name: TIME_OFF_REASON,
  embedded: true,
  properties: {
    OffTimeReasonId: 'int',
    Reason: 'string',
    Description: 'string',
  },
};

export const Leavetypes = {
  name: LEAVE_TYPES,
  embedded: true,
  properties: {
    LeaveTypeId: 'int',
    LeaveTypeDesc: 'string',
  },
};

export const TimeOffStatus = {
  name: TIME_OFF_STATUS,
  embedded: true,
  properties: {
    TimeOffStatusId: 'int',
    TimeOffStatus: 'string',
  },
};

export const CategoryMaster = {
  name: CATEGORY_MASTER,
  embedded: true,
  properties: {
    WoCategoryId: 'int',
    WoCategory: 'string',
  },
};

export const JobStatus = {
  name: JOB_STATUS,
  embedded: true,
  properties: {
    JobStatusId: 'int',
    JobStatus: 'string',
    ColorCode: 'string',
  },
};

export const AllWorkType = {
  name: ALL_WORK_TYPE,
  embedded: true,
  properties: {
    WorkTypeId: 'int?',
    CompanyId: 'int?',
    WoCategoryId: 'int?',
    WorkType: 'string?',
    PriorityId: 'int?',
  },
};

export const AllWorkTask = {
  name: ALL_WORK_TASK,
  embedded: true,
  properties: {
    WoCategoryId: 'int?',
    WoCategory: 'string?',
    WorkTypeId: 'int?',
    WorkType: 'string?',
    WorkTaskId: 'int?',
    WorkTask: 'string?',
    CompanyId: 'int?',
    CustomerPrice: 'float?',
    DaysPerTask: 'int?',
    HoursPerTask: 'int?',
    MinutesPerTask: 'int?',
    IsAutoSchedule: 'int',
    IsActive: 'int?',
    TechCost: 'int?',
    AddDriveTime: 'int?',
    Description: 'string?',
    Scheduling: 'string?',
    Duration: 'string?',
    Cost: 'string?',
    WorkGroupId: 'int?',
    PricingUnitId: 'int?',
  },
};

export const RejectReasons = {
  name: REJECT_REASON,
  embedded: true,
  properties: {
    StatusReasonId: 'int?',
    StatusReason: 'string?',
  },
};

export const ContactTypes = {
  name: CONTACT_TYPES,
  embedded: true,
  properties: {
    ContactTypeId: 'int?',
    ContactTypeDesc: 'string?',
  },
};

export const TitleNames = {
  name: TITLE_NAMES,
  embedded: true,
  properties: {
    TitleId: 'int?',
    Title: 'string?',
  },
};

export const UnResolvedCompletedReasons = {
  name: UNRESOLVED_COMPLETED_REASON,
  properties: {
    StatusReasonId: 'int?',
    StatusReason: 'string?',
    JobStatusId: 'int?',
    Description: 'string?',
  },
};

export const AttachmentTypes = {
  name: ATTACHMENT_TYPE,
  embedded: true,
  properties: {
    AttachmentTypeId: 'int?',
    AttachmentType: 'string?',
  },
};

export const BrandLists = {
  name: BRAND_LISTS,
  embedded: true,
  properties: {
    BrandId: 'int?',
    Location: 'string?',
    Brand: 'string?',
    Description: 'string?',
    IsActive: 'int?',
  },
};

export const GeoFensingCategoryList = {
  name: GEOFENCING_CATEGORY_LIST,
  embedded: true,
  properties: {
    WoCategoryId: 'int?',
    WoCategory: 'string?',
    IsActive: 'int?',
  },
};

export const ModelLists = {
  name: MODAL_LISTS,
  embedded: true,
  properties: {
    ModelId: 'int?',
    BrandId: 'int?',
    Brand: 'string?',
    Model: 'string?',
    Description: 'string?',
    IsActive: 'int?',
    ChklistMastId: 'int?',
    ModelChklistId: 'int?',
    counts: 'int?',
  },
};

export const RequestType = {
  name: REQUEST_TYPE,
  embedded: true,
  properties: {
    OEMPartReqTypeId: 'int?',
    OEMPartReqType: 'string?',
  },
};

export const LocationViolationReasons = {
  name: LOCATION_VIOLATION_REASONS,
  embedded: true,
  properties: {
    GeoFencingStatusReasonId: 'int?',
    JobStatusId: 'int?',
    GeoFencingStatusReason: 'string?',
    Description: 'string?',
  },
};

export const GetConfigDetail = {
  name: GET_CONFIG_DETAIL,
  embedded: true,
  properties: {
    ConfigDtlId: 'int?',
    ConfigMasterId: 'int?',
    Description: 'string?',
  },
};

export const PaymentModes = {
  name: PAYMENT_MODE,
  embedded: true,
  properties: {
    PaymentModeId: 'int?',
    PaymentModeDesc: 'string?',
  },
};

export const PriceTypes = {
  name: PRICING_TYPE,
  embedded: true,
  properties: {
    PriceTypeId: 'int?',
    PriceType: 'string?',
  },
};

export const TaxGroups = {
  name: TAX_GROUP,
  embedded: true,
  properties: {
    TaxId: 'int?',
    TaxName: 'string?',
    TaxPercent: 'int?',
    TaxValue: 'string?',
    IsActive: 'int?',
  },
};

export const Taxes = {
  name: TAXS,
  embedded: true,
  properties: {
    TaxId: 'int?',
    TaxName: 'string?',
    TaxPercent: 'int?',
    TaxValue: 'string?',
    IsActive: 'int?',
  },
};

export const ContractType = {
  name: CONTRACT_TYPE,
  embedded: true,
  properties: {
    CompanyId: 'int?',
    ContractTyp: 'string?',
    ContractTypeId: 'int?',
    IsActive: 'int?',
  },
};

export const GetCheckListMaster = {
  name: GET_CHECKLIST_MASTER,
  embedded: true,
  properties: {
    ChklistMastId: 'int?',
    ChklistName: 'string?',
    Description: 'string?',
    IsActive: 'int?',
    Mandatory: 'int?',
  },
};

export const GetSlaPriority = {
  name: GET_SLA_PRIORITY,
  embedded: true,
  properties: {
    CalcTypeId: 'int?',
    Color: 'string?',
    CompanyId: 'int?',
    CreatedBy: 'int?',
    CreatedDate: 'string?',
    Description: 'string?',
    Duration: 'int?',
    Durationstr: 'int?',
    ExcludeHolidays: 'int?',
    HolidayTemplateTypeId: 'int?',
    IsActive: 'int?',
    IsDefault: 'int?',
    IsResolutionSlaEnabled: 'int?',
    IsResponseSlaEnabled: 'int?',
    LastChangedBy: 'int?',
    LastUpdate: 'string?',
    PriorityId: 'int?',
    PriorityName: 'string?',
    ReslCutOffTime: 'string?',
    ReslCutOffTimeZoneId: 'int?',
    ReslSLADurationType: 'string?',
    ReslSLADurationTypeId: 'int?',
    RespCutOffTime: 'string?',
    RespCutOffTimeZoneId: 'int?',
    RespSLADurationType: 'string?',
    RespSLADurationTypeId: 'int?',
    ResponseDuration: 'int?',
    ResponseSlaDays: 'int?',
    ResponseSlaHours: 'int?',
    ResponseSlaMinutes: 'int?',
    ResponseSlaStartsFrom: 'int?',
    ResponseSlaStopStatusId: 'int?',
    ShowResolutionSlaTimer: 'string?',
    ShowResponseSlaTimer: 'string?',
    SlaDays: 'int?',
    SlaHours: 'int?',
    SlaMinutes: 'int?',
    SlaStartsFrom: 'int?',
    SlatStopStatusId: 'int?',
  },
};

export const GetLanguageList = {
  name: GET_LANGUAGE_LIST,
  embedded: true,
  properties: {
    LanguageId: 'int?',
    LanguageName: 'string?',
  },
};
export const MasterData = {
  name: MASTER_DATA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    SystemSettings: { type: 'list', objectType: SYSTEM_SETTING },
    TimeOffReasons: { type: 'list', objectType: TIME_OFF_REASON },
    Leavetypes: { type: 'list', objectType: LEAVE_TYPES },
    TimeOffStatus: { type: 'list', objectType: TIME_OFF_STATUS },
    CategoryMaster: { type: 'list', objectType: CATEGORY_MASTER },
    JobStatus: { type: 'list', objectType: JOB_STATUS },
    AllWorkType: { type: 'list', objectType: ALL_WORK_TYPE },
    AllWorkTask: { type: 'list', objectType: ALL_WORK_TASK },
    RejectReasons: { type: 'list', objectType: REJECT_REASON },
    ContactTypes: { type: 'list', objectType: CONTACT_TYPES },
    TitleNames: { type: 'list', objectType: TITLE_NAMES },
    UnResolvedCompletedReasons: {
      type: 'list',
      objectType: UNRESOLVED_COMPLETED_REASON,
    },
    AttachmentTypes: {
      type: 'list',
      objectType: ATTACHMENT_TYPE,
    },
    BrandLists: {
      type: 'list',
      objectType: BRAND_LISTS,
    },
    GeoFensingCategoryList: {
      type: 'list',
      objectType: GEOFENCING_CATEGORY_LIST,
    },
    ModelLists: {
      type: 'list',
      objectType: MODAL_LISTS,
    },
    RequestType: {
      type: 'list',
      objectType: REQUEST_TYPE,
    },
    LocationViolationReasons: {
      type: 'list',
      objectType: LOCATION_VIOLATION_REASONS,
    },
    GetConfigDetail: {
      type: 'list',
      objectType: GET_CONFIG_DETAIL,
    },
    PaymentModes: {
      type: 'list',
      objectType: PAYMENT_MODE,
    },
    PriceTypes: {
      type: 'list',
      objectType: PRICING_TYPE,
    },
    TaxGroups: {
      type: 'list',
      objectType: TAX_GROUP,
    },
    Taxes: {
      type: 'list',
      objectType: TAXS,
    },
    ContractType: {
      type: 'list',
      objectType: CONTRACT_TYPE,
    },
    GetCheckListMaster: {
      type: 'list',
      objectType: GET_CHECKLIST_MASTER,
    },
    GetSlaPriority: {
      type: 'list',
      objectType: GET_SLA_PRIORITY,
    },
    GetLanguageList: {
      type: 'list',
      objectType: GET_LANGUAGE_LIST,
    },
  },
};
