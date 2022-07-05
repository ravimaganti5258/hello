import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import {
  BlueSmallArrowRight,
  CrossIcon,
  SearchIcon,
} from '../../../assets/img/index';
import {Colors} from '../../../assets/styles/colors/colors.js';
import {useColors} from '../../../hooks/useColors';
import HeaderComponent from '../../../components/header';
import MainHoc from '../../../components/Hoc';
import SearchBar from '../../../components/SearchBar';
import {Text} from '../../../components/Text';
import {fontFamily, normalize, normalizeHeight} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import api from '../../../lib/api';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../../lib/buildHeader';
import {DataNotFound} from '../../../components/DataNotFound';
import NetInfo from '@react-native-community/netinfo';

const MyPartInventory = ({navigation}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [flag, setFlag] = useState(false);
  const {colors} = useColors();
  const [searchQuery, setSearchQuery] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [userData, setUserData] = useState([]);

  /*  data get from redux */
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    getPartInventoryapi();
  }, []);

  /* get PartInventory  data */
  const getPartInventoryapi = () => {
    try {
      dispatch({type: SET_LOADER_TRUE});

      const handleCallback = {
        success: (data) => {
          setUserData(data);
          setUserDataList(data);
          setFlag(true);
          dispatch({type: SET_LOADER_FALSE});
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&TechId=${userInfo?.sub}`;
      api.getPartInventory('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
  };

  const handleCancelSearch = () => {
    try {
      setUserData(userDataList);
      toggleSearchIcon();
    } catch (error) {}
  };

  /* search filter */

  const searchAction = () => {
    if (searchQuery.length != 0) {
      const filteredData = userDataList.filter(function (item) {
        const itemData = item?.Model.toString().toLowerCase();
        const partData = item?.PartNo.toString().toLowerCase();
        const descriptionData = item?.Description.toString().toLowerCase();
        const textData = searchQuery.toString().toLowerCase().trim();
        return (
          itemData.includes(textData) ||
          partData.includes(textData) ||
          descriptionData.includes(textData)
        );
      });
      setUserData(filteredData);
    } else {
      setUserData(userDataList);
    }
  };

  const headerRightIcons = [
    {
      name: !showSearch ? SearchIcon : CrossIcon,
      onPress: handleCancelSearch,
    },
  ];

  /* for render (Allocated and Requested part) */
  const Renderview = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PartDetails', item);
        }}>
        <View style={styles.mainContainer}>
          <View style={styles.subContainer}>
            <Text align="flex-start" numberOfLines={1} style={[styles.nameTxt]}>
              {item?.Description ? item.Description : ' -'}
            </Text>

            <Text align="flex-start" style={[styles.typeTxt]}>
              {item?.Model ? item.Model : ' -'}
            </Text>
            <Text align="flex-start" style={[styles.hexcodeTxt]}>
              {item?.PartNo}
            </Text>
          </View>

          <View style={styles.countView}>
            <Text
              style={[
                styles.countText,
                {color: colors?.PRIMARY_BACKGROUND_COLOR},
              ]}>
              {item?.OnHandQty}
            </Text>
          </View>

          <BlueSmallArrowRight
            width={normalize(6)}
            height={normalize(12)}
            position={'absolute'}
            right={normalize(20)}
            style={{
              transform: I18nManager.isRTL
                ? [{rotate: '180deg'}]
                : [{rotate: '0deg'}],
            }}
            stroke={colors?.PRIMARY_BACKGROUND_COLOR}
          />
        </View>
        <View style={styles.thinLine} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View>
        <HeaderComponent
          title={strings(`MYPARTINVENTORY.TITLE`)}
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
      </View>

      {userData.length > 0 ? (
        <FlatList
          renderItem={Renderview}
          data={userData}
          keyExtractor={(item, index) => `ID-${index}`}
        />
      ) : (
        flag && <DataNotFound />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    marginVertical: normalize(10),
    paddingVertical: normalize(20),
    marginLeft: normalize(20),
    marginRight: normalize(20),
    backgroundColor: Colors.white,
  },
  countView: {
    position: 'absolute',
    right: normalize(50),
  },
  nameTxt: {
    fontSize: normalize(17),
    fontFamily: fontFamily.semiBold,
    color: Colors.secondryBlack,
    width: normalize(265),
    textAlign: 'left',
  },
  typeTxt: {
    fontSize: normalize(17),
    fontFamily: fontFamily.light,
    color: Colors.secondryBlack,
  },
  hexcodeTxt: {
    fontSize: normalize(17),
    fontFamily: fontFamily.light,
    color: Colors.secondryBlack,
  },
  thinLine: {
    height: normalize(1),
    borderWidth: normalize(1),
    borderColor: Colors?.lightSilver,
    marginRight: normalize(20),
    marginLeft: normalize(20),
  },
  countText: {
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    color: Colors.Borderblue,
  },
  imageNodata: {
    marginTop: normalize(180),
    paddingTop: normalize(50),
    height: normalizeHeight(200),
    width: normalize(250),
  },
  awaitingText: {
    fontSize: normalize(18),
    color: Colors.greyBtnBorder,
  },
});
export default MainHoc(MyPartInventory);
