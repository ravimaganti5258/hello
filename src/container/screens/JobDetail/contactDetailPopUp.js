import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {
  CrossIcon,
  MailIcon,
  SalesIcon,
  PhoneCallIcon,
  MobileCallIcon,
  userIcon1,
  AddressIcon,
} from '../../../assets/img/index.js';
import MapViewContainer from '../../../components/MapView';
import {
  fontFamily,
  normalize,
} from '../../../lib/globals.js';
import { Colors } from '../../../assets/styles/colors/colors';
import { Text } from '../../../components/Text/index';
import CommonModal from '../../../components/CommonModal/index';
import { mapViewJobList } from '../../../assets/jsonData';
import MarkerView from '../../../components/MarkerView';
import { strings } from '../../../lib/I18n/index.js';
import { useColors } from '../../../hooks/useColors.js';

const contactDeatilPopUp = ({
  visibility,
  navigation,
  handleModalVisibility,
  data,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [coordinates, setCoordinates] = useState(
    mapViewJobList[0]?.coordinates,
  );

  const { colors } = useColors();

  //function to show values on contact detail modal
  const infoFilled = (IconName, value, label) => {
    return (
      <View key={value} style={styles.bodySectionWrap}>
        <View style={styles.bodyIconStyles}>
          <IconName width={normalize(15)} height={normalize(15)} />
        </View>
        <Text
          color={
            IconName == MobileCallIcon || IconName == PhoneCallIcon
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : Colors.secondryBlack
          }
          style={styles.value}
          fontFamily={label == 'name' ? fontFamily.bold : fontFamily.regular}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <CommonModal
        handleModalVisibility={handleModalVisibility}
        visibility={visibility}
        modalContainerStyles={styles.modal}
        headerSection={() => {
          return (
            <View style={styles.modalHeaderStyle}>
              <Text fontFamily={fontFamily.bold} size={normalize(16)}>
                {strings('contact_detail.header_title')}
              </Text>

              <View style={styles.row}>
                {data.isAccept == 1 && data.submittedSource != 2 && (
                  <>
                    <TouchableOpacity
                      style={styles.EditStyle}
                      onPress={() => {
                        navigation.navigate('EditContactDetail', {
                          contactDetail: data,
                        });
                        handleModalVisibility()
                      }}>
                      <Text
                        color={colors?.PRIMARY_BACKGROUND_COLOR}
                        fontFamily={fontFamily.semiBold}>
                        {strings('contact_detail.Edit')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={{ alignSelf: 'center' }}
                  onPress={handleModalVisibility}>
                  <CrossIcon width={normalize(12)} height={normalize(12)} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        bodySection={() => {
          setTitle(
            `${data?.TitleId}` == 47
              ? 'Mr.'
              : `${data?.TitleId}` == 48
                ? 'Mrs.'
                : `${data?.TitleId}` == 49
                  ? 'Ms.'
                  : `${data?.TitleId}` == 50
                    ? 'Mdm.'
                    : `${data?.TitleId}` == 51
                      ? 'Sir'
                      : `${data?.TitleId}` == 52
                        ? 'Dr.'
                        : '',
          );
          setName(`${title ? title : ''} ${data?.FirstName != null ? data?.FirstName : ''} ${data?.LastName != null ? data?.LastName : ''}`);
          return (
            <View style={styles.vertical}>
              {infoFilled(userIcon1, name, 'name')}
              {infoFilled(SalesIcon, data.CustomerType)}
              {infoFilled(PhoneCallIcon, data.Phone1)}
              {infoFilled(MobileCallIcon, data.Phone2)}
              {infoFilled(MailIcon, data.Email)}
              {infoFilled(AddressIcon, data.AcctualAddress)}

              <View style={styles.mapcont}>
                <View style={{ height: normalize(173) }}>
                  <MapViewContainer
                    centerCoordinate={coordinates}
                    zoomLevel={15}
                    scrollEnabled={false}
                    zoomEnabled={false}>
                    <MarkerView
                      coordinate={coordinates}
                      markerColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    />
                  </MapViewContainer>
                </View>

                <TouchableOpacity
                  style={styles.map}
                  onPress={() => {
                    Linking.openURL(
                      Platform.OS === 'ios'
                        ? `maps://app?daddr=${data.AcctualAddress}`
                        : `google.navigation:q=${data.AcctualAddress}`,
                    );
                  }}>
                  <Text
                    color={colors?.PRIMARY_BACKGROUND_COLOR}
                    align={'flex-start'}>
                    {strings('contact_detail.get_Directions')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        footerSection={() => { }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  EditStyle: {
    paddingHorizontal: normalize(15),
    alignSelf: 'center',
  },
  bodySectionWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
  },
  bodyIconStyles: {
    backgroundColor: Colors.iconBackgroundGrey,
    borderRadius: normalize(20),
    padding: normalize(10),
  },
  value: {
    alignSelf: 'center',
    textAlign: 'left',
    paddingHorizontal: normalize(10),
    flex: 1,
  },
  modal: {
    top: Platform.OS === 'ios' ? normalize(30) : normalize(30),
  },
  map: {
    paddingTop: normalize(10)
  },
  mapcont: {
    paddingLeft: normalize(40)
  },
  vertical: {
    paddingVertical: normalize(15)
  },
  row: {
    flexDirection: 'row'
  },
});

export default contactDeatilPopUp;
