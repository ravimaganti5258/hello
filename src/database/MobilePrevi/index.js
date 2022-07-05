import {
    databaseOptions,
    insertNewRealmObject,
    queryAllRealmObject,
} from '../index';
import Realm from 'realm';
import { MOBILE_PREVILAGE } from './schema';

export const checkExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                // getMobilePrevilageFromLocal()
                updateMobilePrevObjFormApi(value)


            })
            .catch((error) => reject(error));
    });

export const storeMobilePrevilageInLocal = (Data) => {

    Data?.map((item, index) => {
        let data = {
            id: item?.MenuId,
            ...item,
        };
        checkExistOrNot(data, MOBILE_PREVILAGE);
    });
};


//update data when comming from api 
export const updateMobilePrevObjFormApi = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(MOBILE_PREVILAGE, value?.id);

                    updatingObj = value
                    resolve()
                })
            }).catch((error) => { reject(error), console.log({ error }) })
    })
}

export const getMobilePrevilageFromLocal = async (callBack) => {
    const data = await queryAllRealmObject(MOBILE_PREVILAGE).then((res) => {
        let list = res.map((obj) => {
            return obj;
        });
        return list;
    });

    callBack && callBack(data)

    return data;
};


export const fetchMobilePrevBasedOnMenuName = async (MenuName) => {

    let obj = {}
    await getMobilePrevilageFromLocal().then((res) => {
        res.map((item) => {
            if (item.MenuName == MenuName) {
                obj = item
            }
        })
    })
    return obj
}

export const bottomIconShow = async (item) => {
    let label = item.label == 'Incidents' ? 'Punch List' : item.label == 'Service_Report' ? 'Job Print' : item.label
    let flag = true

    await fetchMobilePrevBasedOnMenuName(label).then((res) => {
        if (res.ViewRights == 1) {
            flag = true
        }
        else {
            flag = false
        }

    })
    // accessPermission(label).then((re) => console.log({ re }))
    return flag
}


//sort bottom sheetMenu  based on vire permission
export const sortedBottomList = (data) => {
    const xyz = Promise.all(data.map((ele) => {
        const abcd = bottomIconShow(ele).then((res) => {
            if (res) {
                return ele
            }
        })
        return abcd
    })

    ).then((res) => {
        const filterArray = res.filter((ele) => ele != undefined)
        return filterArray

    })

    return xyz
}

//accesss Read Write Permission based on menu Type
export const accessPermission = (menuName) => {
    const data = fetchMobilePrevBasedOnMenuName(menuName).then((res) => {

        let obj = {
            menu: menuName,
            View: res.ViewRights == 1 ? true : false,
            Add: res.AddRights == 1 ? true : false,
            Delete: res.DeleteRights == 1 ? true : false,
            Edit: res?.EditRights == 1 ? true : false
        }
        return obj
    })
    return data

}