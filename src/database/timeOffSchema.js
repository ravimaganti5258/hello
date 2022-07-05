export const APPLY_TIME_OFF = 'ApplyTimeOff';
export const TIME_OFF_HISTORY = 'TimeOffHistory';

export const ApplyTimeOff = {
  name: APPLY_TIME_OFF,
  properties: {
    id: 'int',
    CompanyId: 'string',
    TechId: 'string',
    LeaveTypeId: 'int',
    Days: 'int',
    StartTime: 'string',
    EndTime: 'string',
    ReasonId: 'string',
    ManagerId: 'string',
    RejectedRemarks: 'string',
    StatusId: 'int',
    CreatedBy: 'int',
    CreatedSourceId: 'int',
    Reason: 'string',
    TechOffTimeQueueId: 'string',
  },
};

export const TimeOffHistory = {
  name: TIME_OFF_HISTORY,
  properties: {
    id: 'int',
    TechOffTimeQueueId: 'int',
    LeaveType: 'string',
    Days: 'int',
    Hours: 'int',
    StartTime: 'string',
    EndTime: 'string',
    Reason: 'string',
    Status: 'string',
    AppliedOn: 'string',
    RejectedBy: 'string',
    RejectedDate: 'string',
    ApprovedBy: 'string',
    ApprovedOn: 'string',
    ApprovedRemarks: 'string',
    RejectedRemarks: 'string',
    StatusId: 'int',
  },
};
