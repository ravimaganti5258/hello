import React, {useEffect, useState} from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {
  EquipmentIcon,
  IncidentsIcon,
  OtherInfoIcon,
  PricingTagIcon,
  ServiceReportIcon,
  SignatureIcon,
  SLADetails,
} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import {useColors} from '../../../hooks/useColors';
import {fontFamily, normalize} from '../../../lib/globals';
import EquipmentServiceReportModal from '../../screens/Equipments/EquipmentServiceReportModal';
import {useDispatch, useSelector} from 'react-redux';
import {serviceReportVisibleAction} from '../../../redux/serviceReport/action';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import api from '../../../lib/api';
import {Header} from '../../../lib/buildHeader';
import {strings} from '../../../lib/I18n';
import {
  bottomIconShow,
  fetchMobilePrevBasedOnMenuName,
  sortedBottomList,
} from '../../../database/MobilePrevi';
import {accessPermission} from '../../../database/MobilePrevi';

const data = [
  {
    id: 1,
    icon: EquipmentIcon,
    label: 'Equipment',
    onPress: 'EquipmentList',
    count: 0,
  },
  {
    id: 2,
    icon: PricingTagIcon,
    label: 'Pricing',
    onPress: 'PriceDetails',
  },
  {
    id: 3,
    icon: ServiceReportIcon,
    label: 'Service_Report',
    onPress: 'ServiceReport',
  },
  {
    id: 4,
    icon: SignatureIcon,
    label: 'Signature & Feedback',
    onPress: 'SignatureAndFeedback',
  },
  {
    id: 5,
    icon: OtherInfoIcon,
    label: 'Other Information',
    onPress: 'OtherInformation',
  },
  {
    id: 6,
    icon: SLADetails,
    label: 'SLA Details',
    onPress: 'SlaDetails',
  },
  {
    id: 7,
    icon: IncidentsIcon,
    label: 'Incidents',
    onPress: 'Incidents',

    count: 0,
  },
  {
    id: 8,
    icon: SLADetails,
    label: 'Recent Jobs',
    onPress: 'RecentJobs',
    count: 0,
  },
];

const TabBottomSheet = ({onPressIcon, ServiceModal}) => {
  const navigation = useNavigation();
  const serviceReportVisible = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const jobDetailsReducer = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const dispatch = useDispatch();
  const {colors} = useColors();

  const [showServiceReprtModal, setShowServiceReprtModal] = useState(true);
  const [recentJobDataLength, setRecentJobDataLength] = useState('');
  const [bottomMenu1, setBottomMenu1] = useState([]);

  const toggleServiceReprtModal = () => {
    setShowServiceReprtModal(!showServiceReprtModal);
  };

  useEffect(() => {
    getRecentJobApi();
  }, [0]);
  const ListCount = useSelector((state) => state?.jobDetailReducers?.data);
  const jobInfo = useSelector((state) => state);
  const token = useSelector((state) => state?.authReducer?.token);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );

  const [equipmentPermission, setEquipmentPermission] = useState({});
  const [pricingPermission, setPricingPermission] = useState({});
  const [jobPrintPermission, setJobPrintPermission] = useState({});
  const [signaturePermission, setSignaturePermission] = useState({});
  const [otherInformationPermission, setOtherInformationPermission] = useState(
    {},
  );
  const [slaDetailsPermission, setSlaDetailsPermission] = useState({});
  const [punchListPermission, setPunchListPermission] = useState({});
  const [recentJobsPermission, setRecentJobsPermission] = useState({});

  useEffect(() => {
    accessPermission('Equipment').then((res) => {
      setEquipmentPermission(res);
    });
    accessPermission('Pricing').then((res) => setPricingPermission(res));
    accessPermission('Job Print').then((res) => setJobPrintPermission(res));
    accessPermission('Signature & Feedback').then((res) =>
      setSignaturePermission(res),
    );
    accessPermission('Other Information').then((res) =>
      setOtherInformationPermission(res),
    );
    accessPermission('SLA Details').then((res) => setSlaDetailsPermission(res));
    accessPermission('Punch List').then((res) => setPunchListPermission(res));
    accessPermission('Recent Jobs').then((res) => setRecentJobsPermission(res));
  }, []);

  const getRecentJobApi = () => {
    try {
      const handleCallback = {
        success: (data) => {
          setRecentJobDataLength(data.length);
        },
        error: (error) => {},
      };
      const header = Header(token);
      // const endPoint = `?CompanyId=${jobInfo?.authReducer?.userInfo?.CompanyId
      //   }&CustomerId=${jobDetail?.CustomerId}&TechId=${jobInfo?.authReducer?.userInfo?.sub
      //   }&isCustomerSearch=${true}&serialno=${null}&JobStatusId=${null
      //   }&ModelId=${null}`;

      const endPoint = `?CompanyId=${
        jobInfo?.authReducer?.userInfo?.CompanyId
      }&CustomerId=${
        jobDetail?.CustomerId
      }&TechId=${null}&isCustomerSearch=${true}&serialno=${null}&JobStatusId=${null}&ModelId=${null}`;
      api.getRecentJob('', handleCallback, header, endPoint);
    } catch (error) {}
  };

  useEffect(() => {
    sortedBottomList(data).then((res) => {
      setBottomMenu1(res);
    });
  }, []);
  const renderItem = (item, index, viewPermission) => {
    return (
      <View>
        {viewPermission ? (
          <>
            <View key={index.toString()}>
              {item.label != 'Signature & Feedback' ||
              (item.label === 'Signature & Feedback' &&
                jobDetailsReducer?.JobStatusid > 3 &&
                jobDetailsReducer?.JobStatusid < 7) ? (
                <View
                  style={{
                    width: normalize(110),
                    height: normalize(80),
                    marginHorizontal: normalize(6),
                    marginVertical: normalize(5),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      item.label === 'Service_Report'
                        ? dispatch(
                            serviceReportVisibleAction(!serviceReportVisible),
                          )
                        : item?.onPress != null
                        ? navigation.navigate(item?.onPress)
                        : undefined;
                      onPressIcon();
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <View>
                        {item?.label == 'Equipment' &&
                        ListCount?.GetJobEquipment.length > 0 ? (
                          <View style={styles.badgeStyles}>
                            <Text style={styles.badgeTxt}>
                              {ListCount?.GetJobEquipment.length}
                            </Text>
                          </View>
                        ) : null}
                        {item?.label == 'Incidents' &&
                        ListCount?.IncidentDetails.length > 0 ? (
                          <View style={styles.badgeStyles}>
                            <Text style={styles.badgeTxt}>
                              {ListCount?.IncidentDetails.length}
                            </Text>
                          </View>
                        ) : null}
                        {item?.label == 'Recent Jobs' &&
                        recentJobDataLength > 0 ? (
                          <View style={styles.badgeStyles}>
                            <Text style={styles.badgeTxt}>
                              {recentJobDataLength}
                            </Text>
                          </View>
                        ) : null}
                      <item.icon fill={colors?.PRIMARY_BACKGROUND_COLOR} />
                      </View>

                     <Text style={styles.labelStyles}>
                        {strings(`bottomMenu.${item?.label}`)}
                      </Text> 
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
            marginTop: normalize(15),
          }}>
          {/* {bottomMenu1.map((item, index) => {
            return renderItem(item, index);
          })} */}
          {bottomMenu1.map((item, index) => {
            if (item?.label == equipmentPermission?.menu) {
              return renderItem(item, index, equipmentPermission?.View);
            } else if (item?.label == pricingPermission?.menu) {
              return renderItem(item, index, pricingPermission?.View);
            } else if (item?.label == 'Service_Report') {
              return renderItem(item, index, jobPrintPermission?.View);
            } else if (item?.label == signaturePermission?.menu) {
              return renderItem(item, index, signaturePermission?.View);
            } else if (item?.label == otherInformationPermission?.menu) {
              return renderItem(item, index, otherInformationPermission?.View);
            } else if (item?.label == slaDetailsPermission?.menu) {
              return renderItem(item, index, slaDetailsPermission?.View);
            } else if (item?.label == 'Incidents') {
              return renderItem(item, index, punchListPermission?.View);
            } else if (item?.label == recentJobsPermission?.menu) {
              return renderItem(item, index, recentJobsPermission?.View);
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TabBottomSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors?.white,
    height: '100%',
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    paddingHorizontal: normalize(15),
    borderWidth: normalize(2),
    borderBottomWidth: 0,
    borderColor: Colors?.lightSilver,
    paddingTop: normalize(0),
  },
  labelStyles: {
    fontSize: normalize(14),
    color: Colors?.bottomSheetTxtColor,
    paddingTop: normalize(4),
    textAlign: 'center',
  },
  badgeStyles: {
    position: 'absolute',
    top: -normalize(10),
    left: normalize(10),
    backgroundColor: 'red',
    height: normalize(20),
    width: normalize(20),
    borderRadius: 20 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeTxt: {
    fontSize: normalize(12),
    fontFamily: fontFamily.bold,
    color: Colors?.white,
  },
});
