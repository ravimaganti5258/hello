import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,

} from 'react-native';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import Switch from '../../components/Switch/index';
import {useColors} from '../../hooks/useColors';
import CheckBox from '../../components/CheckBox/index';
import {Colors} from '../../assets/styles/colors/colors';
import {Dropdown} from '../../components/Dropdown/index';
import {GroupEquipment, QRIconLight} from '../../assets/img/index';
import CommonModal from '../../components/CommonModal/index';
import {Text} from '../../components/Text/index';
import {strings} from '../../lib/I18n';
import CheckList from '../CheckList';
import LabelComponent from '../../components/LableComponent/index';
import {queryAllRealmObject} from '../../database';
import {MASTER_DATA} from '../../database/webSetting/masterSchema';


const {width, height} = Dimensions.get('window');

const CustomFilter = ({
  customTxtStyle,
  inputFieldView,
  switchLabel,
  onChangeVal,
  modelLabelTxt,
  JobStatusHeading,
  buttonTxt,
  serialLabelTxt,
  visible,
  switchValue,
  hasBorder,
  dropdownlabel,
  onPress,
  scanValue,
  passScan,
  handleModalVisibility,
  qrcodePress,
}) => {
  const {colors} = useColors();
  const [selectedJobStatus, setselectedJobStatus] = useState({});
  const [modalList, setModalList] = useState([]);
  const [selectedModal, setSelectedModal] = useState({});
  const [jobStatus, setJobStatus] = useState([]);
  const [serial, setSerial] = useState('');

  const SwitchContainer = ({
    text = '',
    onChange,
    value,
    trackColor = Colors.blue,
    disabled = false,
    textStyles,
    containerStyles,
  }) => {
    return (
      <View
        style={{
          paddingTop: normalize(5),
          ...containerStyles,
        }}>
        <Switch
          value={value}
          onChange={onChange}
          trackColor={trackColor}
          disabled={disabled}
        />
        <Text align={'flex-start'} style={{...textStyles}} size={textSizes.h11}>
          {text}
        </Text>
      </View>
    );
  };
  const setModelData = () => {

    setSerial(scanValue);

    let data = {
      serialno: serial != '' ? serial : null,
      JobStatusId: selectedJobStatus.id ? selectedJobStatus.id : null,
      ModelId: selectedModal.id ? selectedModal.id : null,
    };
    onPress(data);
  };

  useEffect(() => {
    fetchDataRealm();
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
          setModalList(resData);
        }
        const jobStatusObject = res?.JobStatus.filter(
          (obj) =>
            obj?.JobStatusId == 2 ||
            obj?.JobStatusId == 9 ||
            obj?.JobStatusId == 5,
        );

        const jobStatusArr = jobStatusObject.map((obj) => {
          return {
            id: obj?.JobStatusId,
            label: obj?.JobStatus,
            value: obj?.JobStatus,
          };
        }).sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1)
        setJobStatus(jobStatusArr);
      })
        .catch((error) => {});
  };

  return (
    
    <View>
      <CommonModal
        handleModalVisibility={handleModalVisibility}
        visibility={visible}
        modalContainerStyles={{
          top: Platform.OS === 'ios' ? normalize(30) : normalize(30),
        }}
        headerSection={() => {
          return (
            <View style={styles.modalHeaderStyle}>
              <Text fontFamily={fontFamily.bold} size={normalize(16)}>
                {strings('RecentJobs.Filter_By')}
              </Text>
            </View>
          );
        }}
        bodySection={() => {
          return (
            <View style={{paddingVertical: normalize(15)}}>
              <View style={styles.switchContainer}>
                <SwitchContainer
                  text={switchLabel}
                  onChange={onChangeVal}
                  value={switchValue}
                  trackColor={colors?.PRIMARY_BACKGROUND_COLOR}
                  containerStyles={styles.switchContainer}
                  textStyles={[styles.textstyle, customTxtStyle]}
                />
              </View>
              <View style={{paddingVertical: normalize(10)}}>
                <Text style={styles.statusLabel} align={'flex-start'}>
                  {JobStatusHeading}
                </Text>
              </View>
              {jobStatus.map((ele) => {
                return (
                  <View style={{marginVertical: normalize(10)}}>
                    <CheckBox
                      containerStyles={{
                        alignSelf: 'flex-start',
                        marginLeft: normalize(12)
                      }}
                      value={selectedJobStatus.id === ele.id}
                      ckBoxStyle={[styles.ckboxStyle]}
                      onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
                      onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
                      tintColor = {colors?.PRIMARY_BACKGROUND_COLOR}
                      label={ele.label ? strings(`RecentJobs.${ele.label}`) : ele.label}
                      handleValueChange={() => {
                       if(selectedJobStatus.id != ele.id){ 
                         setselectedJobStatus(ele);
                       }
                       else{
                        setselectedJobStatus({})
                       }
                      }}
                      lableStyle={{
                        fontFamily: fontFamily?.semiBold,
                        marginLeft: normalize(12),
                        color: Colors?.secondryBlack,
                      }}
                    />
                  </View>
                );
              })}

              {inputFieldView == false ? (
                <>
                  <LabelComponent
                    label={modelLabelTxt}
                    style={[{marginLeft: normalize(5)}, styles.statusLabel]}
                    required={true}
                  />
                  <Dropdown
                    style={[styles.dropDownWrap]}
                    hasBorder={hasBorder}
                    label={selectedModal?.label || strings('FilterModal.Select')}
                    list={modalList}
                    selectedItem={selectedModal}
                    handleSelection={setSelectedModal}
                    zIndexVal={-1}
                    align={'flex-start'}
                    placeholder={''}
                    dropDownContainer={styles.dropDownContainerStyle}
                    dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                    itemStyle={styles.dropdownTextStyle}
                  />
                  <LabelComponent
                    label={serialLabelTxt}
                    style={[{marginLeft: normalize(5)}, styles.statusLabel]}
                  />
                  <View style={styles.serialButton}>
                    <TextInput
                      style={styles.txtAreaStyles}
                      value={scanValue}
                      onChangeText={passScan}
                    />
                    <TouchableOpacity onPress={qrcodePress}>
                      <QRIconLight
                        style={{
                          alignSelf: 'center',
                        }}
                        height={normalize(18)}
                        width={normalize(18)}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
            </View>
          );
        }}
        footerSection={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                setModelData();
              }}>
              <View
                style={[
                  styles.buttonStyle,
                  {backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR},
                ]}>
                <Text style={[styles.buttonTxtStyle]}>{buttonTxt}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  EditStyle: {
    paddingHorizontal: normalize(15),
    alignSelf: 'center',
  },
  bodySectionWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
  },
  bodyIconStyles: {
    backgroundColor: Colors.iconBackgroundGrey,
    borderRadius: normalize(20),
    padding: normalize(10),
  },
  switchContainer: {
    flexDirection: 'row',
    height: height * 0.04,
    alignItems: 'center',
  },
  textstyle: {
    fontSize: normalize(14),
  },
  statusLabel: {
    fontSize: normalize(14),
    marginTop: normalize(17),
  },
  buttonStyle: {
    backgroundColor: '#002C71',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingVertical: normalize(7),
    marginVertical: normalize(5),
  },
  buttonTxtStyle: {
    fontSize: normalize(16),
    color: Colors.white,
  },
  txtAreaStyles: {
    flex: 1,
    paddingRight: normalize(7),
  },
  ckboxStyle: {
    height: normalize(20),
    width: normalize(20),
    // paddingVertical: normalize(10),
    // paddingHorizontal: normalize(10),
    // borderWidth: normalize(1),
    // borderRadius: normalize(4),
    // borderColor: Colors?.blue,
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
  // ckBoxStyles: {
  //   marginLeft: Platform.OS == 'android' ? -normalize(10) : 0,
  //   backgroundColor: 'red',
  // },

  ckBoxRowStyles: {
    // margin: normalize(40),
  },
  dropdownstyle: {
    width: width * 0.95,
    height: height * 0.05,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 15,
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: Colors.black,
  },
  dropDownBodyContainerstyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 10,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(10),
  },
  serialButton: {
    height: height * 0.055,
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: Colors?.borderColor,
    marginTop: 8,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: normalize(15),
  },
});

export default CustomFilter;
