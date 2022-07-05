import React, { memo, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../../assets/styles/colors/colors';
import CheckBox from '../../../../components/CheckBox';
import { Input } from '../../../../components/Input';
import { ModalContainer } from '../../../../components/Modal';
import MultiButton from '../../../../components/MultiButton';
import { Text } from '../../../../components/Text';
import { useColors } from '../../../../hooks/useColors';
import { useDimensions } from '../../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import { ANT_DESIGN } from '../../../../util/iconTypes';

const listData = [
  {
    id: 1,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
  {
    id: 2,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
  {
    id: 3,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
  {
    id: 4,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
  {
    id: 5,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
  {
    id: 6,
    serialNo: 'REC1007',
    expDate: '22/10/2022',
  },
];

//render item for serial number with checkbox 
const SerialNoRenderItem = memo(({ item, index, setSerialNo, serialNo }) => {
  const expDate = item?.ExpiryDate != null && item?.ExpiryDate != "" ?
    item?.ExpiryDate?.split('-') : ''

  const { colors } = useColors();
  return (
    <View style={styles.renderItemContainer}>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          ckBoxStyle={styles.ckboxStyle}
          value={item?.selected}
          disabled={false}
          handleValueChange={(val) => {
            if (val === true) {
              let serial = [...serialNo]
              serial.push(item);
              setSerialNo(serial);
            }
          }}
          onTintColor={colors.PRIMARY_BACKGROUND_COLOR}
          onFillColor={colors.PRIMARY_BACKGROUND_COLOR}
          tintColor={Colors.darkGray}

        />
        <Text style={[styles.labelTxt, { marginLeft: normalize(10) }]}>
          {item?.SerialNo}
        </Text>
      </View>
      {expDate != '' ?
        <Text style={[styles.labelTxt, { marginRight: normalize(25) }]}>{expDate[2]?.split('T')[0] + '/' + expDate[1] + '/' + expDate[0]}</Text>
        : null}
    </View>
  );
});

// modal for serial number search and scan
const SerialNoSearchModal = ({
  handleModalVisibility,
  visibility,
  Data,
  onPress,
  searchOnPress,
  searchOnchangeTxt,
}) => {
  const [serialNoList, setSerialNoList] = useState(listData);
  const [serialNoArrays, setserialNoArrays] = useState([]);

  const { colors } = useColors();
  const { height } = useDimensions();

  const setModelData = () => {
    let data = {
      serialnoDataList: serialNoArrays,
    };

    onPress(data);
  };

  const buttons = [
    {
      btnName: strings('pair_button.cancel'),
      onPress: () => handleModalVisibility(),
      btnTxtStyles: styles.cancelBtnTxt,
      btnStyles: { backgroundColor: Colors?.silver },
    },
    {
      btnName: strings('pair_button.add'),
      onPress: () => handleSave(),
      btnTxtStyles: styles.addBtnTxt,
      btnStyles: { backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR },
    },
  ];

  const handleSave = () => {
    setModelData();
  };

  //function for serial list
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelection(index)}
        style={styles.renderItem}>
        <SerialNoRenderItem
          key={`ID-${index}`}
          item={item}
          index={index}
          setSerialNo={setserialNoArrays}
          serialNo={serialNoArrays}
        />
      </TouchableOpacity>
    );
  };

  const handleSelection = (selectedIndex) => {
    try {
      const reqData = serialNoList?.map((item, index) => {
        if (index == selectedIndex) {
          return {
            ...item,
            selected: !item?.selected,
          };
        }
        return { ...item };
      });
      setSerialNoList(reqData);
    } catch (error) { }
  };

  const keyExtractor = (item, index) => `ID-${index}`;
  //ui design for serial modal in parts screen
  return (
    <ModalContainer
      handleModalVisibility={handleModalVisibility}
      visibility={visibility}
      containerStyles={{ top: 50 }}>
      <View style={[styles.container, { maxHeight: height / 1.4 }]}>
        <Input
          containerStyle={styles.inputDataContainer}
          inputContainer={styles.inputContainer}
          style={{
            fontSize: textSizes.h12,
            fontFamily: fontFamily.semiBold,
          }}
          iconType={ANT_DESIGN}
          icon={'search1'}
          iconStyle={styles.searchIconStyles}
          onChangeText={searchOnchangeTxt}
          placeholder={'Search'}
          iconAction={searchOnPress}
        />
        <View style={styles.searchHeader}>
          <Text style={styles.heading}>
            {strings('PARTDETAILS.Serial#')}
          </Text>
          <Text style={styles.heading}>
            {strings('PARTDETAILS.Warranty_Expiry')}
          </Text>
        </View>
        {Data?.length > 0 ? (
          <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        ) : (
          <View
            style={styles.nodata}>
            <Text size={normalize(16)}>
              {strings('common.dataNotFound')}
            </Text>
          </View>
        )}
        <MultiButton
          buttons={buttons}
          constinerStyles={styles.bottomBtnContainer}
        />
      </View>
    </ModalContainer>
  );
};

export default SerialNoSearchModal;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(23),
  },
  inputDataContainer: {
    borderWidth: normalize(1),
    borderColor: Colors?.darkSecondaryTxt,
    borderRadius: normalize(6),
    paddingHorizontal: normalize(5),
  },
  searchIconStyles: {
    height: normalize(15),
    width: normalize(15),
  },
  inputContainer: {
    marginTop: normalize(0),
  },
  nodata:{ 
    padding: normalize(10), 
    height: normalize(150), 
    justifyContent: 'center' 
},
  renderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderItem: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors?.greyBorder,
    paddingVertical: normalize(15),
  },
  ckboxStyle: {
    height: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    width: Platform.OS === 'ios' ? normalize(18) : normalize(25),
  },
  labelTxt: {
    fontSize: normalize(13),
  },
  bottomBtnContainer: {
    paddingHorizontal: normalize(25),
    backgroundColor: Colors?.white,
    paddingVertical: normalize(13),
    marginTop: normalize(32)
  },
  cancelBtnTxt: {
    fontSize: normalize(14),
  },
  addBtnTxt: {
    fontSize: normalize(14),
    color: Colors?.white,
  },
  heading: {
    fontFamily: fontFamily?.bold,
    fontSize: normalize(12)
  },
  searchHeader: {
    backgroundColor: '#F5F5F5',
    height: normalize(40),
    flexDirection: 'row',
    justifyContent: "space-between",
    opacity: 1,
    padding: normalize(8),
    marginTop: normalize(19),
    borderBottomWidth: 0.25
  },
});
