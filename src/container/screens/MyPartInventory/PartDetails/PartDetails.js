import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Colors} from '../../../../assets/styles/colors/colors';
import HeaderComponent from '../../../../components/header';
import MainHoc from '../../../../components/Hoc';
import {Text} from '../../../../components/Text';
import {fontFamily, normalize, normalizeHeight} from '../../../../lib/globals';
import {strings} from '../../../../lib/I18n';
import api from '../../../../lib/api';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../../redux/auth/types';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../../../lib/buildHeader';
import {DataNotFound} from '../../../../components/DataNotFound';
import {createIconSetFromFontello} from 'react-native-vector-icons';

const PartDetails = ({navigation, route}) => {
  const {PartId, WarehouseId} = route.params;

  /*  data getting from redux */
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);

  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getPartInventoryDetailapi();
  }, []);

  /* PartInventoryDetail getting  */
  const getPartInventoryDetailapi = () => {
    try {
      dispatch({type: SET_LOADER_TRUE});
      const handleCallback = {
        success: (data) => {
          setUserData(data);
          dispatch({type: SET_LOADER_FALSE});
        },
        error: (error) => {
          setFlag(true);
          dispatch({type: SET_LOADER_FALSE});
        },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&PartId=${PartId}&WarehouseId=${WarehouseId}`;
      api.getPartInventoryDetail('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.subViews}>
        <Text
          align="flex-start"
          style={[
            styles.nameTxt,
            {fontFamily: fontFamily.regular},
            {marginLeft: normalize(10)},
            {fontSize: normalize(13)},
          ]}>
          {item?.SerialNo}
        </Text>
        <Text
          align="flex-start"
          style={[
            styles.nameTxt,
            {fontFamily: fontFamily.regular},
            {marginRight: normalize(55)},
            {fontSize: normalize(13)},
          ]}>
          {item?.ExpiryDate ? item.ExpiryDate : '-'}
        </Text>
      </View>
    );
  };
  return (
    <>
      <HeaderComponent
        title={strings(`PARTDETAILS.TITLE`)}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
      />
      {flag === false ? (
        <View style={styles.mainView}>
          <Text align="flex-start" style={[styles.nameTxt]}>
            {userData?.Description ? userData.Description : ' -'}
          </Text>
          <View style={styles.subView}>
            <View style={styles.imageBG}>
              <Image
                style={styles.imageStyle}
                source={require('../../../../assets/images/Group.png')}
              />
            </View>
            <View>
              <Text align="flex-start" style={[styles.allocateTxt]}>
                {strings('PARTDETAILS.Allocated')}
              </Text>
              <Text align="flex-start" style={[styles.countTxt]}>
                {userData?.AllocatedQty}
              </Text>
            </View>

            <View>
              <Text align="flex-start" style={[styles.allocateTxt]}>
                {strings('PARTDETAILS.Available')}
              </Text>
              <Text align="flex-start" style={[styles.countTxt]}>
                {userData?.AvailableQty}
              </Text>
            </View>

            <View>
              <Text align="flex-start" style={[styles.allocateTxt]}>
                {strings('PARTDETAILS.Total')}
              </Text>
              <Text align="flex-start" style={[styles.countTxt]}>
                {userData?.Total}
              </Text>
            </View>
          </View>
          <View style={styles.thinLine} />
          <View>
            <Text align="flex-start" style={[styles.nameTxt]}>
              {strings('PARTDETAILS.Model')}
            </Text>
            <Text align="flex-start" style={[styles.typeTxt]}>
              {userData?.Model ? userData.Model : ' -'}
            </Text>
          </View>
          <View>
            <Text align="flex-start" style={[styles.nameTxt]}>
              {strings('PARTDETAILS.Brand')}
            </Text>
            <Text align="flex-start" style={[styles.typeTxt]}>
              {userData?.Brand}
            </Text>
          </View>
          <View>
            <Text align="flex-start" style={[styles.nameTxt]}>
              {strings('PARTDETAILS.Part')}
            </Text>
            <Text align="flex-start" style={[styles.typeTxt]}>
              {userData?.PartNo}
            </Text>
          </View>
          {userData?.Serialized == 'Non Serialized' ||
          userData?.Serialized == undefined ? null : (
            <View style={styles.bottomView}>
              <Text
                align="flex-start"
                style={[styles.nameTxt, {marginLeft: normalize(10)}]}>
                {strings('PARTDETAILS.Serialized_Details')}
              </Text>

              <View style={styles.subViews}>
                <Text
                  align="flex-start"
                  style={[
                    styles.nameTxt,
                    {marginLeft: normalize(10)},
                    {fontSize: normalize(12)},
                  ]}>
                  {strings('PARTDETAILS.Serial')}
                </Text>
                <Text
                  align="flex-start"
                  style={[
                    styles.nameTxt,
                    {marginRight: normalize(20)},
                    {fontSize: normalize(12)},
                  ]}>
                  {strings('PARTDETAILS.Warranty_Expiry')}
                </Text>
              </View>
              <View style={styles.thinLines} />
              <FlatList
                data={userData?.SerializedDetails}
                renderItem={renderItem}
                keyExtractor={(item, index) => `ID-${index}`}
              />
            </View>
          )}
        </View>
      ) : (
        <DataNotFound />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
  },
  mainView: {
    marginLeft: normalize(20),
    marginRight: normalize(20),
  },
  nameTxt: {
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    color: Colors.secondryBlack,
    marginTop: normalize(15),
  },
  allocateTxt: {
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    color: Colors.secondryBlack,
    marginTop: normalize(15),
  },
  imageBG: {
    height: normalizeHeight(93),
    width: normalize(109),
    backgroundColor: Colors.imageGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    height: normalizeHeight(62),
    width: normalize(82),
  },
  subView: {
    flexDirection: 'row',
    marginTop: normalize(15),
    justifyContent: 'space-between',
    paddingRight: normalize(25),
    paddingTop: normalize(10),
  },
  countTxt: {
    fontSize: normalize(20),
    fontFamily: fontFamily.extraBold,
    color: Colors.secondryBlack,
  },
  thinLine: {
    height: normalizeHeight(1),
    borderWidth: normalize(0.3),
    borderColor: Colors.lightSilver,
    marginTop: normalize(20),
  },
  thinLines: {
    height: normalizeHeight(1),
    borderWidth: normalize(0.3),
    borderColor: Colors.lightSilver,
    marginLeft: normalize(10),
    marginRight: normalize(10),
    marginTop: normalize(5),
  },
  typeTxt: {
    fontSize: normalize(15),
    fontFamily: fontFamily.regular,
    color: Colors.secondryBlack,
    marginTop: normalize(5),
  },
  bottomView: {
    height: normalize(182),
    backgroundColor: Colors.appGray,
    borderRadius: normalize(8),
    marginTop: normalize(20),
  },
  subViews: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
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
export default MainHoc(PartDetails);
