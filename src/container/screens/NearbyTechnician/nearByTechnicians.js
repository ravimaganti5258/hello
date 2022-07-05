import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Message, CallIcon2, Address} from '../../../assets/img';
import {fontFamily, normalize} from '../../../lib/globals';
import {Colors} from '../../../assets/styles/colors/colors.js';
import Header from '../../../components/header/index.js';
import SearchBar from '../../../components/SearchBar/index.js';
import {DataNotFound} from '../../../components/DataNotFound';
import {
  BlackMoreOptionIcon,
  CrossIcon,
  SearchIcon,
} from '../../../assets/img/index.js';
import api from '../../../lib/api/index.js';
import Loader from '../../../components/Loader/index.js';
import {useDispatch, useSelector} from 'react-redux';
import {strings} from '../../../lib/I18n/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import {getCurrentLocation} from '../../../util/helper';
import AddMoreModal from '../JobList/addMore';
import {useTranslation} from 'react-i18next';
import PhoneNumberModal from '../JobDetail/PhoneNumberModal';
import {SET_LOADER_TRUE} from '../../../redux/auth/types';
import {accessPermission} from '../../../database/MobilePrevi';

const NearByTechnician = ({navigation}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [loader, setLoader] = useState(true);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const [technicianList, setTechnicianList] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [search, setSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState([]);
  const [technicianListData, setTechnicianListData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [permission, setPermission] = useState({});

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const [showPhoneNoModal, setShowPhoneNoModal] = useState(false);
  const [phoneNumber, setphoneNumber] = useState(null);
  const [mobileNum, setMobileNum] = useState(null);

  useEffect(() => {
    userLocation();
  }, [longitude, latitude]);

  useEffect(() => {
    accessPermission('Near By Tech').then((res) => {
      setPermission(res);
    });
  }, []);

  const userLocation = async () => {
    await getCurrentLocation()
      .then((loc) => {
        setLatitude(loc[0]);
        setLongitude(loc[1]);

        fetchNearByTechnician();
        setTimeout(() => {
          setLoader(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          setLoader(false);
        }, 500);
      });
  };

  /* fetchNearByTechnicianlist details */

  const fetchNearByTechnician = () => {
    try {
      dispatch({type: SET_LOADER_TRUE});
      const data = [1];
      const handleCallback = {
        success: (data) => {
          setTechnicianListData(data);
          setTechnicianList(data);
          setFlag(true);
          setTimeout(() => {
            setLoader(false);
          }, 500);
        },
        error: (error) => {
          setTimeout(() => {
            setLoader(false);
          }, 500);
        },
      };
      var endPoint = `?CompanyId=${userInfo?.CompanyId}&SearchText=${search}&UserLatitude=${latitude}&UserLongitude=${longitude}&TechId=${userInfo?.sub}&LoginId=${userInfo?.sub}`;

      if (latitude != null && longitude != null) {
        api.getNearbyTechnician(
          '',
          handleCallback,
          {
            Authorization: `Bearer ${token}`,
          },
          endPoint,
        );
      }
    } catch (er) {
      console.log(er);
      setTimeout(() => {
        setLoader(false);
      }, 500);
    }
  };

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
  };

  const handleCancelSearch = () => {
    try {
      setTechnicianListData(technicianList);
      toggleSearchIcon();
    } catch (error) {}
  };

  const headerRightIcons = [
    {
      name: !showSearch ? SearchIcon : CrossIcon,
      onPress: handleCancelSearch,
    },
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  const renderItem = ({item}) => {
    let travelTime = item?.TravelTime;

    if (Platform.OS === 'ios' && item?.TravelTime)
      travelTime = item?.TravelTime?.replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll(':', '  ');
    return (
      <>
        <View style={styles.itemView}>
          <View style={styles.view1}>
            <Text style={styles.nameText}>{item?.DisplayName}</Text>
            <Text style={styles.distanceText}>{`${item?.Distance} Miles`}</Text>
            <View style={styles.view4}>
              <Address width={normalize(17)} height={normalize(17)} />
              <Text style={styles.timeText}>{travelTime}</Text>
            </View>
          </View>
          <View style={styles.view2}>
            <TouchableOpacity>
              <Message width={normalize(23)} height={normalize(21)} />
            </TouchableOpacity>
          </View>

          <View style={styles.view3}>
            <TouchableOpacity onPress={() => togglePhoneModal(item)}>
              {item?.Phone || item?.Mobile ? (
                <CallIcon2 width={normalize(21)} height={normalize(21)} />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line}></View>
      </>
    );
  };
  /* search filter  */
  const searchAction = () => {
    if (searchQuery.length != 0) {
      const filteredData = technicianList.filter(function (item) {
        const itemData = item?.DisplayName?.toLowerCase();
        const textData = searchQuery.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setTechnicianListData(filteredData);
    } else {
      setTechnicianListData(technicianList);
    }
  };

  const togglePhoneModal = (item) => {
    setphoneNumber(item?.Phone);
    setMobileNum(item?.Mobile);
    setShowPhoneNoModal(!showPhoneNoModal);
  };
  return (
    <SafeAreaView style={styles.mainView}>
      <Loader visibility={loader} />
      <View>
        <Header
          title={strings('side_menu.nearByTechnician')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          HeaderRightIcon={headerRightIcons}
        />
        {showSearch ? (
          <SearchBar
            searchAction={searchAction}
            onChangeText={(data) => setSearchQuery(data)}
            onEndEditing={searchAction}
          />
        ) : null}
        {showAddMore ? (
          <AddMoreModal
            handleModalVisibility={toggleAddMore}
            visibility={showAddMore}
          />
        ) : null}
      </View>
      {technicianListData.length > 0 &&
      technicianListData != '' &&
      permission?.View ? (
        <FlatList
          style={styles.subView}
          data={technicianListData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        flag && <DataNotFound />
      )}
      {showPhoneNoModal ? (
        <PhoneNumberModal
          visibility={showPhoneNoModal}
          handleModalVisibility={togglePhoneModal}
          mobileNo={mobileNum}
          workPhoneNo={phoneNumber}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  subView: {
    marginHorizontal: 15,
  },
  itemView: {
    height: 100,
    flexDirection: 'row',
  },
  line: {
    backgroundColor: 'grey',
    height: 1,
  },
  view1: {
    flex: 0.6,
    margin: 10,
    justifyContent: 'space-evenly',
  },
  view2: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view3: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view4: {
    flexDirection: 'row',
  },
  nameText: {
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    color: Colors.secondryBlack,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
    color: Colors.secondryBlack,
    paddingLeft: 10,
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  errWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  errText: {
    textAlign: 'center',
  },
  distanceText: {
    alignSelf: 'flex-start',
    fontSize: normalize(13),
    fontFamily: fontFamily.regular,
  },
});

export default MainHoc(NearByTechnician);
