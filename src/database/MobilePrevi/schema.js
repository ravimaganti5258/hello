export const MOBILE_PREVILAGE = 'MobilePrevilage';

export const MobilePrevilage = {
    name: MOBILE_PREVILAGE,
    primaryKey: 'id',
    properties: {
        id: 'int?',
        AddRights: 'int?',
        DeleteRights: 'int?',
        EditRights: 'int?',
        IsMenu: 'int?',
        MenuId: 'int?',
        MenuName: 'string?',
        ModuleId: 'int?',
        ParentMenuId: 'int?',
        UiPageName: 'string?',
        ViewRights: 'int?',
    },
};
