import React from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import {
  EventClockIcon,
  EventGroupIcon,
  EventJobBagIcon,
  GroupMarker,
} from '../../assets/img';
import { fontFamily, normalize, textSizes, dateFormat } from '../../lib/globals';
import { strings } from '../../lib/I18n';
import Dot from '../Dot';
import ShadowBox from '../ShadowBox';
import { Text } from '../Text';
import { cardStyles as styles } from './styles';

const clockIconSize = normalize(13);
const groupIconWidth = normalize(16);

const bagIconSize = normalize(12);

const getStatusColor = (status) => {
  switch (status) {
    case 'Awaiting Schedule':
      return '#c50d0d';
    case 'Scheduled':
      return '#003366';
    case 'En Route':
      return '#4C9ED9';
    case 'On Site':
      return '#FFA900';
    case 'Completed':
      return '#00AF50';
    case 'Unresolved':
      return '#D53F3F';
    case 'Cancelled':
      return '#6D6D6D';
    case 'Tentative':
      return '#0C5CF3';
    case 'In Progress':
      return '#FFA500';
    case 'On Hold':
      return '#24B1B1';
    case 'Submitted':
      return '#19CDD4';
    case 'Approval Rejected':
      return '#FE0000';

    default:
      return '#24B1B1';
  }
};

const splitDateTimeString = (string) => {
  return string.split(' ');
};

const EventCards = ({
  type,
  containerStyles,
  technicianName,
  jobTitle,
  eventStatus,
  jobNumber,
  eventJobTime,
  eventDate,
  address,
  callStatus,
  CrewJob,
  themeColor='#17338d'
}) => {
  const borderColor = eventStatus != null ? getStatusColor(eventStatus) : null;
  const dateString = eventDate != null ? splitDateTimeString(eventDate) : null;
  const newDate = dateString != null ? dateString[0] : null;
  // const eventFormattedDate = dateFormat(newDate , 'DD/MM/YYYY');
  const eventFormattedDate = dateFormat(eventDate, 'MM/DD/YYYY  HH:MM:MS 12TF');
  const time = dateString != null ? dateString[1].split(':') : null;
  const timeString = `${time[0]}:${time[1]} ${dateString[2]}`;

  const mapDirection = (address) => {
    try {
      const url = Platform.select({
        ios: `maps:0,0?q=${address}`,
        android: `geo:0,0?q=${address}`,
      });
      Linking.openURL(url);
      // Linking.openURL(
      //   Platform.OS === 'ios'
      //     ? 'maps://app?saddr=38.8976763+-77.0387185&daddr=38.9076763+-78.0387185'
      //     : 'google.navigation:q=19.0760+72.8777',
      // );
    } catch (e) { }
  };

  const EventCardHeader = () => {
    return (
      <View style={styles.jobNumberContainer}>
        <View style={styles.jobNumber}>
          <EventJobBagIcon height={bagIconSize} width={bagIconSize} />
          <Text size={textSizes.h12} style={{ marginLeft: normalize(5) }}>
            {strings('common.job')} {jobNumber}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text size={textSizes.h12}>{eventFormattedDate}</Text>
          {/* <Text size={textSizes.h12} style={{marginLeft: normalize(5)}}>
            {timeString}
          </Text> */}
        </View>
      </View>
    );
  };

  const EventCardFooter = () => {
    return (
      <View style={styles.eventCardFooter}>
        <View style={styles.rowCenter}>
          {eventJobTime != '' &&
          <EventClockIcon height={clockIconSize} width={clockIconSize} />
          }
          <Text
            style={{ marginLeft: normalize(8) }}
            size={normalize(13)}
            fontFamily={fontFamily.semiBold}>
            {eventJobTime}
          </Text>
          {CrewJob == 'Yes' ?
            <EventGroupIcon height={clockIconSize} width={groupIconWidth} marginLeft={normalize(20)} />
            : null}
        </View>
        <View style={styles.rowCenter}>
          <Dot color={borderColor} />
          <Text
            style={{ marginLeft: normalize(5) }}
            size={normalize(13)}
            fontFamily={fontFamily.semiBold}>
            {eventStatus}
          </Text>
        </View>
      </View>
    );
  };

  switch (type) {
    case 'calenderEvent': {
      return (
        <ShadowBox
          containerStyles={{
            ...styles.shadowContainer,
            borderLeftColor: borderColor,
            ...containerStyles,
          }}>
          <EventCardHeader />

          <Text
            align={'flex-start'}
            size={textSizes.h10}
            fontFamily={fontFamily.regular}
            style={{ marginVertical: normalize(5) }}>
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
            <View style={{ flex: 0.85 }}>
              <Text align={'flex-start'} size={textSizes.h10}>
                {technicianName}
                {callStatus}
              </Text>
              <Text
                align={'flex-start'}
                fontFamily={fontFamily.regular}
                numberOfLines={1}
                size={textSizes.h12}>
                {address.length > 31 ? address.slice(0, 32) + '...' : address}
              </Text>
            </View>
            <TouchableOpacity
              style={{ flex: 0.15 }}
              onPress={() => mapDirection(address)}>
              <GroupMarker height={normalize(21)} width={normalize(25)} color={themeColor}/>
            </TouchableOpacity>
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
            borderLeftColor: borderColor,
            width: Dimensions.get('window').width - normalize(12),
            ...containerStyles,
          }}>
          <EventCardHeader />
          <View>
            <Text
              align={'flex-start'}
              size={textSizes.h11}
              fontFamily={fontFamily.semiBold}
              style={{ marginTop: normalize(10), marginBottom: normalize(5) }}>
              {jobTitle}
            </Text>
            <Text
              align={'flex-start'}
              size={normalize(13)}
              fontFamily={fontFamily.semiBold}
              style={{ paddingBottom: normalize(10) }}>
              {technicianName}
            </Text>
          </View>
          <EventCardFooter />
        </ShadowBox>
      );
    }
  }
};

export default EventCards;