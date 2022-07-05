import {useNavigation} from '@react-navigation/core';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  BlackMoreOptionIcon,
  ChatIconGrey,
  PhoneCallIcon2,
  UserIcon,
} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors';
import HeaderComponent from '../../../components/header';
import MainHoc from '../../../components/Hoc/index.js';
import {Text} from '../../../components/Text';
import api from '../../../lib/api/index.js';
import {fontFamily, normalize} from '../../../lib/globals';
import AddMoreModal from '../JobList/addMore';
import {Header} from '../../../lib/buildHeader';
import Loader from '../../../components/Loader/index.js';
import {strings} from '../../../lib/I18n/index.js';
import {FlashMessageComponent} from '../../../components/FlashMessge/index.js';
import PhoneNumberModal from '../JobDetail/PhoneNumberModal.js';

const CrewMemebers = ({route}) => {
  const navigation = useNavigation();
  const [showAddMore, setShowAddMore] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [crewList, setCrewList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [emptyMsg, setemptyMsg] = useState(false);
  const {JobId} = route?.params;
  const [showPhoneModal, setShowPhoneModal] = useState({
    visible: false,
    phone1: 12344,
    phone2: 23445,
  });
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  useEffect(() => {
    fetchCrewMembers();
  }, []);

  /*  fetch crew member list  */
  const fetchCrewMembers = () => {
    const handleCallback = {
      success: (data) => {
        setCrewList(data);
        setLoader(false);
        setemptyMsg(true);
      },
      error: (error) => {
        setLoader(false);
        FlashMessageComponent(
          'reject',
          error?.error_description
            ? error?.error_description
            : strings('rejectMsg.went_wrong'),
        );
        sageComponent('reject', error?.error_description);
      },
    };
    let headers = Header(token);
    let endpoint = `?CompanyId=${userInfo.CompanyId}&TechId=${userInfo.sub}&JobId=${JobId}`;
    api.getCrewMembers('', handleCallback, headers, endpoint);
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];

  const toggalPhoneNoMaodal = (obj) => {
    setShowPhoneModal({
      visible: !showPhoneModal.visible,
      phone1: obj.Phone1,
      phone2: obj.Phone2,
    });
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItemContainer}>
        <View style={styles.flexWRow}>
          <Text fontFamily={fontFamily.light} size={normalize(18)}>
            {item.DisplayName}
          </Text>
          {item.IsLeader == 1 && (
            <UserIcon
              style={styles.userIconStyle}
              height={normalize(13)}
              width={normalize(12)}
            />
          )}
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <ChatIconGrey height={normalize(22)} width={normalize(21)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggalPhoneNoMaodal(item)}>
            <PhoneCallIcon2 height={normalize(21)} width={normalize(20)} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSeprator = () => {
    return <View style={styles.itemSeperator} />;
  };

  const renderCount = () => {
    return crewList.length > 0 ? `(${crewList.length})` : '';
  };
  return (
    <SafeAreaView style={styles.container}>
      <Loader visibility={loader} />
      <HeaderComponent
        title={strings(`crew_memebers.header_title`) + renderCount()}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        HeaderRightIcon={headerRightIcons}
      />
      <View style={styles.flatListContainer}>
        {crewList.length > 0 ? (
          <FlatList
            data={crewList}
            renderItem={renderItem}
            keyExtractor={(item, index) => `ID-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeprator}
          />
        ) : (
          <View style={styles.errWrap}>
            {emptyMsg && (
              <Text size={normalize(18)}>
                {' '}
                {strings(`status_update.empty_err_msg`)}
              </Text>
            )}
          </View>
        )}
      </View>
      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
          title={''}
        />
      ) : null}

      {showPhoneModal.visible ? (
        <PhoneNumberModal
          visibility={showPhoneModal.visible}
          handleModalVisibility={() => toggalPhoneNoMaodal(showPhoneModal)}
          workPhoneNo={showPhoneModal.phone1}
          mobileNo={showPhoneModal.phone2}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    backgroundColor: Colors.extraLightGrey,
  },
  renderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 0.35,
    justifyContent: 'space-between',
    marginRight: normalize(10),
  },
  buttonStyles: {
    padding: normalize(5),
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
  },
  errWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  itemSeperator: {
    height: '2%',
    backgroundColor: Colors.darkGray,
  },
  flexWRow: {
    flex: 1,
    flexDirection: 'row',
  },
  userIconStyle: {
    alignSelf: 'center',
    marginHorizontal: normalize(10),
  },
});
export default MainHoc(CrewMemebers);
