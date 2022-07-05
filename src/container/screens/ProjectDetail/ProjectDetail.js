import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Header from '../../../components/header';
import {
  dateFormat,
  fontFamily,
  normalize,
  timeFormat,
} from '../../../lib/globals.js';
import {Colors} from '../../../assets/styles/colors/colors';
import MainHoc from '../../../components/Hoc/index';
import {Text} from '../../../components/Text/index';
import {BlackMoreOptionIcon} from '../../../assets/img/index.js';
import {strings} from '../../../lib/I18n';
import Loader from '../../../components/Loader/index.js';
import {splitDateString} from '../../../util/helper';
import AddMoreModal from '../JobList/addMore';
import {DataNotFound} from '../../../components/DataNotFound';

const ProjectDetail = ({navigation, route}) => {
  const [projectDetails, setprojectDetails] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  // const callback = route?.params?.callback;
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => toggleAddMore(),
    },
  ];

  useEffect(() => {
    setisLoading(true);

    if (route?.params?.projectDetail) {
      setprojectDetails(route?.params?.projectDetail);
    }
    setTimeout(() => {
      setisLoading(false);
    }, 1000);
  }, [route]);

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const fieldsWrap = (label, value) => {
    return (
      <View style={{padding: 10}}>
        <Text
          align={'flex-start'}
          fontFamily={fontFamily.semiBold}
          color={Colors.secondryBlack}>
          {label}
        </Text>
        <Text align={'flex-start'} color={Colors.secondryBlack}>
          {value != '' && value != null ? value : ' -'}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Loader visibility={isLoading} />
      <Header
        title={strings('project_deatil.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        HeaderRightIcon={headerRightIcons}
      />
      {route?.params?.projectDetail ? (
        <View
          style={{
            padding: normalize(15),
          }}>
          {fieldsWrap(
            strings('project_deatil.project_name'),

            projectDetails?.ProjectName,
          )}
          {fieldsWrap(strings('project_deatil.milestone'), projectDetails?.ProjectMilestone)}
          {fieldsWrap(strings('project_deatil.project_type'), projectDetails?.ProjectType)}
          {fieldsWrap(
            strings('project_deatil.start_date'),
            projectDetails?.ProjectStartDate != null
              ? dateFormat(
                  projectDetails?.ProjectStartDate?.split('T')[0],
                  'DD/MM/YYYY',
                )
              : '-',
          )}
          {fieldsWrap(
            strings('project_deatil.end_date'),
            projectDetails?.ProjectEndDate !== null
              ? dateFormat(
                  projectDetails?.ProjectEndDate?.split('T')[0],
                  'DD/MM/YYYY',
                )
              : '-',
          )}
          {fieldsWrap(strings('project_deatil.WBS'), projectDetails?.WBSno)}
          {fieldsWrap(strings('project_deatil.PM_Name'), projectDetails?.PMName)}
          {fieldsWrap(strings('project_deatil.buisness_owner'), projectDetails?.BusinessOwner)}
          {fieldsWrap(strings('project_deatil.project_coordinator'), projectDetails?.PC)}
          {fieldsWrap(strings('project_deatil.regional_tech_lead'), projectDetails?.RegionalTechLead)}
        </View>
      ) : (
        <DataNotFound />
      )}
      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
    flex: 1,
  },
});

export default MainHoc(ProjectDetail);
