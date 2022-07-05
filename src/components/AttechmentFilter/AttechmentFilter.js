import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {useColors} from '../../hooks/useColors';
import {Colors} from '../../assets/styles/colors/colors';
import CommonModal from '../../components/CommonModal/index';
import {Text} from '../../components/Text/index';
import {strings} from '../../lib/I18n';
import CheckBox from '../../components/CheckBox/index';
const {width, height} = Dimensions.get('window');

const AttechmentFilter = ({
  JobStatusHeading,
  buttonTxt,
  visible,
  onPress,
  handleModalVisibility,
  data,
}) => {
  const {colors} = useColors();
  const [selectedAttachment, setselectedAttachment] = useState({});
  const setModelData = () => {
    let data = {
      // attechmentCheckedId: selectedAttachment.id ? selectedAttachment.id : null,
      attchhmentTypeName: selectedAttachment,
    };
    onPress(data);
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
                {strings('Equipments.Filter_By')}
              </Text>
            </View>
          );
        }}
        bodySection={() => {
          return (
            <View style={{paddingVertical: normalize(15)}}>
              <View style={{paddingVertical: normalize(10)}}>
                <Text style={styles.statusLabel} align={'flex-start'}>
                  {JobStatusHeading}
                </Text>
              </View>
              {data.map((ele) => {
                return (
                  <View
                    style={{
                      marginVertical: normalize(12),
                      flexDirection: 'row',
                      marginLeft:normalize(2),
                      alignItems: 'center',
                      marginHorizontal: normalize(12),
                    }}>
                    <CheckBox
                      containerStyles={{}}
                      value={selectedAttachment.id === ele.id}
                      ckBoxStyle={[styles.ckboxStyle]}
                      // label={ele.label}
                      handleValueChange={() => {
                        if(selectedAttachment?.id == ele?.id){
                          setselectedAttachment({});
                        }else{
                        setselectedAttachment(ele);
                        }
                      }}
                      lableStyle={{
                        fontFamily: fontFamily?.semiBold,
                        marginLeft: normalize(12),
                        color: Colors?.secondryBlack,
                      }}
                       onTintColor = {colors.PRIMARY_BACKGROUND_COLOR}
                       onFillColor = {colors.PRIMARY_BACKGROUND_COLOR}
                       tintColor ={colors.PRIMARY_BACKGROUND_COLOR}
                    />
                    {/* <ele.icon
                      width={normalize(35)}
                      height={normalize(35)}
                      marginLeft={normalize(10)}
                    /> */}

                    <View style={styles.imageNameContainer}>
                      <Text style={{fontSize: 15, marginLeft: 10}}>
                        {ele.fileName}
                      </Text>
                    </View>
                  </View>
                );
              })}
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

  ckboxStyle: {
    height: normalize(20),
    width: normalize(20),
    alignSelf: 'center',
    // backgroundColor: 'green',
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },

  ckboxStyle: {
    height: normalize(20),
    width: normalize(20),
  },
  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
});

export default AttechmentFilter;
