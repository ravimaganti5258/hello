import React, {memo} from 'react';

import {ScrollView, StyleSheet, View} from 'react-native';

import {Colors} from '../../../assets/styles/colors/colors';
import {Icon} from '../../../components/Icon';
import {ModalContainer} from '../../../components/Modal';
import {Text} from '../../../components/Text';
import {useDimensions} from '../../../hooks/useDimensions';
import {
  dateFormat,
  fontFamily,
  normalize,
  textSizes,
} from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import {months, splitDateString} from '../../../util/helper';
import {FEATHER} from '../../../util/iconTypes';

const TextComponent = ({title, details}) => {
  return (
    <View>
      <Text
        align={'flex-start'}
        fontFamily={fontFamily.bold}
        size={textSizes.h12}>
        {title}
      </Text>
      <Text align={'flex-start'} size={normalize(13)}>
        {details}
      </Text>
    </View>
  );
};

const TimeOffDetails = ({visibility, handleVisibility, title, details}) => {
  const {height} = useDimensions();

  // const startTime = details != null ? splitDateString(details?.StartTime) : '';
  // const endTime = details != null ? splitDateString(details?.EndTime) : '';
  const startTime =  details != null ?details?.StartTime?.split(' ')[0].split('/') : '';
  const endTime =  details != null ? details?.EndTime?.split(' ')[0].split('/'): '';
  const appliedOn =
    details?.AppliedOn != null ? splitDateString(details?.AppliedOn) : '';
    let totalHours = '' ;
    if(details?.LeaveType == "Off Time"){
      let hours = details?.Hours != null && details?.Hours != 0? details?.Hours.split(' ')[0]:'';
       let minutes = details?.Hours != null && details?.Hours != 0?details?.Hours.split(' ')[2]:'';
       minutes == '0' || minutes == '' ? minutes = '' : minutes = '.'+ minutes;
      totalHours = hours+minutes;
    }
  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleVisibility}>
      <View style={[styles.container, {maxHeight: height / 1.75}]}>
        <View style={styles.titleContainer}>
          <Text size={textSizes.h10} fontFamily={fontFamily.bold}>
            {title}
          </Text>
          <Icon
            type={FEATHER}
            name={'x'}
            size={normalize(20)}
            onPress={handleVisibility}
          />
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          style={{marginTop: normalize(13)}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cardContainer}>
            <View
              style={[
                styles.numContainer,
                {
                  backgroundColor:
                    details?.Status == 'Pending Approval'
                      ? Colors.lightYellow2
                      : details?.Status == 'Rejected '
                      ? Colors.lightDangerRed
                      : Colors.lightSuccessGreen,
                },
              ]}>
              <Text
                fontFamily={fontFamily.bold}
                color={
                  details?.Status == 'Pending Approval'
                    ? Colors.lightYellow
                    : details?.Status == 'Rejected '
                    ? Colors.rejectedRed
                    : Colors.successGreen
                }
                size={normalize(24)}>
                {details?.Days > 0 ? details?.Days : totalHours}
              </Text>
              <Text
                color={
                  details?.Status == 'Pending Approval'
                    ? Colors.lightYellow
                    : details?.Status == 'Rejected '
                    ? Colors.rejectedRed
                    : Colors.successGreen
                }
                fontFamily={fontFamily.medium}
                size={textSizes.h11}>
                {details?.Days > 0
                  ? details?.Days == 1
                    ? 'Day'
                    : 'Day(s)'
                  : details?.Hours <= 1
                  ? details?.Hours == null 
                  ? '' : 'Hr'
                  : 'Hr(s)'}
              </Text>
            </View>
            <View>
              <Text
                align={'flex-start'}
                color={Colors.darkGray}
                size={textSizes.h12}
                fontFamily={fontFamily.semiBold}>
                {/* {details?.LeaveType ?? '-'} */}
                {details?.LeaveType == 'Off Time'? 'Hours' : details?.LeaveType }

              </Text>
              <Text
                align={'flex-start'}
                style={{marginVertical: normalize(7)}}
                fontFamily={fontFamily.bold}
                size={textSizes.h11}>
                 {/* {startTime != ''
                  ? `${startTime[2]} ${
                      months[startTime[1] - 1]
                    } ${startTime[0].slice(2, 4)} - `
                  : '-'}
                {endTime != ''
                  ? `${endTime[2]} ${months[endTime[1] - 1]} ${endTime[0].slice(
                      2,
                      4,
                    )}`
                  : '-'} */}
                {startTime != ''
                  ? `${startTime[1]} ${
                      months[startTime[0] - 1]
                    } ${startTime[2]} - `
                  : '-'}
                {endTime != ''
                  ? `${endTime[1]} ${months[endTime[0] - 1]} ${endTime[2]}`
                  : '-'}
              </Text>
              <Text
                align={'flex-start'}
                color={
                  details?.Status == 'Pending Approval'
                    ? Colors.lightYellow
                    : details?.Status == 'Rejected '
                    ? Colors.rejectedRed
                    : Colors.successGreen
                }
                fontFamily={fontFamily.semiBold}
                size={textSizes.h12}>
                {details?.Status}
              </Text>
            </View>
          </View>
          <View style={{marginVertical: normalize(15)}}>
            <TextComponent title={strings('apply_timeOff.reason')} details={details?.Reason} />
          </View>
          <View>
            <TextComponent
              title={strings('apply_timeOff.Applied_On')}
              details={
                // appliedOn != ''
                //   ? `${dateFormat(appliedOn,'ddmOyy')}`
                //   : '-'
                appliedOn != ''
                  ? `${appliedOn[2]} ${
                      months[appliedOn[1] - 1]
                    } ${appliedOn[0].slice(2, 4)}`
                  : '-'
              }
            />
          </View>
          {details?.Status == 'Rejected ' ? (
            <View style={styles.rejectDetailsContainer}>
              <View>
                <TextComponent
                  title={strings('apply_timeOff.Rejected_By')}
                  details={
                    details?.RejectedBy +
                    ' - ' +
                    dateFormat(details?.RejectedDate, 'ddmOyy')
                  }
                />
              </View>
              <View style={styles.remarkContainer}>
                <TextComponent
                  title={strings('apply_timeOff.Remarks')}
                  details={details?.RejectedRemarks}
                />
              </View>
            </View>
          ) : null}

          {details?.Status == 'Approved ' ? (
            <View style={styles.rejectDetailsContainer}>
              <View>
                <TextComponent
                  title={strings('apply_timeOff.Approved_By')}
                  details={
                    details?.ApprovedBy +
                    ' - ' +
                    dateFormat(details?.ApprovedOn, 'ddmOyy')
                    //   {`${startTime[2]} ${months[startTime[1] - 1]} ${
                    //     startTime[0].slice(2,4)
                    //   } - ${endTime[2]} ${months[startTime[1] - 1]} ${endTime[0].slice(2,4)}`}
                  }
                />
              </View>
              <View style={styles.remarkContainer}>
                <TextComponent
                  title={strings('apply_timeOff.Remarks')}
                  details={details?.ApprovedRemarks}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default memo(TimeOffDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: normalize(20),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(20),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
  },
  itemConatiner: {
    height: normalize(17),
    width: normalize(20),
    borderRadius: normalize(3),
    marginRight: normalize(10),
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
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectDetailsContainer: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(18),
    backgroundColor: Colors.appGray,
    marginTop: normalize(15),
    borderWidth: 0.1,
    borderColor: Colors.extraLightGrey,
    borderRadius: normalize(10),
  },
  remarkContainer: {
    marginTop: normalize(10),
  },
});
