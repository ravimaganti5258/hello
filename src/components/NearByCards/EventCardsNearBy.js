import React from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { strings } from '../../lib/I18n';
import {EventClockIcon, GroupMarker} from '../../assets/img';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import Dot from '../Dot';
import ShadowBox from '../ShadowBox';
import {Text} from '../Text';
import {cardStyles as styles} from '../../components/Cards/styles';
import {Colors} from '../../assets/styles/colors/colors';
import {useColors} from '../../hooks/useColors';
import { useDimensions } from '../../hooks/useDimensions';
import { FlashMessageComponent } from '../FlashMessge';

const clockIconSize = normalize(13);

const splitDateTimeString = (string) => {
  return string.split(' ');
};

const EventCardsNearBy = ({
  type,
  containerStyles,
  // eventDate,
  callStatus,
  part,
  Model,
  Distance,
  DisplayName,
  Phone,
  TravelTime,
  Available
}) => {
  // const dateString = eventDate != null ? splitDateTimeString(eventDate) : null;
  // const eventFormattedDate = dateString != null ? dateString[0] : null;
  // const time = dateString != null ? dateString[1].split(':') : null;
  // const timeString = `${time[0]}:${time[1]} ${dateString[2]}`;
  const {width} = useDimensions();
  const {colors} = useColors();
  const EventCardHeader = () => {
    return (
      <View>
        <View style={stylesForEventCard.textTitleEventCardHeader}>
          <Text
            style={stylesForEventCard.textTitleEventCardHeader}
            // size={textSizes.h10}
            align={'flex-start'}>
            {strings('NearByMap.part')} {`${part !== 'null' ? part : ''}`}
          </Text>
          <Text
            style={stylesForEventCard.textEventCardHeader}
            size={textSizes.h11}
            align={'flex-start'}>
            {Model}
          </Text>
          <Text
            style={stylesForEventCard.textEventCardHeader}
            size={textSizes.h11}
            align={'flex-start'}>
            {strings('NearByMap.Available')} {Available}
          </Text>
        </View>
      </View>
    );
  };
  const EventCardFooter = () => {
    return (
      <View style={stylesForEventCard.eventCardFooter}>
        <View style={stylesForEventCard.containerEventCardFooter}>
          <GroupMarker
            height={normalize(14)}
            width={normalize(17)}
            color={colors.PRIMARY_BACKGROUND_COLOR}
          />
          <Text
            style={stylesForEventCard.textEventCardFooter}
            size={normalize(13)}>
            {`${Distance} miles`}
          </Text>
        </View>
        <View style={styles.rowCenter}>
          <EventClockIcon height={clockIconSize} width={clockIconSize} />
          <Text
            style={stylesForEventCard.textEventCardFooter}
            size={normalize(13)}>
            {TravelTime}
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
            borderLeftColor: colors.PRIMARY_BACKGROUND_COLOR,
            ...containerStyles,
          }}>
          <EventCardHeader />

          <View style={stylesForEventCard.containerCalender}>
            <View style={{flex: 0.85}}>
              <Text align={'flex-start'} size={textSizes.h10}>
                {DisplayName}
              </Text>

              <Text align={'flex-start'} size={textSizes.h10}>
                {callStatus}
              </Text>
            </View>
            <View style={{flex: 0.15}}>
              <GroupMarker
                height={normalize(21)}
                width={normalize(25)}
                color={colors.PRIMARY_BACKGROUND_COLOR}
              />
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
            borderLeftColor: colors.PRIMARY_BACKGROUND_COLOR,
            ...containerStyles,
          }}>
          <EventCardHeader />
          <View style={stylesForEventCard.mapViewcard}>
            <Text
              size={textSizes.h11}
              fontFamily={fontFamily.bold}
              style={stylesForEventCard.textTechName}>
              {DisplayName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS == 'ios') {
                  Linking.canOpenURL(`telprompt:${Phone}`).then((supported) => {
                    if (supported) {
                      return Linking.openURL(`telprompt:${Phone}`).catch(
                        () => null,
                      );
                    } else {
                      FlashMessageComponent(
                        'warning',
                        strings('flashmessage.Dialer_is_not_supported'),
                      );
                    }
                  });
                } else {
                  Linking.openURL(`tel:${Phone}`);
                }
              }}>
              <Text
                size={textSizes.h11}
                fontFamily={fontFamily.bold}
                style={[
                  stylesForEventCard.textCall,
                  {color: colors.PRIMARY_BACKGROUND_COLOR},
                ]}>
                {callStatus}
              </Text>
            </TouchableOpacity>
          </View>
          <EventCardFooter />
        </ShadowBox>
      );
    }
  }
};

const stylesForEventCard = StyleSheet.create({
  //EventCardHeader
  containerEventCardHeader: {
    flexDirection: 'column',
    margin: 5,
  },
  textEventCardHeader: {
    marginLeft: normalize(5),
    margin: 3,
  },
  textTitleEventCardHeader: {
    marginLeft: normalize(5),
    paddingTop: 5,
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(14),
  },
  textTechName: {
    marginTop: normalize(5),
    marginBottom: normalize(5),
    paddingLeft: 10,
  },
  textCall: {
    marginTop: normalize(5),
    marginBottom: normalize(5),
    // color: colors.PRIMARY_BACKGROUND_COLOR,
    paddingLeft: normalize(10),
    paddingRight:normalize(10)
  },
  //EventCardFooter
  eventCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(5),
    paddingTop: normalize(5),
    // borderTopWidth: 0.5,
    // borderTopColor: Colors.darkGray,
  },
  containerEventCardFooter: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textEventCardFooter: {
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: fontFamily.regular,
  },
  //CalenderEvent
  containerCalender: {
    marginTop: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingBottom: normalize(10),
  },
  mapViewcard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(5),
    borderTopWidth: 0.5,
    borderTopColor: Colors.darkGray,
  },
});
export default EventCardsNearBy;
