import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Switch,
  Image,
  TextInput,
  Platform,
  FlatList,
} from 'react-native';
import { BlackMoreOptionIcon } from '../../../assets/img/index.js';
import { Colors } from '../../../assets/styles/colors/colors.js';
// import Header from '../../../components/header/index.js';
import MainHoc from '../../../components/Hoc';
import { Input } from '../../../components/Input/index';
import {
  addZeroPrecesion,
  fontFamily,
  normalize,
  textSizes,
} from '../../../lib/globals';
import { strings } from '../../../lib/I18n/index.js';

import { useDispatch, useSelector } from 'react-redux';
import AddMoreModal from '../../screens/JobList/addMore';
import { Header } from '../../../lib/buildHeader';
import api from '../../../lib/api';
import HeaderComponents from '../../../components/header';
import { accessPermission } from '../../../database/MobilePrevi/index.js';
import { DataNotFound } from '../../../components/DataNotFound/index.js';

// import {Text} from '../../../components/Text/index';
const { width, height } = Dimensions.get('window');
const SlaDetails = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [permission, setPermission] = useState({});
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  const slaData = useSelector(
    (state) => state?.jobDetailReducers?.data?.SLADetails,
  );

  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const token = useSelector((state) => state?.authReducer?.token);
  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);
  const [SLArr, setSLArr] = useState([]);
  const userInformation = useSelector((state) => state?.authReducer?.userInfo);
  useEffect(() => {
    fetchSlaDetailsOnline();
    setSLArr(slaData?.reverse());
  }, []);

  useEffect(() => {
    accessPermission('SLA Details').then((res) => setPermission(res));
  }, []);

  const fetchSlaDetailsOnline = () => {
    try {
      const handleCallback = {
        success: (res) => {
          res.length > 0 && setSLArr(res.reverse());
          dispatch(saveJobDetails({ ...jobDetails, SLADetails: res }));
        },
        error: (Err) => { },
      };

      const endPoint = `?CompanyId=${userInformation?.CompanyId}&WoId=${jobInfo?.WorkOrderId}&WoJobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetSlaDetailsOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        {item?.SLAType == 'Response' ? (
          <View style={styles.renderContainer}>
            <Text style={styles.headerlable}>{item.SLAType}</Text>
            <View style={styles.isslameetStyle}>
              <Text
                style={{
                  flex: 0.5,
                  fontSize: normalize(14),
                  right: normalize(45),
                  color: item.IsSLAMet === 'SLA MET' ? '#43BF57' : '#FF0404',
                }}>
                {item.IsSLAMet === 'SLA MET' ? 'Met' : 'Not Met'}
              </Text>
            </View>
            <Text style={styles.responselabel}>
              {item?.SlaDays == null
                ? null
                : item?.SlaDays
                  ? addZeroPrecesion(item?.SlaDays)
                  : '00'}{' '}
              {item?.SlaDays == null
                ? null
                : item?.SlaDays == null
                  ? 'Days'
                  : 'Day'}
              {'   '}
              {item?.SlaHours ? addZeroPrecesion(item?.SlaHours) : '00'}
              {':'}
              {item?.SlaMinutes ? addZeroPrecesion(item?.SlaMinutes) : '00'}
              {':'}
              {item?.SlaSeconds ? addZeroPrecesion(item?.SlaSeconds) : '00'}
              { } { }
            </Text>
            {/* <Text style={styles.responselabel}>{item.Durationstr}</Text> */}
          </View>
        ) : null}
        {item?.SLAType === 'Resolution' ? (
          <View style={styles.renderContainer}>
            <Text style={styles.headerlable}>{item.SLAType}</Text>
            <View style={styles.isslameetStyle}>
              <Text
                style={{
                  flex: 0.4,
                  fontSize: normalize(14),
                  right: normalize(45),
                  color: item.IsSLAMet === 'SLA MET' ? '#43BF57' : '#FF0404',
                }}>
                {item.IsSLAMet === 'SLA MET' ? 'Met' : 'Not Met'}
              </Text>
            </View>
            <Text style={styles.responselabel}>
              {item?.SlaDays == null
                ? null
                : item?.SlaDays
                  ? addZeroPrecesion(item?.SlaDays)
                  : '00'}{' '}
              {item?.SlaDays == null
                ? null
                : item?.SlaDays == null
                  ? 'Days'
                  : 'Day'}
              {'   '}
              {item?.SlaHours ? addZeroPrecesion(item?.SlaHours) : '00'}
              {':'}
              {item?.SlaMinutes ? addZeroPrecesion(item?.SlaMinutes) : '00'}
              {':'}
              {item?.SlaSeconds ? addZeroPrecesion(item?.SlaSeconds) : '00'}
              { } { }
            </Text>
          </View>
        ) : null}
      </>
    );
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors?.white }}>
        <HeaderComponents
          title={strings('SLA_Details.SLA_Details')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          HeaderRightIcon={headerRightIcons}
        />
        {showAddMore ? (
          <AddMoreModal
            handleModalVisibility={toggleAddMore}
            visibility={showAddMore}
          />
        ) : null}
        {SLArr.length > 0 && SLArr[0].SLAType != null && permission?.View ? (
          <>
            <View style={styles.container}>
              <Text style={styles.labelStyle}>
                {SLArr.length > 0 ? SLArr[0]?.PriorityName : null}
                {/* {strings('SLA_Details.Medium_Priority')} */}
              </Text>
              <FlatList
                data={SLArr}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          </>
        ) : (
          <DataNotFound />
        )}
      </View>
    </>
  );
};

export default MainHoc(SlaDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.white,
    width: width,
    alignSelf: 'center',
    paddingHorizontal: normalize(15),
    paddingTop: 10,
    //backgroundColor:'red'
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    height: height * 0.05,
  },
  renderContainer: {
    width: width * 0.92,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    height: height * 0.05,
    flexDirection: 'row',
  },
  labelStyle: {
    marginVertical: normalize(7),
    fontSize: normalize(15),
    marginTop: normalize(10),
    fontFamily: fontFamily.regular,
    color: Colors?.red,
    textAlign: 'left',
  },
  responselabel: {
    fontSize: normalize(14),
    color: Colors?.extraDarkBlue,
    fontFamily: fontFamily.bold,
  },

  headerlable: {
    color: Colors?.extraDarkBlue,
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
    flex: 0.3,
  },

  isslameetStyle: {
    width: width * 0.15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 0.3,
  },
});
