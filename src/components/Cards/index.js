import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';

import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {GroupMarker} from '../../assets/img';
import {Colors} from '../../assets/styles/colors/colors';

import {convertFrom12To24Format, dateFormat, fontFamily, getDayDiff, normalize, textSizes, timeFormat,  getCurrentDateString,} from '../../lib/globals';
import {strings} from '../../lib/I18n';
import {Images} from '../../lib/Images';
import {EVIL_ICONS, MATERIAL_COMMUNITY_ICONS} from '../../util/iconTypes';
import Dot from '../Dot';
import {Icon} from '../Icon';
import ShadowBox from '../ShadowBox';
import {Text} from '../Text';
import { useNavigation } from '@react-navigation/native';
import { timeConversion } from 'geolib';
import moment from 'moment';
import {Header} from '../../lib/buildHeader';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../lib/api';




const Cards = ({
  containerStyles,
  notificationId,
  status = 'Approved',
  type = 'notice',
  units = 'Hr',
  date = '12 Jul 2021',
  duration = '08:32PM - 10:02PM',
  taskBorderRadius = 15,
  number = 2,
  showTaskOption = false,
  workType = 'Split Air Conditioner',
  workRequest = 'Installation',
  taskTimer = '10 Days 12 Hrs 59 Mins',
  handleEdit,
  handleDelete,
  jobNumber = '22145987',
  borderLeftColor = Colors.successGreen,
  jobTitle = 'Installation and Maintenance',
  eventDate = '8/20/2021',
  eventTime = '12:00 PM',
  eventStatus = 'Submitted',
  eventJobTime = '',
  recentJobStatusColor = Colors.successGreen,
  recentJobStatus = 'Completed',
  recentJobCompletedTime = '12:00',
  recentJobCompletedDate = '22 Aug 21',
  serviceNotes = 0,
  techRemark = 0,
  employeeName = 'Kathy Taylor',
  recentJobsComment = 'Parts Replaced',
  equipmentModel = 'AIR 7567',
  equipmentBrand = 'Ericsson',
  tagNumber = 'TG76757',
  equipmentSerialNo = 'Eric E456',
  notificationTitle,
  notificationDescription,
  notificationViewed ,
  notificationTime ,
  noticeBoardTime = '10th Aug 2021',
  noticeHeaderTxt = 'Lorem ipsum dolor sit amet,',
  noticeDescription = `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna..."`,
  leaveTitle = '',
  leaveStatus = '',
  technicianName = 'Aaron Williams',
  viewed = false,
  notificationJobId
}) => {
  const navigation = useNavigation();
  
  const EventCardHeader = () => {

  
    return (
      <View style={styles.jobNumberContainer}>
        <View style={styles.jobNumber}>
          <Image source={Images.bag} />
          <Text size={textSizes.h12} style={{marginLeft: normalize(5)}}>
            {strings('common.job')} {jobNumber}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text size={textSizes.h12}>{eventDate}</Text>
          <Text size={textSizes.h12} style={{marginLeft: normalize(5)}}>
            {eventTime}
          </Text>
        </View>
      </View>
    );
  };

  const EventCardFooter = () => {
    return (
      <View style={styles.eventCardFooter}>
        <View style={styles.rowCenter}>
          <Image source={Images.clock} />
          <Text
            style={{marginHorizontal: normalize(5)}}
            size={normalize(13)}
            fontFamily={fontFamily.semiBold}>
            {eventJobTime}
          </Text>
          <Image source={Images.groupIcon} />
        </View>
        <View style={styles.rowCenter}>
          <Dot
            color={
              eventStatus == 'On Site'
                ? Colors.darkOrange
                : eventStatus == 'Submitted'
                ? Colors.cyan
                : eventStatus == 'Approval Rejected'
                ? Colors.dangerRed
                : Colors.successGreen
            }
          />
          <Text
            style={{marginLeft: normalize(5)}}
            size={normalize(13)}
            fontFamily={fontFamily.semiBold}>
            {eventStatus}
          </Text>
        </View>
      </View>
    );
  };

  switch (type) {
    case 'notice': {
      return (
        <ShadowBox containerStyles={{...styles.container, ...containerStyles}}>
          <View style={styles.headerStyles}>
            <View style={styles.iconContainer}>
              <Image
                source={Images.pin}
                style={styles.iconStyles}
                resizeMode={'cover'}
              />
              <Text fontFamily={fontFamily.bold} size={textSizes.h11}>
                {strings('Job_Task_card.NoticeBoard')}
              </Text>
            </View>
            <Text fontFamily={fontFamily.regular} size={normalize(13)}>
              {noticeBoardTime}
            </Text>
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://www.gettyimages.pt/gi-resources/images/Homepage/Hero/PT/PT_hero_42_153645159.jpg',
                }}
                style={styles.imageStyles}
                resizeMode={'cover'}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                align={'flex-start'}
                fontFamily={fontFamily.bold}
                size={textSizes.h11}>
                {noticeHeaderTxt}
              </Text>
              <View>
                <Text
                  numberOfLines={3}
                  align={'flex-start'}
                  size={normalize(13)}
                  fontFamily={fontFamily.regular}>
                  {noticeDescription}
                </Text>
              </View>
            </View>
          </View>
        </ShadowBox>
      );
    }
    case 'notification': {
  const dispatch = useDispatch();

       var d1 = new Date();
    var d1=  dateFormat(d1, 'DD/MM/YYYY HH:MM:MS 12TF')
   var currentDatefrmt = moment(d1, 'DD/MM/YYYY HH:mm:ss').toDate()
var notificationDatefrmt = moment(notificationTime, 'DD/MM/YYYY HH:mm:ss').toDate()
      var timeConverter= convertFrom12To24Format(notificationTime)
      var frmtcurrentDatefrmt = moment(currentDatefrmt).format('Do MMM');
      var frmtnotificationDatefrmt = moment(notificationDatefrmt).format('Do MMM');
var same = frmtcurrentDatefrmt == frmtnotificationDatefrmt

const jobInfo = useSelector(
  (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
);
const userInfo = useSelector((state) => state?.authReducer?.userInfo);
const token = useSelector((state) => state?.authReducer?.token);


const updateNotification =(id)=>{
  try {
    // dispatch({type: SET_LOADER_TRUE});
   
    const handleCallback = {
      success: (data) => {
     
        // dispatch({type: SET_LOADER_FALSE});
      },
      error: (error) => {
        // dispatch({type: SET_LOADER_FALSE});
      },
    };
    const endPoint = `?CompanyId=${userInfo.CompanyId}&Wojobid=${jobInfo?.WorkOrderId}&PushNotificationId=${id}`;

    const header = Header(token);
    api.updateNotification('', handleCallback, header, endPoint);
  } catch (error) {
    // dispatch({type: SET_LOADER_FALSE});
  }
  
}

const viewNotification =()=>{
  updateNotification(notificationId)
  navigation.navigate('JobDetail',{ jobId:notificationJobId,isCrewMember: 0,})
}

      return (
        <TouchableOpacity
        onPress={ ()=>viewNotification()}
        disabled={notificationViewed == 1? true : false}
        >
        <View style={[styles.notificationContainer, containerStyles]}>
        
          <View
            style={{
              ...styles.notificationIcon,
              backgroundColor: notificationViewed == 1
                ? Colors.lightGray
                : Colors.extraLightBlue,
                marginLeft: normalize(20)
            }}>
              <View style={{height: normalize(38), width: normalize(38), backgroundColor:"#F8F9FF", alignItems:"center", justifyContent:"center"}}>
                <Image style={{height:16, width:16,color:'red'}} source={Images.Group775} color='red'/>
              </View>
            {/* <Icon
              type={MATERIAL_COMMUNITY_ICONS}
              name={'briefcase-outline'}
              size={normalize(20)}
              color={notificationViewed ? Colors.darkGray : Colors.primaryColor}
            /> */}
          </View>
          <View style={styles.notificationDetails}>
            <View>
              <Text
                align={'flex-start'}
                size={normalize(12)}
                color={notificationViewed == 1? Colors.darkGray : Colors.secondryBlack}>
                {notificationTitle}
              </Text>
              <Text
                align={'flex-start'}
                size={textSizes.h11}
                fontFamily={notificationViewed == 0? fontFamily.semiBold:fontFamily.light}
                color={notificationViewed==1 ? Colors.darkGray : Colors.secondryBlack}
                style={{marginTop: normalize(5)}}
                numberOfLines={2}>
                {notificationDescription}
              </Text>
            </View>
            <Text
              align={'flex-start'}
              fontFamily={
                fontFamily.regular}
                // notificationViewed == 0? fontFamily.semiBold:fontFamily.light}
              size={normalize(12)}
              style={{marginTop: normalize(10)}}
              color={notificationViewed==1 ? Colors.darkGray : Colors.lightestGrey}>
              {same === true?`Today ${timeConverter}`:notificationTime}
            </Text>
          </View>
        </View>
        </TouchableOpacity>

      );
    }
    case 'task': {
      return (
        <ShadowBox
          containerStyles={{
            borderRadius: normalize(taskBorderRadius),
            ...containerStyles,
          }}>
          <View
            style={{
              ...styles.taskHeader,
              borderTopLeftRadius: normalize(taskBorderRadius),
              borderTopRightRadius: normalize(taskBorderRadius),
            }}>
            <Text color={'white'} fontFamily={fontFamily.semiBold}>
              {strings('Job_Task_card.task')}
            </Text>
            {showTaskOption ? (
              <View style={styles.taskOptainContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.taskOptionIcon}
                  onPress={handleEdit}>
                  <Image source={Images.whiteBorderPen} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.taskOptionIcon}
                  onPress={handleDelete}>
                  <Image source={Images.whiteBin} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View
            style={{
              ...styles.taskInfoContainer,
              borderBottomRightRadius: normalize(taskBorderRadius),
              borderBottomLeftRadius: normalize(taskBorderRadius),
            }}>
            <View style={styles.taskTimerContainer}>
              <Icon type={EVIL_ICONS} name={'clock'} size={normalize(16)} />
              <Text align={'flex-end'} size={textSizes.h12}>
                {taskTimer}
              </Text>
            </View>
            <Text align={'flex-start'} size={textSizes.h12}>
              {strings('add_new_task.work_type')}
            </Text>
            <Text align={'flex-start'} size={textSizes.h10}>
              {workType}
            </Text>
            <Text
              align={'flex-start'}
              size={textSizes.h12}
              style={{marginTop: normalize(10)}}>
              {strings('add_new_task.work_request')}
            </Text>
            <Text align={'flex-start'} size={textSizes.h10}>
              {workRequest}
            </Text>
          </View>
        </ShadowBox>
      );
    }
    case 'calenderEvent': {
      return (
        <ShadowBox
          containerStyles={{
            ...styles.shadowContainer,
            borderLeftColor: borderLeftColor,
            ...containerStyles,
          }}>
          <EventCardHeader />

          <Text
            align={'flex-start'}
            size={textSizes.h10}
            fontFamily={fontFamily.light}
            style={{marginVertical: normalize(5)}}>
            {jobTitle}
          </Text>

          <View
            style={{
              marginTop: normalize(5),
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              paddingBottom: normalize(10),
            }}>
            <View style={{flex: 0.85}}>
              <Text align={'flex-start'} size={textSizes.h10}>
                {technicianName}
              </Text>
              <Text
                align={'flex-start'}
                fontFamily={fontFamily.light}
                numberOfLines={1}
                size={textSizes.h11}>
                {strings('add_new_task.Dubai_inter')}
              </Text>
            </View>
            <View style={{flex: 0.15}}>
              <GroupMarker height={normalize(21)} width={normalize(25)} />
            </View>
          </View>
          <EventCardFooter />
        </ShadowBox>
      );
    }

    case 'mapViewCards': {
      return (
        <ShadowBox
          containerStyles={{
            ...styles.shadowContainer,
            borderLeftColor:
              eventStatus == 'On Site'
                ? Colors.darkOrange
                : eventStatus == 'Submitted'
                ? Colors.cyan
                : eventStatus == 'Approval Rejected'
                ? Colors.dangerRed
                : Colors.successGreen,
            ...containerStyles,
          }}>
          <EventCardHeader />
          <View>
            <Text
              align={'flex-start'}
              size={textSizes.h11}
              fontFamily={fontFamily.semiBold}
              style={{marginTop: normalize(10), marginBottom: normalize(5)}}>
              {jobTitle}
            </Text>
            <Text
              align={'flex-start'}
              size={normalize(13)}
              fontFamily={fontFamily.semiBold}
              style={{paddingBottom: normalize(10)}}>
              {technicianName}
            </Text>
          </View>
          <EventCardFooter />
        </ShadowBox>
      );
    }

    case 'services': {
      return (
        <ShadowBox
          containerStyles={{
            padding: normalize(6),
            ...containerStyles,
          }}>
          <View style={styles.jobNumberContainer}>
            <View style={styles.jobNumber}>
              <Image source={Images.bag} />
              <Text size={textSizes.h12} style={{marginLeft: normalize(5)}}>
                {strings('common.job')} {'#'}
                {jobNumber}
              </Text>
            </View>
            <View style={styles.serviceTxtContainer}>
              <Text size={textSizes.h12} color={Colors.primaryColor}>
                {strings('add_new_task.Service')}
              </Text>
            </View>
          </View>
          <View style={{marginTop: normalize(5)}}>
            <Text
              align={'flex-start'}
              size={textSizes.h9}
              fontFamily={fontFamily.semiBold}>
              {jobTitle}
            </Text>
            <View style={{...styles.jobNumber, marginVertical: normalize(5)}}>
              <Dot color={recentJobStatusColor} />
              <Text
                style={{marginLeft: normalize(5)}}
                size={textSizes.h10}
                fontFamily={fontFamily.medium}>
                {recentJobStatus}{' '}
                <Text size={textSizes.h11}>
                  {' '}
                  -{recentJobCompletedDate} {recentJobCompletedTime}{' '}
                </Text>
              </Text>
            </View>
            <Text
              size={textSizes.h11}
              align={'flex-start'}
              fontFamily={fontFamily.light}>
              {recentJobsComment}
            </Text>
          </View>
          <View style={styles.notesContainer}>
            <View style={{flex: 1}}>
              <Text
                align={'flex-start'}
                size={textSizes.h11}
                color={Colors.primaryColor}>
                Service Notes ({serviceNotes})
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                align={'flex-start'}
                size={textSizes.h11}
                color={Colors.primaryColor}>
                Technician Remarks ({techRemark})
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.jobNumberContainer,
              paddingTop: normalize(10),
              padding: normalize(5),
              alignItems: 'center',
            }}>
            <Text fontFamily={fontFamily.semiBold}>{employeeName}</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={Images.blueCallIcon}
                style={{height: normalize(15), width: normalize(15)}}
              />
            </TouchableOpacity>
          </View>
        </ShadowBox>
      );
    }
    case 'equipment': {
      return (
        <ShadowBox
          containerStyles={{
            padding: normalize(6),
            paddingHorizontal: normalize(10),
            ...containerStyles,
          }}>
          <View style={styles.jobNumberContainer}>
            <Text size={textSizes.h12} fontFamily={fontFamily.light}>
              {strings('RecentJobs.Model')}
            </Text>
            <Text size={textSizes.h12} fontFamily={fontFamily.light}>
              {strings('PartsFilterModal.Brand')}
            </Text>
          </View>
          <View style={styles.jobNumberContainer}>
            <Text size={textSizes.h11}>{equipmentModel}</Text>
            <Text size={textSizes.h11}>{equipmentBrand}</Text>
          </View>
          <View
            style={{
              paddingVertical: normalize(10),
              borderBottomWidth: normalize(0.5),
              borderBottomColor: Colors.darkGray,
            }}>
            <Text
              align={'flex-start'}
              fontFamily={fontFamily.light}
              size={textSizes.h11}>
              {strings('Equipments.gps')}
            </Text>
            <Text
              align={'flex-start'}
              style={{marginTop: normalize(5)}}
              size={textSizes.h11}>
              {strings('common.tag')}
              {tagNumber}
            </Text>
          </View>
          <View
            style={{
              ...styles.jobNumberContainer,
              alignItems: 'center',
              paddingTop: normalize(10),
              paddingBottom: normalize(3),
            }}>
            <Text size={textSizes.h12}>
              {strings('common.serial')}
              {'#'} - {equipmentSerialNo}
            </Text>
            <Image
              source={Images.attachment}
              style={{height: normalize(14), width: normalize(14)}}
            />
          </View>
        </ShadowBox>
      );
    }
    default:
      break;
  }
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    padding: normalize(14),
    paddingTop: normalize(12),
  },
  headerStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyles: {
    marginRight: normalize(7),
  },
  imageStyles: {
    height: normalize(85),
    width: normalize(83),
    borderRadius: normalize(6),
    marginRight: normalize(10),
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalize(10),
    minHeight: normalize(70),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  timeOffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(10),
  },
  numContainer: {
    height: normalize(80),
    width: normalize(83),
    backgroundColor: Colors.lightYellow,
    borderRadius: normalize(10),
    marginRight: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  notificationContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.7,
    borderTopColor: Colors.darkGray,
    paddingVertical: normalize(10),
    marginRight: 20
  },
  notificationDetails: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: normalize(10),
  },
  notificationIcon: {
    padding: normalize(3),
    borderRadius: normalize(50),
    alignSelf: 'flex-start',
    margin: normalize(4),
  },
  taskContainer: {
    borderRadius: normalize(10),
    backgroundColor: 'tomato',
  },
  taskHeader: {
    backgroundColor: 'darkblue',
    padding: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTimerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  taskInfoContainer: {
    padding: normalize(8),
    backgroundColor: Colors.appGray,
  },
  taskOptainContainer: {
    flexDirection: 'row',
  },
  taskOptionIcon: {
    marginHorizontal: normalize(8),
    padding: normalize(2),
  },
  shadowContainer: {
    padding: normalize(6),
    borderLeftWidth: normalize(6),
  },
  jobNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTxtContainer: {
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(10),
    backgroundColor: Colors.extraLightBlue,
    borderRadius: normalize(3),
  },
  notesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.darkGray,
    paddingBottom: normalize(10),
    marginTop: normalize(8),
  },
  eventCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(5),
    paddingTop: normalize(5),
    borderTopWidth: 0.5,
    borderTopColor: Colors.darkGray,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
