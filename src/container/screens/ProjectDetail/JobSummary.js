import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  BlackMoreOptionIcon,
  DeleteBlackIcon,
  UserIcon,
  UserImg,
} from '../../../assets/img/index.js';
import { Colors } from '../../../assets/styles/colors/colors';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';
import HeaderComponent from '../../../components/header';
import MainHoc from '../../../components/Hoc/index';
import Loader from '../../../components/Loader/index.js';
import { Text } from '../../../components/Text/index';
import api from '../../../lib/api/index.js';
import { Header } from '../../../lib/buildHeader.js';
import { fontFamily, normalize } from '../../../lib/globals.js';
import { strings } from '../../../lib/I18n';
import {
  dateTimeConverter,
  dateTimeConverter1,
  iosToDMY,
} from '../../../util/helper.js';
import AddMoreModal from '../JobList/addMore';

export const Label = [
  {
    label: 'Created',
    color: Colors.primaryColor,
    status: 'Completed',
  },
  {
    label: 'Scheduled',
    color: Colors.primaryColor,
    status: 'in-process',
  },
  {
    label: 'En Route',
    color: '#4e9bff',
    status: 'pending',
  },
  {
    label: 'On Site',
    color: '#5F06AC',
    status: 'pending',
  },
  {
    label: 'Completed',
    color: '#43BF57',
    status: 'pending',
  },
  {
    label: 'Submitted',
    color: '#3F3F3F',
    status: 'pending',
  },
  {
    label: 'Approval Rejected',
    color: '#FE0000',
    status: 'pending',
  },
  {
    label: 'Submitted',
    color: '#3F3F3F',
    status: 'pending',
  },

  {
    label: 'Approved',
    color: '#5F06AC',
    status: 'pending',
  },
];

const JobSummary = ({ navigation, route }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [statusLabel, setstatusLabel] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const jobStatusTimeline = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetJobStatusTimeLine,
  );

  const [jobTimeLine, setJobTimeLine] = useState(jobStatusTimeline);

  useEffect(() => {
    if (route?.params?.data) {
      const jobInfo = route?.params?.data;
      let index = 0;
      Label.map((e, i) => {
        if (e?.label.toLowerCase() === jobInfo?.JobStatus?.toLowerCase()) {
          if (jobTimeLine[0]?.JobStatus == 'Completed') {
            if (jobTimeLine[0]?.SubmittedDate != null) {
              index = 5
            }
            else if (jobTimeLine[0]?.ApprovedRejected != null && jobTimeLine[0]?.SubmittedDate == null) {
              index = 6
            }
            else {
              index = 4
            }
          }
          else {
            index = i;
          }
        }
      });
      const sortedData = Label.map((element, id) => {
        return {
          ...element,
          status: id < index ? 'Completed' : id === index ? 'in-progress' : 'pending',
        };
      });

      setstatusLabel(sortedData);
    }
  }, [route]);

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleAddMore();
      },
    },
  ];
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  useEffect(() => {
    fetchJobSummary();
  }, []);

  const fetchJobSummary = () => {
    const handleCallback = {
      success: (data) => {
        setJobTimeLine(data);
        setIsLoading(false);
      },
      error: (err) => {
        setIsLoading(false);
      },
    };

    setIsLoading(true);

    const endPoint = `?CompanyId=${userInfo?.CompanyId}&TechId=${userInfo?.sub}&WoJobId=${jobInfo?.WoJobId}&WorkOrderId=${jobInfo?.WorkOrderId}`;

    const header = Header(token);
    api.getJobTimeLine('', handleCallback, header, endPoint);
  };

  const renderStutusTime = (val) => {
    switch (val) {
      case 'Created':
        return jobTimeLine[0]?.JobCreated;
      case 'Scheduled':
        return jobTimeLine[0]?.Scheduled;
      case 'En Route':
        return jobTimeLine[0]?.Enroute != null ? jobTimeLine[0]?.Enroute : new Date();
      case 'On Site':
        return jobTimeLine[0]?.OnSite != null ? jobTimeLine[0]?.OnSite : new Date();
      case 'Completed':
        return jobTimeLine[0]?.CompletedUnResolved != null ? jobTimeLine[0]?.CompletedUnResolved : new Date();
      case 'Submitted':
        return jobTimeLine[0]?.SubmittedDate != null ? jobTimeLine[0]?.SubmittedDate : new Date();
      case 'Approval Rejected':
        return jobTimeLine[0]?.ApprovedRejected != null ? jobTimeLine[0]?.ApprovedRejected : new Date();
      case 'Submitted':
        return jobTimeLine[0]?.SubmittedDate != null ? jobTimeLine[0]?.SubmittedDate : new Date();
      case 'Approved':
        return '';
      default:
        return '';
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      // <TouchableOpacity
      //   disabled={item.status == 'pending' ? true : false}
      //   style={styles.timeLineWrap}>
      <View style={styles.timeLineWrap}>
        <View style={styles.statusWrap}>
          <View
            style={[
              styles.outerCircle,
              {
                backgroundColor:
                  item.status == 'pending'
                    ? Colors.borderGrey
                    : Colors.primaryColor,
              },
            ]}>
            {item.status != 'Completed' && <View style={styles.innerCircle} />}
          </View>

          <Text
            align={'flex-start'}
            size={normalize(17)}
            fontFamily={fontFamily.bold}
            color={item.color}
            style={{
              opacity: item.status == 'pending' ? 0.3 : 1,
              paddingLeft: normalize(10),
              paddingTop: 0,
            }}>
            {item?.label}
          </Text>
        </View>
        {item?.status != 'pending' ? (

          <View style={styles.infoWrap}>
            <Text style={{ marginRight: normalize(20) }}>
              {iosToDMY(renderStutusTime(item?.label))}
            </Text>
            <UserImg
              width={normalize(15)}
              height={normalize(15)}
              fill={Colors?.primaryColor}
            />
            <Text style={{ marginLeft: normalize(5) }}>
              {jobTimeLine[0]?.DisplayName}
            </Text>
          </View>
        ) : (
          <View style={{ padding: normalize(10) }} />
        )}
        {index < Label.length - 1 && <View style={styles.dootedLine} />}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={strings('job_summary.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        HeaderRightIcon={headerRightIcons}
      />
      <View style={styles.FlatListWrap}>
        <FlatList
          data={statusLabel}
          renderItem={renderItem}
          keyExtractor={(item, index) => `ID-${index}`}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
        />
      ) : null}
      {/* <Loader visibility={isLoading} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
    flex: 1,
  },
  FlatListWrap: {
    marginHorizontal: normalize(28),
    marginBottom: normalize(20),
    paddingVertical: normalize(25),
  },
  completedIcon: {
    width: normalize(16),
    height: normalize(16),
    borderRadius: normalize(12),
    padding: normalize(10),
  },
  progressCircle: {
    borderWidth: normalize(5),
    borderRadius: normalize(15),
    padding: normalize(6),
  },
  infoWrap: {
    flexDirection: 'row',
    paddingLeft: normalize(30),
    paddingVertical: normalize(10),
  },
  dootedLine: {
    width: 1,
    borderWidth: 0.8,
    height: normalize(60),
    borderRadius: 1,
    borderStyle: 'dashed',
    position: 'absolute',
    left: normalize(9),
    top: normalize(20),
    borderColor: '#C9C9C9',
    // // marginVertical: normalize(10),
    // marginBottom: normalize(-14),
  },
  timeLineWrap: {
    position: 'relative',
    height: normalize(80),
    // paddingVertical: normalize(15),
  },
  outerCircle: {
    borderRadius: normalize(9),
    width: normalize(18),
    height: normalize(18),
    // backgroundColor: Colors.primaryColor,
    position: 'relative',
  },
  innerCircle: {
    borderRadius: normalize(6),
    width: normalize(12),
    height: normalize(12),
    top: 3,
    left: 3,
    backgroundColor: 'white',
    position: 'absolute',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default MainHoc(JobSummary);
