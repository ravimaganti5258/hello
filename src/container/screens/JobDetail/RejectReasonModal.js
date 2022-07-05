import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors } from '../../../assets/styles/colors/colors';
import { Dropdown } from '../../../components/Dropdown';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { ModalContainer } from '../../../components/Modal';
import MultiButton from '../../../components/MultiButton';
import { queryAllRealmObject } from '../../../database';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { SET_LOADER_FALSE } from '../../../redux/auth/types';

const RejectReasonModal = ({
  handleModalVisibility,
  visibility,
  updateAcceptanceStatus,
  toggle,
}) => {
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const dispatch = useDispatch();

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.RejectReasons.map((obj) => {
          return {
            id: obj?.StatusReasonId,
            label: obj?.StatusReason,
            value: obj?.StatusReason,
          };
        });

        setDropdownList(result);
      })

      .catch((error) => { });
  };

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const { colors } = useColors();
  const { height } = useDimensions();

  const calcelSaveBtns = [
    {
      btnName: strings('job_detail.cancel'),
      onPress: () => handleModalVisibility(),
      btnStyles: { ...styles.btnHeight, ...styles.cancelBtnStyles },
      btnTxtStyles: { ...styles.btnTxtStyles, color: Colors.secondryBlack },
    },
    {
      btnName: strings('job_detail.save'),
      onPress: () => {
        selectedData.label !== 'Select' && selectedData ?
        handleSave() :
        (handleModalVisibility(),
          FlashMessageComponent('warning', strings('flashmessage.Choose_the_proper_reject_reason')))
      },
      btnStyles: {
        ...styles.btnHeight,
        backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
      },
      btnTxtStyles: styles.btnTxtStyles,
    },
  ];

  const cancelBtns = [
    {
      btnName: strings('job_detail.cancel'),
      onPress: () => handleModalVisibility(),
      btnStyles: { ...styles.btnHeight, ...styles.cancelBtnStyles },
      btnTxtStyles: { ...styles.btnTxtStyles, color: Colors.secondryBlack },
    },
  ];

  const handleSave = () => {
    const callback = {
      success: (res) => {
        toggle('reject');
        handleModalVisibility();
        FlashMessageComponent('success', strings('flashmessage.Job_Rejected'));
        dispatch({ type: SET_LOADER_FALSE });
      },
      error: () => {
        handleModalVisibility(), dispatch({ type: SET_LOADER_FALSE });
      },
    };
    updateAcceptanceStatus(
      2,
      selectedData?.id != 0 && selectedData?.id != undefined
        ? selectedData?.id
        : null,
      callback,
    );
  };

  return (
    <ModalContainer
      handleModalVisibility={handleModalVisibility}
      visibility={visibility}>
      <View style={[styles.container, { maxHeight: height / 1.5 }]}>
        <Text style={styles.rejectReasonTxt}>
          {strings('job_detail.reject_reason')}
        </Text>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.reasonTxt}>{strings('job_detail.reason')}</Text>
          <Dropdown
            list={[{ id: 0, label: 'Select', value: 'Select' }, ...dropdownList]}
            label={selectedData?.value || 'Select'}
            handleSelection={setSelectedData}
            selectedItem={selectedData}
            dropDownContainer={styles.dropDownBorderStyles}
            dropDownBodyContainer={styles.dropDownBorderStyles}
          />
          <MultiButton
            buttons={selectedData ? calcelSaveBtns : cancelBtns}
            constinerStyles={styles.multiBtnContainer}
          />
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default RejectReasonModal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(23),
  },
  rejectReasonTxt: {
    fontFamily: fontFamily.bold,
    fontSize: textSizes.h10,
  },
  reasonTxt: {
    fontSize: normalize(13),
    marginTop: normalize(23),
  },
  dropDownBorderStyles: {
    borderColor: Colors?.borderGrey,
  },
  multiBtnContainer: {
    paddingHorizontal: normalize(18),
    marginTop: normalize(74),
  },
  btnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors?.white,
    fontFamily: fontFamily?.semiBold,
  },
  btnHeight: {
    height: normalize(36),
  },
  cancelBtnStyles: {
    backgroundColor: Colors?.silver,
  },
});
