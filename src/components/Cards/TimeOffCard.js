import React from 'react';

import {View} from 'react-native';

import {Colors} from '../../assets/styles/colors/colors';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import ShadowBox from '../ShadowBox';
import {Text} from '../Text';
import {cardStyles as styles} from './styles';

const TimeOffCard = ({
  leaveStatus,
  units,
  number,
  duration,
  leaveTitle,
  containerStyles,
  date,
}) => {
  return (
    <ShadowBox
      containerStyles={{...styles.timeOffContainer, ...containerStyles}}>
      <View
        style={[
          styles.numContainer,
          {
            backgroundColor:
              leaveStatus == 'Pending Approval'
                ? Colors.lightYellow2
                : leaveStatus == 'Rejected '
                ? Colors.lightDangerRed
                : Colors.lightSuccessGreen,
          },
        ]}>
        <Text
          fontFamily={fontFamily.bold}
          color={
            leaveStatus == 'Pending Approval'
              ? Colors.lightYellow
              : leaveStatus == 'Rejected '
              ? Colors.rejectedRed
              : Colors.successGreen
          }
          size={normalize(24)}>
          {number}
        </Text>
        <Text
          color={
            leaveStatus == 'Pending Approval'
              ? Colors.lightYellow
              : leaveStatus == 'Rejected '
              ? Colors.rejectedRed
              : Colors.successGreen
          }
          fontFamily={fontFamily.medium}
          size={textSizes.h11}>
          {number > 1 ? `${units}(s)` : units}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.dateContainer}>
          <Text
            fontFamily={fontFamily.bold}
            align={'flex-start'}
            size={textSizes.h11}
            style={{marginRight: normalize(7)}}>
            {date}
          </Text>
          {units == 'Hr' ? (
            <Text
              fontFamily={fontFamily.bold}
              align={'flex-start'}
              size={textSizes.h11}>
              {duration}
            </Text>
          ) : null}
        </View>
        <Text
          align={'flex-start'}
          size={textSizes.h12}
          color={Colors.secondryBlack}
          numberOfLines={1}
          style={{marginVertical: normalize(6)}}>
          {leaveTitle ?? '-'}
        </Text>
        <Text
          fontFamily={fontFamily.semiBold}
          align={'flex-start'}
          color={
            leaveStatus == 'Pending Approval'
              ? Colors.lightYellow
              : leaveStatus == 'Rejected '
              ? Colors.rejectedRed
              : Colors.successGreen
          }
          size={textSizes.h12}>
          {leaveStatus}
        </Text>
      </View>
    </ShadowBox>
  );
};

export default TimeOffCard;
