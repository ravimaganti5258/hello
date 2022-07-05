import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  I18nManager,
} from 'react-native';

import HeaderComponent from '../../../components/header';
import {Colors} from '../../../assets/styles/colors/colors';
import {fontFamily, normalize} from '../../../lib/globals.js';
import {strings} from '../../../lib/I18n';
import {Text} from '../../../components/Text';
import PairButton from '../../../components/Button/pairBtn';
import MainHoc from '../../../components/Hoc';
import {Dropdown} from '../../../components/Dropdown';
import {emptyDropDown, getCurrentLocation} from '../../../util/helper';
import api from '../../../lib/api';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../../lib/buildHeader';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {queryAllRealmObject} from '../../../database';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';

const NearByPart = ({
  children,
  style,
  navigation,
  itemStyle,
  containerStyle,
  ...rest
}) => {
  const [text, onChangeText] = React.useState('');
  const [find, onChangeFind] = React.useState('');
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState({});
  const [userLocation, setUserLocation] = useState([]);
  const dispatch = useDispatch();

  /* date get from redux */
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state.authReducer.userInfo);

  React.useEffect(() => {
    fetchDataRealm();
    getUserCurrentLocation();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const resData = res?.ModelLists.map((obj) => {
          let object = {
            id: obj.ModelId,
            label: obj.Model,
            value: obj.Model,
            ...obj,
          };
          return object;
        });

        if (resData != undefined && resData.length > 0) {
          setModelList(resData);
        }
      })

      .catch((error) => {});
  };

  /* get UserCurrentLocation */
  const getUserCurrentLocation = async () => {
    try {
      const userCoordinates = await getCurrentLocation();
      const userLocationObject = {
        latitude: userCoordinates[1],
        longitude: userCoordinates[0],
      };
      setUserLocation(userLocationObject);
    } catch (error) {}
  };
  const validationOnSubmit = async () => {
    let messages = [];
    if (text == '' || text > 10) {
      await messages.push(strings('NearByPart.Radius_error_message'));
    }

    if (!selectedModel.value && find == '') {
      await messages.push(strings('NearByPart.Part_error_message'));
    }

    if (messages.length === 0) {
      nearbyParts();
    } else {
      FlashMessageComponent('warning', messages[0]);
    }
  };

  const onChangeTextValidation = (val) => {
    let reg = /^[0-9]*$/;
    let tempVar = reg.test(val);
    if (!tempVar) {
      let newTxt = val.replace('-', '');
      let newTxt2 = newTxt.replace(',', '');
      onChangeText(newTxt2);
    } else {
      onChangeText(val);
    }
  };

  /* get Near by parts api */

  const nearbyParts = () => {
    try {
      dispatch({type: SET_LOADER_TRUE});

      const data = {
        CompanyID: userInfo?.CompanyId,
        PartNo: find,
        UserLatitude: userLocation?.latitude,
        UserLongitude: userLocation?.longitude,
        ModelID: selectedModel?.id,
        LoginId: userInfo?.sub,
        RadiusMiles: Number(text),
      };

      const handleCallback = {
        success: (data) => {
          const filter = [];
          data?.filter((item) => {
            if (item?.PartNo == find) {
              if (item?.Model == selectedModel?.Model) filter.push(item);
            }
          });
          navigation.navigate('NearByPartsMapView', {
            data: data,

            Latitude: userLocation?.latitude,
            Longitude: userLocation?.longitude,
            PartNo: find,
          });
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
        },
      };

      const header = Header(token);
      api.getNearByParts(data, handleCallback, header);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  return (
    <>
      <HeaderComponent
        title={strings('NearByPart.NearBy_Parts')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{strings('NearByPart.Find_by_Part')}</Text>
          <TextInput
            maxLength={8}
            style={styles.inputFieldStyle}
            onChangeText={(val) => {
              onChangeFind(val);
            }}
            value={find}
          />
          <Text style={styles.title}>
            {strings('NearByPart.Find_by_Model')}
          </Text>
          <View style={styles.dropdownLift}>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={selectedModel?.label}
              list={modelList.length > 0 ? modelList : emptyDropDown}
              selectedItem={selectedModel}
              handleSelection={(val) => setSelectedModel(val)}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={strings('NearByPart.Select')}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.itemStyle}
            />
          </View>
          <View style={styles.radiusView}>
            <Text style={styles.titleRadius}>
              {strings('NearByPart.Radius_miles')}
            </Text>
          </View>
          <TextInput
            maxLength={2}
            style={styles.inputFieldStyle}
            onChangeText={onChangeTextValidation}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
      <View style={styles.pairBtn}>
        <PairButton
          title1={strings('Find_Button.cancle')}
          title2={strings('Find_Button.find')}
          onPressBtn2={() => {
            validationOnSubmit();
          }}
          onPressBtn1={() => {
            navigation.goBack();
          }}
          containerStyle={styles.containerStyle}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
  },
  container: {
    alignContent: 'flex-start',
    marginHorizontal: normalize(20),
  },
  title: {
    fontSize: normalize(12),
    paddingBottom: normalize(20),
    fontFamily: fontFamily.regular,
    alignSelf: 'flex-start',
    marginTop: normalize(15),
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    borderColor: Colors.borderColor,
    fontSize: normalize(13),
    borderRadius: normalize(10),
    borderWidth: 1,
    padding: normalize(10),
    bottom: normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  pairBtn: {
    position: 'absolute',
    bottom: 0,
    height: normalize(60),
    alignSelf: 'center',
  },
  containerStyle: {
    justifyContent: 'space-between',
  },

  itemStyle: {
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: Colors.black,
    fontFamily: fontFamily.regular,
    fontSize: normalize(13),
  },
  dropDownBodyContainer: {
    borderColor: Colors.lightBackground,
    backgroundColor: Colors.white,
    elevation: 10,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(10),
  },
  dropdownLift: {
    bottom: 15,
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropDownBodyContainerstyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 10,
  },
  titleRadius: {
    fontSize: normalize(12),
    paddingBottom: normalize(25),
    alignSelf: 'flex-start',
    fontFamily: fontFamily.regular,
  },
  radiusView: {
    top: 5,
  },
});
export default MainHoc(NearByPart);
