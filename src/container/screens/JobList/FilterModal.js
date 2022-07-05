import React from 'react';

import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../../../lib/I18n';
import CheckList from '../../../components/CheckList';
import { Input } from '../../../components/Input';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { Colors } from '../../../assets/styles/colors/colors';
import { Dropdown } from '../../../components/Dropdown';
import Switch from '../../../components/Switch';
import Button from '../../../components/Button';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import api from '../../../lib/api';
import { useNetInfo } from '../../../hooks/useNetInfo';
import { useColors } from '../../../hooks/useColors';
import { isRTL } from '../../../lib/I18n';

const FilterModal = ({
  visibility,
  handleModalVisibility,
  token,
  userInfo,
  dispatch,
  setMapViewData,
  sortJobList,
  title,
  selectedData,
  selectedItem,
  categories,
  jobStatus,
  crewOnly,
  customerName,
  toggleCrewOnly,
  setCustomerName,
  setSelectedData,
  setSelectedItem,
  jobStatusID,
  setJobStatusID,
  handleFilter
}) => {
  const { height } = useDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useColors();

  const getSelectedCheckListItem = () => {
    const result = selectedData.filter((item) =>
      item?.selected ? item?.selected == true : null,
    );
    setJobStatusID(result[0]?.id);
    return result[0]?.id;
  };

  const handleApplyFilter = () => {
    try {
      const statusId = getSelectedCheckListItem();
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        CompanyId: userInfo?.CompanyId,
        MaxRoleGroupId: userInfo?.MaxRoleGroup,
        LoginId: userInfo?.sub,
        LoginVendorId: userInfo?.VendorId,
        CustomerName: customerName,
        JobStatusId: statusId === undefined ? 0 : statusId,
        CategoryId: selectedItem === null ? 0 : selectedItem?.id,
        isCrewJobs: crewOnly ? 1 : 0,
        JobNo: '',
      };
      const handleCallback = {
        success: (filteredData) => {

          sortJobList(filteredData);
          dispatch({ type: SET_LOADER_FALSE });
          handleModalVisibility();
        },
        error: (filterError) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      api.jobListing(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const { isConnected } = useNetInfo();

  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}
      containerStyles={{
        ...styles.modalContainer,
        top: !isConnected
          ? Platform.OS === 'ios'
            ? normalize(72) + insets.top
            : normalize(16 + 70)
          : normalize(10) + insets.top,
        right: normalize(10),
      }}
      overlayStyles={{
        top: !isConnected
          ? Platform.OS === 'ios'
            ? normalize(62) + insets.top
            : normalize(16+50)
          : Platform.OS === 'ios'
            ? normalize(43) + insets.top
            : normalize(58),
      }}>
      <View style={[styles.container, { maxHeight: height / 1.4,}]}>
        <View style={[styles.triangle]} />
        <KeyboardAvoidingView
          behavior={'padding'}
          keyboardVerticalOffset={normalize(115)}
          enabled>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <Text
              align={'flex-start'}
              size={textSizes.h10}
              style={{ marginBottom: normalize(17) }}
              fontFamily={fontFamily.bold}>
              {title}
            </Text>
            <Text align={'flex-start'} size={normalize(13)}>
              {strings('FilterModal.Status')}
            </Text>
            <CheckList
              listData={jobStatus}
              setSelectedData={setSelectedData}
              selectedData={selectedData}
              ckBoxStyle={styles.ckBoxStyles}
              style={styles.ckBoxRowStyles}
              labelStyle={styles.ckBoxLabelStyles}
              selectOnlyOne={true}
              onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
              onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
            />
            <Input
              label={strings('FilterModal.Customer_Name')}
              containerStyle={styles.inputContainerStyles}
              style={styles.inputStyles}
              labelStyles={styles.labelStyles}
              onChangeText={setCustomerName}
              value={customerName}
            />
            <View style={styles.categoryContainer}>
              <Text style={styles.labelStyles}>{strings('FilterModal.Category')}</Text>
              <Dropdown
                list={[
                  // { id: 0, label: 'Select', value: 'Select' },
                  ...categories,
                ]}
                handleSelection={setSelectedItem}
                selectedItem={selectedItem}
                label={selectedItem?.value || strings('FilterModal.Select')}
                dropDownBodyContainer={{ borderColor: Colors.darkSecondaryTxt }}
                dropDownContainer={{
                  borderColor: Colors.darkSecondaryTxt,
                  height: normalize(40),
                  paddingLeft: normalize(10),
                }}
              />
            </View>
            <View style={styles.crewContainer}>
              <Switch
                value={crewOnly}
                trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
                onChange={toggleCrewOnly}
              />
              <Text style={styles.crewTextStyles}>{strings('FilterModal.Crew_Jobs_Only')}</Text>
            </View>
            <Button
              title={strings('FilterModal.Apply')}
              txtStyle={styles.applyBtnTxt}
              style={[
                styles.applyBtnStyles,
                { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
              ]}
              // onClick={handleApplyFilter}
              onClick={handleFilter}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ModalContainer>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(23),
  },
  modalContainer: {
    width: '93%',
    marginRight: normalize(4),
    borderRadius: normalize(8),
    marginTop:Platform.OS == 'android' ? normalize(21) : normalize(55),
  },
  ckBoxStyles: {
    marginLeft: Platform.OS == 'android' ? -normalize(10) : 0,
  },
  inputContainerStyles: {
    borderWidth: normalize(1),
    marginTop: normalize(5),
    borderRadius: normalize(7),
    borderColor: Colors.darkSecondaryTxt,
    height: normalize(40),
  },
  labelStyles: {
    fontSize: normalize(13),
    alignSelf: 'flex-start',
  },
  ckBoxRowStyles: {
    marginBottom: normalize(11),
    marginTop: normalize(11),
    marginLeft: I18nManager.isRTL ? normalize(15) : normalize(3),
  },
  categoryContainer: {
    marginVertical: normalize(15),
  },
  crewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(28),
  },
  crewTextStyles: {
    marginLeft: normalize(10),
    fontSize: textSizes.h11,
    fontFamily: fontFamily.semiBold,
  },
  applyBtnStyles: {
    width: '100%',
    backgroundColor: Colors.blue,
    borderRadius: normalize(100),
    height: normalize(36),
  },
  applyBtnTxt: {
    fontSize: textSizes.h11,
    color: Colors.white,
  },
  inputStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.semiBold,
    marginLeft: normalize(10),
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(20),
    borderRightWidth: normalize(20),
    borderBottomWidth: normalize(20),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -normalize(9),
    right: normalize(28),
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
});
