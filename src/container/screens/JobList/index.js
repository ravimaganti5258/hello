import React, { useCallback, useEffect, useRef, useState } from 'react';

import { StyleSheet, View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobCalenderSetting,
  storeMasterData,
} from '../../../database/webSetting';
import { fetchMasterData } from '../../../redux/masterData/action';

import {
  BlackMoreOptionIcon,
  CrossIcon,
  FilterIcon,
  SearchIcon,
  MenuIcon,
} from '../../../assets/img/index.js';
import { Colors } from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import { fontFamily, normalize } from '../../../lib/globals';
import Calender from './Calender.js';
import CalenderView from './CalenderView.js';
import FilterModal from './FilterModal.js';
import AddMoreModal from './addMore';
import MapView from './MapView.js';
import SearchBar from '../../../components/SearchBar/index.js';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types.js';
import api from '../../../lib/api/index.js';
import {
  convertDateString,
  getCurrentDateString,
  StartEndDate,
  getCurrentDateWithDay,
} from '../../../util/helper.js';
import Loader from '../../../components/Loader/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { queryAllRealmObject } from '../../../database/index.js';
import { useFocusEffect, useRoute } from '@react-navigation/core';

import { Text } from '../../../components/Text/index';
import { strings } from '../../../lib/I18n/index.js';
import { getJobListFromLocal } from '../../../database/JobList/index.js';
import { JOB_LIST } from '../../../database/JobList/schema.js';
import { getLanguages } from 'react-native-i18n';

const JobList = ({ navigation }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [jobListData, setJobListData] = useState([]);
  const [mapViewData, setMapViewData] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [rawData, setRawData] = useState([]);

  const [selectedData, setSelectedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [jobStatus, setJobStatus] = useState([]);
  const [crewOnly, setCrewOnly] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [jobStatusID, setJobStatusID] = useState(null);
  const [message, setMessage] = useState('');
  const [jobList, setJobList] = useState([]);


  let JobId = 0;
  const route = useRoute();
  useEffect(() => {
    try {
      JobId = route.params.JobStatusId;
    } catch (e) { }
  }, []);
  const toggleCrewOnly = () => {
    setCrewOnly(!crewOnly);
  };

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const defaultScreen = useSelector((state) => state?.SettingReducer?.screen);

  const masterData = useSelector((state) => state?.masterDataReducer.data);
  const dispatch = useDispatch();
  const getNoOFDaysFetch = () => {
    const calenderListSetting = masterData?.SystemSettings?.filter(
      (obj) => obj?.SettingId == 77,
    );
    const days =
      calenderListSetting != undefined
        ? calenderListSetting[0]?.SettingValue
        : '';
    return days;
  };

  useEffect(() => {
    if (defaultScreen == 'JobList') {
      getMasterData()
    }
  }, [])
  const getMasterData = () => {
    let obj = {
      LoginId: userInfo?.sub,
      CompanyId: userInfo?.CompanyId,
      token: token,
    };
    dispatch(fetchMasterData(obj, storeMasterData));
  };
  useEffect(() => {
    if (defaultScreen == 'JobList') {
      fetchJobListData()
    }
  }, [masterData])


  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.CategoryMaster.map((obj) => {
          return {
            id: obj?.WoCategoryId,
            label: obj?.WoCategory,
            value: obj?.WoCategory,
          };
        });

        const jobStatusObject = res?.JobStatus.filter(
          (obj) => obj?.JobStatusId == 2 || obj?.JobStatusId == 9,
        );

        const jobStatusArr = jobStatusObject.map((obj) => {
          return {
            id: obj?.JobStatusId,
            label: obj?.JobStatus,
          };
        });
        //Adding hardcode submitted check box to jobstatusarr
        jobStatusArr.push({ id: 11, label: 'Submitted' });
        setJobStatus(jobStatusArr);
        setSelectedData(jobStatusArr);
        setCategories(result);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    fetchDataRealm();
    fetchjobDataFromLocal();
  }, []);

  const fetchjobDataFromLocal = async () => {
    queryAllRealmObject(JOB_LIST).then((res) => {
      const JobLocalData = res?.map((item) => {
        return item;
      });
      // sortJobList(JobLocalData);
    });
  };

  const flatListRef = useRef();

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
  };
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const setMapViewTrue = () => {
    setShowMap(true);
  };

  const setMapViewFalse = () => {
    setShowMap(false);
  };


  const reducer = (acc, cur) => {
    try {
      const dateFormat = convertDateString(cur?.ScheduledDateTime);
      const item = acc.find((x) => x?.date === dateFormat);
      if (item) {
        item.event.push(cur);
      } else {
        acc.push({
          date: dateFormat,
          event: [cur],
        });
      }
      return acc;
    } catch (error) { }
  };

  //Creating array of days contains job list data and current date data
  // const getAllMonthData =(data)=>{
  //  const NoOfDays =getNoOFDaysFetch();
  //   const getalldateArray = GetAllDates(NoOfDays);

  //   mergeByProperty(getalldateArray, data, 'date');

  //   setJobListData(getalldateArray);

  // }
  // //merge two arrays
  // const mergeByProperty = (target, source, prop) => {
  //   source.forEach(sourceElement => {
  //     let targetElement = target.find(targetElement => {
  //       return sourceElement[prop] === targetElement[prop];
  //     })
  //     targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
  //   })
  // }

  const convertData = (list) => {
    const requiredData = list?.reduce(reducer, []);
    //Adding for filter data
    setJobListData(requiredData);
    setMapViewData(requiredData);
    // showFilter ? setJobListData(requiredData) :getAllMonthData(requiredData);

    //getAllMonthData(requiredData);

    // dispatch({type: SET_LOADER_FALSE});
  };

  const formatDateForSorting = (date) => {
    const splitDate = date?.split(' ');
    return splitDate[0];
  };

  //Filter the list according to dashbord
  const filterData = (sortedData, Id) => {
    let newData = [];
    switch (Id) {
      //JobList Without Filter
      case 0:
        newData = [...sortedData];
        break;
      // JobList filter for Appointment today
      case -1:
        newData = sortedData.filter((job) => {
          return (
            formatDateForSorting(job.ScheduledDateTime) ==
            getCurrentDateWithDay()
            // &&
            // job?.JobStatusid <= 2
          );
        });


        break;
      //JobList filter for In Progress jobs
      case 5:
        let date = getCurrentDateWithDay();
        newData = sortedData?.filter((job) => {
          return (
            (job?.JobStatusid == 5 ||
              job?.JobStatusid == 4 ||
              job?.JobStatusid == 3) &&
            job?.issubmitted != 'yes'
            // && formatDateForSorting(job.ScheduledDateTime) ==
            // date
          );
        });

        break;
      //JobList Filter for upcomming Jobs
      case 10:
        newData = sortedData.filter((job) => {

          return new Date(job.ScheduledDateTime) > new Date() && job.JobStatusid <= 2;
        });


        if (newData?.length > 0) {
          formatDateForSorting(newData[0]?.ScheduledDateTime) ==
            getCurrentDateWithDay()
            ? newData.shift()
            : null;
        }
        break;
      // JobList filter for waiting for submission
      case 12:
        newData = sortedData.filter((job) => {
          return job.JobStatusid == 5 && job.issubmitted != 'yes';
        });

        break;
      case 13:
        //JobList filter for overdue jobs
        newData = sortedData.filter((job) => {
          return (
            job.JobStatusid == 2 && new Date(job.ScheduledDateTime) < new Date()
          );
        });
        const length = newData?.length;
        length != 0
          ? formatDateForSorting(newData[length - 1].ScheduledDateTime) ==
            getCurrentDateWithDay()
            ? newData.pop()
            : null
          : null;
        break;
      default:
        newData = [...sortedData];
        break;
    }
    return newData;
  };

  const sortJobList = (data) => {

    try {
      const isDescending = false;
      const sortedData = data.sort((a, b) => {
        return isDescending
          ? new Date(formatDateForSorting(b?.ScheduledDateTime)).getTime() -
          new Date(formatDateForSorting(a?.ScheduledDateTime)).getTime()
          : new Date(formatDateForSorting(a?.ScheduledDateTime)).getTime() -
          new Date(formatDateForSorting(b?.ScheduledDateTime)).getTime();
      });
      //Adding for changing data acroding to dashborad
      const filteredData = filterData(sortedData, JobId);

      //filter rejected job
      const removedRejectJob = filteredData.filter(
        (ele) => ele.AcceptanceStatusId != 2,
      );

      convertData(removedRejectJob);
      // setMapViewData(sortedData);
      setRawData(sortedData);
      // dispatch({type: SET_LOADER_FALSE});
    } catch (error) {
      convertData(data);
      // setMapViewData(data);
      setRawData(data);
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const refreshData = () => {
    JobId = 0;
    fetchJobListData();
  };
  const fetchJobListData = () => {
    dispatch({ type: SET_LOADER_TRUE });
    const NoOfDays = getNoOFDaysFetch();
    const startEndDate = StartEndDate(NoOfDays);
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        MaxRoleGroupId: userInfo?.MaxRoleGroup,
        LoginVendorId: userInfo?.VendorId,
        LoginId: userInfo?.sub,
        // ScheduleStartDate: "01/01/2021",
        // ScheduleEndDate: "01/01/2022",
        //need to change the date as per current date
        ScheduleStartDate: startEndDate?.startDate,
        ScheduleEndDate: startEndDate?.endDate,
      };
      const handleCallback = {
        success: (response) => {

          setJobList(response);
          sortJobList(response);
          // convertData(response);
          // setMapViewData(response);
          setRawData(response);
          setMessage('No Data Available');
          dispatch({ type: SET_LOADER_FALSE });
          response.length === 0 && dispatch({ type: SET_LOADER_FALSE });
        },
        error: (jobListErr) => {
          setMessage('No Data Available');
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      api.jobListing(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (e) {
      setMessage('No Data Available');
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobListData();
    }, []),
  );

  // const getPreviousDate = () => {
  //   try {
  //     const previousDate = jobListData.filter((job) => {
  //       return (
  //         new Date().getTime() -
  //           new Date(
  //             formatDateForSorting(job?.event[0]?.ScheduledDateTime),
  //           ).getTime() >
  //         0
  //       );
  //     });
  //     const prevDate = previousDate[previousDate?.length - 1];
  //     const index = jobListData.findIndex(
  //       (item) => item.date == prevDate?.date,
  //     );
  //     if (index == -1) {
  //       return 0;
  //     }
  //     return index;
  //   } catch (error) {
  //   }
  // };

  //find nextclosest date
  const findClosestPrevDate = (arr, target) => {
    const array = [];
    arr.forEach((element) => {
      array.push(element.date);
    });

    let targetDate = new Date(target);
    let previousDates = array.filter((e) => targetDate - new Date(e) > 0);

    let sortedPreviousDates = previousDates.sort(
      (a, b) => new Date(b) - new Date(a),
    );

    return sortedPreviousDates[0] || null;
  };
  const findClosestNextDate = (arr, target) => {
    const array = [];
    arr.forEach((element) => {
      array.push(element.date);
    });

    let targetDate = new Date(target);
    let nextDates = array.filter((e) => targetDate - new Date(e) < 0);

    let sortedPreviousDates = nextDates.sort(
      (a, b) => new Date(a) - new Date(b),
    );

    return sortedPreviousDates[0] || null;
  };

  const findNearByDate = (crrDate, data) => {
    try {
      // const nextDate = jobListData.filter((job) => {
      //   return (
      //     new Date().getTime() -
      //       new Date(
      //         formatDateForSorting(job?.event[0]?.ScheduledDateTime),
      //       ).getTime() <
      //     0
      //   );
      // })[0];
      const nextDate = findClosestNextDate(data, crrDate);
      const prevDate = findClosestPrevDate(data, crrDate);

      const oneDay = 24 * 60 * 60 * 1000;

      const firstDate = new Date(nextDate);
      const secondDate = new Date(prevDate);
      const currDate = new Date(crrDate)
      const diffDays1 = Math.round(Math.abs((currDate - secondDate) / oneDay));
      const diffDays2 = Math.round(Math.abs((currDate - firstDate) / oneDay));
      let index
      if (diffDays1 == diffDays2) {
        index = data.findIndex((item) => item.date == nextDate);
      }
      else if (diffDays1 > diffDays2) {
        index = data.findIndex((item) => item.date == nextDate);
      } else {
        index = data.findIndex((item) => item.date == prevDate);
      }


      if (index == -1) {
        const nextDate = findClosestPrevDate(data, crrDate);
        const index = data.findIndex((item) => item.date == nextDate);
        return index;
      }
      return index;
    } catch (error) { }
  };

  const findIndex = () => {
    try {
      const crrDate = getCurrentDateString();
      const foundData = jobListData.findIndex((item) => item.date == crrDate);
      if (foundData == -1) {
        return findNearByDate(crrDate, jobListData);
      }
      return foundData || 0;
    } catch (error) { }
  };

  const [scrollIndex, setScrollIndex] = useState(0);

  // useEffect(() => {
  //   try {
  //     flatListRef.current.scrollToIndex({ index: scrollIndex });
  //   } catch (error) { }
  // }, [scrollIndex]);

  useEffect(() => {
    const clear = setTimeout(() => {
      try {
        if (jobListData?.length > 0) {
          const index = findIndex();

          dispatch({ type: SET_LOADER_FALSE });
          setScrollIndex(index);
          // flatListRef.current.scrollToIndex({index: scrollIndex});
        } else {
          null;
        }
      } catch (error) { }
    }, 2000);
    return () => {
      clearTimeout(clear);
    };
  }, [jobListData, mapViewData]);

  const searchAction = () => {
    setScrollIndex(0)
    dispatch({ type: SET_LOADER_TRUE });
    try {
      if (searchQuery?.length != 0) {
        const query = searchQuery?.toLowerCase().trim();
        const filteredData = rawData.filter(
          (job) =>
            job?.jobno?.toString()?.toLowerCase().includes(query) ||
            job?.customername?.toLowerCase().includes(query) ||
            job?.wocategory?.toLowerCase().includes(query) ||
            job?.AcctualAddress?.toLowerCase().includes(query) ||
            job?.jobstatus?.toLowerCase().includes(query),
        );

        convertData(filteredData);
        // setMapViewData(filteredData);
        dispatch({ type: SET_LOADER_FALSE });
      }
      else {
        convertData(rawData)
      }
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const handleCancelSearch = () => {
    try {
      toggleSearchIcon();
      if (showSearch) {
        fetchJobListData();
      }
    } catch (error) { }
  };
  const handleFilter = () => {
    const selecetedStatus = selectedData.filter((i) => i.selected == true);
    var filteredDataList = [...jobList];
    if (
      selecetedStatus.length > 0 ||
      customerName != '' ||
      selectedItem != null ||
      selectedItem?.label != 'Select' ||
      crewOnly
    ) {
      if (selecetedStatus.length > 0) {
        var filterByStatus = [];

        switch (selecetedStatus[0].label) {
          case 'In Progress':
            filterByStatus = filteredDataList.filter(
              (ele) =>
                (ele.jobstatus == 'En Route' ||
                  ele.jobstatus == 'On Site' ||
                  ele.jobstatus == 'Completed') &&
                ele.issubmitted != 'yes',
            );
            break;
          case 'Scheduled':
            filterByStatus = filteredDataList.filter(
              (ele) => ele.jobstatus == 'Scheduled',
            );
            break;
          case 'Submitted':
            filterByStatus = filteredDataList.filter(
              (ele) => ele.issubmitted == 'yes' && ele.AcceptanceStatusId == 1,
            );
            break;
          default:
            break;
        }
        filteredDataList = [];
        filteredDataList = [...filterByStatus];
      }

      if (customerName != '') {
        const searchtext = customerName.toLowerCase()

        var filterByCustomerName = filteredDataList.filter(function (ele) {
          let name = ele.customername.toLowerCase()
          return name.includes(searchtext)
        }
          // (ele) => ele.customername == customerName,
        );

        filteredDataList = [];
        filteredDataList = [...filterByCustomerName];
      }
      if (selectedItem != null && selectedItem.label != 'Select') {
        var filterByCategory = filteredDataList.filter(
          (ele) => ele.wocategory == selectedItem.label,
        );
        filteredDataList = [];
        filteredDataList = [...filterByCategory];
      }
      if (crewOnly) {
        var filterByCrewJobs = filteredDataList.filter(
          (ele) => ele.CrewJob != 'No',
        );
        filteredDataList = [];
        filteredDataList = [...filterByCrewJobs];
      }
    } else {
      filteredDataList = [];
      filteredDataList = [...jobList];

    }
    setScrollIndex(0)
    sortJobList(filteredDataList);
    toggleFilter();
  };
  const headerRightIcons = [
    {
      name: !showSearch ? SearchIcon : CrossIcon,
      onPress: handleCancelSearch,
    },
    { name: FilterIcon, onPress: toggleFilter },
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];

  return (
    <>
      <View>
        {defaultScreen == 'JobList' ? (
          <Header
            title={strings('Job_List.header_title')}
            leftIcon={'MenuBurger'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
        ) : (
          <Header
            title={strings('Job_List.header_title')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
          />
        )}
        {showSearch ? (
          <SearchBar
            searchAction={searchAction}
            onChangeText={setSearchQuery}
            onEndEditing={searchAction}

          />
        ) : null}
      </View>
      {showFilter ? (
        <FilterModal
          handleModalVisibility={toggleFilter}
          visibility={showFilter}
          title={strings('Job_List.Filter_By')}
          token={token}
          userInfo={userInfo}
          dispatch={dispatch}
          setMapViewData={setMapViewData}
          sortJobList={sortJobList}
          selectedData={selectedData}
          selectedItem={selectedItem}
          categories={categories}
          jobStatus={jobStatus}
          crewOnly={crewOnly}
          customerName={customerName}
          toggleCrewOnly={toggleCrewOnly}
          setCustomerName={setCustomerName}
          setSelectedItem={setSelectedItem}
          setSelectedData={setSelectedData}
          jobStatusID={jobStatusID}
          setJobStatusID={setJobStatusID}
          handleFilter={handleFilter}
        />
      ) : null}

      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
        />
      ) : null}

      <View style={{ flexGrow: 1 }}>
        <Calender
          showMapView={setMapViewTrue}
          hideMapView={setMapViewFalse}
          showMap={showMap}
          data={showMap ? mapViewData : jobListData}
          flatListRef={flatListRef}
          refreshClick={refreshData}
          setScrollIndex={setScrollIndex}
          findNearByDate={findNearByDate}
        />
        {showMap ? (
          <MapView
            mapViewData={mapViewData}
            flatListRef={flatListRef}
            scrollIndex={scrollIndex}
          />
          // null
        ) : (
          <CalenderView
            data={jobListData}
            message={message}
            flatListRef={flatListRef}
            scrollIndex={scrollIndex}
          />
        )}
      </View>
      <Loader visibility={isLoading} />
      {/* {message != '' && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('JobDetail', {
              jobId: 19157050,
              isCrewMember: 0,
            })
          }>
          <Text>get job Details</Text>
        </TouchableOpacity>
      )} */}
    </>
  );
};

export default MainHoc(JobList);

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
   
  },
  leftIconStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    //marginRight: normalize(15),
    //marginLeft: 10,
    height: normalize(40),
    width: normalize(30),
  },
});
