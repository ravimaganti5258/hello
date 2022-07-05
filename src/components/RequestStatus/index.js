import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../assets/styles/colors/colors';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {strings} from '../../lib/I18n';
import {getDate, getMonth, getDay} from '../../util/helper';
import {Text} from '../Text';

export default ({
  type = 'jobs',
  containerStyles,
  txtAlign = 'flex-start',
  title = 'Total',
  number = 18,
  numberColor = Colors.brightBlue,
  subTitle = 'Jobs',
  txtColor = Colors.brightBlue,
}) => {
  switch (type) {
    case 'jobs': {
      return (
        <View style={[styles.jobsContainer, containerStyles]}>
          <View>
            <Text
              size={textSizes.h10}
              align={txtAlign}
              fontFamily={fontFamily.bold}
              numberOfLines={1}>
              {title}
            </Text>
            <Text
              size={textSizes.h10}
              align={txtAlign}
              color={Colors.secondryBlack}
              fontFamily={fontFamily.regular}>
              {subTitle}
            </Text>
          </View>
          <Text
            size={normalize(50)}
            fontFamily={fontFamily.regular}
            align={'flex-start'}
            color={numberColor}>
            {number}
          </Text>
        </View>
      );
    }
    case 'parts': {
      return (
        <View style={[styles.partsContainer, containerStyles]}>
          <Text size={normalize(24)} align={txtAlign} color={txtColor}>
            {number}
          </Text>
          <Text
            size={textSizes.h11}
            fontFamily={fontFamily.bold}
            align={txtAlign}
            color={txtColor}
            style={{marginTop: normalize(5)}}>
            {title}
          </Text>
        </View>
      );
    }
    case 'current job': {
      return (
        <View style={[styles.currentJobsContainer]}>
          <Text
            size={normalize(60)}
            align={txtAlign}
            fontFamily={fontFamily.bold}
            color={txtColor}>
            {number}
          </Text>
          <Text size={textSizes.h10} align={txtAlign} color={txtColor}>
            {strings('common.today_job')}
          </Text>
          <Text size={textSizes.h11} align={txtAlign} color={txtColor}>
            {`${getDate()} ${getMonth()}, ${getDay()}`}
          </Text>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  jobsContainer: {
    backgroundColor: Colors.white,
    width: normalize(116),
    borderRadius: normalize(18),
    padding: normalize(13),
    paddingBottom: normalize(7),
    justifyContent: 'space-between',
  },
  partsContainer: {
    flex: 1,
    borderRadius: normalize(8),
    padding: normalize(5),
    paddingLeft: normalize(12),
    paddingTop: normalize(2),
    paddingBottom: normalize(10),
  },
  currentJobsContainer: {
    padding: normalize(7),
  },
});
