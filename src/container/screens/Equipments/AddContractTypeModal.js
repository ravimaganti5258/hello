import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TextInput,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import {
  fontFamily,
  normalize,
  textSizes,
  dateFormat,
} from '../../../lib/globals';
import CheckBox from '../../../components/CheckBox';
import PairButton from '../../../components/Button/pairBtn';
import {strings} from '../../../lib/I18n/index.js';
import api from '../../../lib/api';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {Header} from '../../../lib/buildHeader';
import {useDispatch, useSelector} from 'react-redux';
import {useColors} from '../../../hooks/useColors.js';
import {ScrollView} from 'react-native-gesture-handler';

const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');

const addContractTypemodal = ({
  visibility,
  handleModalVisibility,
  setType,
  description,
  setDescription,
  setvalue,
  contractTypeData,
}) => {
  const { height } = useDimensions();
  const insets = useSafeAreaInsets();
  const [vis, setVis] = useState(visibility);
  const [typeErr, setTypeErr] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const [contractText, setContractText] = useState('');
  const [ck, setCk] = useState(0);
  const [contractType, setContractType] = useState({});
  const { colors } = useColors();
  const [hiddenKeyboards, sethiddenKeyboards] = useState(false);
  
  //api function to save contract type
  const saveContractType = () => {
    if (contractText == '') {
      setTypeErr(strings('Equipment_modal.Please_enter_the_Contract_Type'));
    } else {
      let checkContractType = contractTypeData.filter(
        (c) => c.label == contractText,
      );
      if (checkContractType.length) {
        return setTypeErr(strings('Equipment_modal.Contract_Type_Duplicate'));
      }
      try {
        dispatch({type: SET_LOADER_TRUE});
        const data = {
          ContractTypeId: 0,
          CompanyId: userInfo?.CompanyId,
          ContractType: contractText,
          IsActive: 1,
          Description: description,
          CreatedBy: jobInfo?.CustomerId,
          CreatedDate: initialDate,
          LastChangedBy: null,
          LastUpdate: null,
        };
        const handleCallback = {
          success: (data) => {
            setVis(!vis);
            if (data?.Message?.MessageCode) {
              const msgCode = data?.Message?.MessageCode;
              if (msgCode.length > 5) {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              } else if (msgCode.charAt(0) === '1') {
                let obj = {
                  id: data?.Data,
                  label: contractText,
                  value: contractText,
                };
                setContractType(obj);
                setType(obj);
                setVis(false);
                handleModalVisibility();
                FlashMessageComponent(
                  'success',
                  strings(`Response_code.${msgCode}`),
                );
              } else {
                FlashMessageComponent(
                  'warning',
                  strings(`Response_code.${msgCode}`),
                );
              }
            }
            dispatch({type: SET_LOADER_FALSE});
          },
          error: (error) => {
            dispatch({type: SET_LOADER_FALSE});
          },
        };
        const header = Header(token);
        api.saveContractType(data, handleCallback, header);
      } catch (error) {
        dispatch({type: SET_LOADER_FALSE});
      }
    }
  };
  const onFocusFun = () => {
    sethiddenKeyboards(true);
  };
  const onBlurFun = () => {
    sethiddenKeyboards(false);
  };

  //ui for contract type
  return (
    <>
      <ModalContainer
        visibility={vis}
        handleModalVisibility={handleModalVisibility}
        containerStyles={{
          ...(styles.modalContainer
            ? Platform.OS === 'ios'
              ? normalize(10) + insets.top
              : normalize(16 + 70)
            : normalize(50) + insets.top),
        }}>
        <ScrollView
          style={{
            ...styles.container,
            maxHeight: height / 1.4,
          }}>
          <View>
            <Text style={styles.optTxtStyles1}>
              {' '}
              {strings('Equipments.add_contract_type')}
            </Text>

            <View style={styles.label}>
              <Text style={styles.star}>*</Text>
              <Text align={'flex-start'} style={styles.txt}>
                {''} {strings('Equipments.contract_type')}
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={contractText}
              onChangeText={(val) => {
                setContractText(val);
                if (contractText == '') {
                  setTypeErr('please enter the Contract Type');
                } else {
                  setTypeErr(null);
                }
              }}
            />
            {typeErr ? (
              <Text style={styles.err}>
                {typeErr}
              </Text>
            ) : null}

            <Text align={'flex-start'} style={styles.txt}>
              {''} {strings('Equipments.Description')}
            </Text>
            <TextInput
              style={[styles.multiLine, {height: normalize(84)}]}
              multiline={true}
              onFocus={() => {
                onFocusFun();
              }}
              onBlur={() => onBlurFun()}
              onChangeText={(description) => {
                setDescription(description);
              }}
            />
            <View style={styles.check}>
              <CheckBox
                containerStyles={styles.align}
                ckBoxStyle={styles.ckboxStyle2}
                onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
                onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
                label={strings('Equipments.inactive')}
                handleValueChange={(value) => {
                  setvalue(value);
                  if (value == true) {
                    setCk(1);
                  } else if (value == false) {
                    setCk(0);
                  }
                }}
              />
            </View>
          </View>
          <PairButton
            title1={strings('Add_Incident.Cancel')}
            title2={strings('Add_Incident.Add')}
            containerStyle={styles.bottom}
            onPressBtn1={() => {
              handleModalVisibility();
              setVis(false);
            }}
            onPressBtn2={() => {
              saveContractType();
            }}
          />
        </ScrollView>
      </ModalContainer>
    </>
  );
};

export default addContractTypemodal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(20),
    flex: 1,
    marginLeft: normalize(20),
    marginRight: normalize(20)
  },
  align: {
    alignSelf: 'flex-start',
  },
  bottom: {
    paddingBottom: normalize(20)
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
  },
  label: {
    flexDirection: 'row',
  },
  star: {
    left: 0,
    color: '#FF0000',
    fontSize: Platform.OS === 'ios' ? normalize(15) : normalize(20),
    letterSpacing: 0,
    fontFamily: fontFamily.regular,
    marginTop: normalize(10),
    marginLeft: normalize(4),
  },
  err: {
    color: 'red',
    alignSelf: 'flex-start'
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(20),
    borderRightWidth: normalize(15),
    borderBottomWidth: normalize(20),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -normalize(9),
    right: normalize(0),
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
  dividerStyles: {
    borderWidth: normalize(0.7),
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(16),
  },
  optTxtStyles1: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  optBtnStyles: {
    paddingRight: normalize(70),
  },
  textInput: {
    height: normalize(45),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    width: normalize(325),
    paddingLeft: Platform.OS === 'ios' ? normalize(10) : normalize(10),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  check: {
    flexDirection: 'row',
    marginTop: normalize(15),
  },
  ckboxStyle2: {
    height: 'auto',
    width: 'auto',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderWidth: normalize(1),
    borderRadius: normalize(4),
    borderColor: Colors?.borderGrey,
    margin: normalize(5),
  },
  txt: {
    marginTop: normalize(15),
    paddingBottom: normalize(2),
  },
  multiLine: {
    height: normalize(54),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: Colors.appGray,
    borderColor: '#D9D9D9',
    width: normalize(325),
    paddingHorizontal: normalize(10),
    textAlignVertical: 'top',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  pairButtonStyle: {
    paddingBottom: normalize(20),
  },
  typeErrorStyle: {
    color: 'red',
    alignSelf: 'flex-start',
  },
});
