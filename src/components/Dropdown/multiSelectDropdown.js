import React, { useEffect, useState } from 'react';

import styled from 'styled-components/native';
import { Platform, View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../Text';
import { fontFamily, normalize, textSizes } from '../../lib/globals';
import { Icon } from '../Icon';
import { Colors } from '../../assets/styles/colors/colors';
import { useDimensions } from '../../hooks/useDimensions';
import { useColors } from '../../hooks/useColors';
import DropDownPicker from 'react-native-dropdown-picker';
import { strings } from '../../lib/I18n';

export const MultiselectDropdown = ({
  list,
  label,
  selectedItem,
  handleSelection,
  zIndexVal = 0,
  dropped,
  selectAll,
  deselect,
  containerStyle,
  isTransparent,
  initialIcon = 'down',
  hasBorder = true,
  align = 'flex-start',
  dropDownBodyContainer,
  dropDownContainer,
  itemStyle,
  placeholder = '',
  disable = false,
  width,
  height,
  onPressCb = () => null,
  dropdownState = () => null,
  dropdownOpen,
  multiSelectDrop = false,
  ...props
}) => {
  const { colors } = useColors();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([])
  const [all, setAll] = useState();

  let rsn = []

  useEffect(() => {
    if (selectedItem?.length > 0) {
      //  const reason = selectedItem?.map((item, index) => {
      //   rsn?.push(item?.id)
      //   return item.value
      let reason = []
      selectedItem?.map((item, index) => {
        list?.filter(function (res) {
          if (res?.StatusReasonId == item?.StatusReasonId) {
            rsn.push(res?.id)
            reason.push(res?.value)
          }
        })
      });
      setValue(reason)
      handleSelection(rsn);
    }
  }, [])

  useEffect(() => {
    dropped(open)
  }, [open])

  useEffect(() => {
    if (selectAll == true) {
      const allReason = list?.map((item, index) => {
        rsn?.push(item?.id)
        return item.value
      })
      setAll(1)
      setValue(allReason)
      handleSelection(rsn);
    }
    else if (selectAll == false && all == 1) {
      setValue(null)
      setAll(0)
    }
  }, [selectAll])

  const handleSelectioned = (reason) => {
    try {
      reason?.map((item, index) => {
        list?.filter(function (res) {
          if (res?.value == item) {
            rsn?.push(res?.id)
          }
        })
      });
      handleSelection(rsn);
      // setOpen(false)
    } catch (error) { }
  };

  useEffect(() => {
    const item = list?.map((obj) => {
      let object = {
        ...obj,
        icon: () => <View style={styles.iconStyle} />
      };
      return object;
    });
    setItems(item)
  }, [])

  return (
    <View style={Platform.OS === 'ios' && { zIndex: zIndexVal }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={(abc) => {
          handleSelectioned(abc)
        }}
        extendableBadgeContainer={true}
        placeholder={strings('status_update.select_reason')}
        maxHeight={Platform.OS === 'ios' ? normalize(120) : normalize(130)}
        // setItems={setItems}
        zIndex={zIndexVal}
        multiple={true}
        // min={0}
        // max={list?.length}
        style={styles.inputBox}
        arrowIconStyle={{
          width: normalize(15),
          height: normalize(15),
        }}
        tickIconStyle={{
          width: normalize(20),
          height: normalize(20),
          tintColor: '#fff',
          fontWeight: 'bold'
        }}
        placeholderStyle={{
          color: Colors?.darkPrimBtn,
        }}
        dropDownContainerStyle={[
          {
            backgroundColor: isTransparent ? 'transparent' : Colors.white,
            opacity: disable ? 0.5 : 1,
            borderWidth: hasBorder ? 1 : 0,
            borderRadius: normalize(7),
            elevation: 0,
            borderColor: '#D9D9D9',
            marginTop: open? normalize(47):normalize(10),
          },
          dropDownContainer,
        ]}
        tickIconContainerStyle={{
          padding: Platform.OS === 'ios' ? normalize(1) : 0,
          // marginRight:8,
          borderRadius: normalize(5),
          backgroundColor: Colors.primaryColor,
          position: 'absolute'
        }}
        itemSeparator={true}
        showTickIcon={true}
        mode={"BADGE"}
        extendableBadgeContainer={true}
        itemSeparatorStyle={{
          backgroundColor: Colors?.borderGrey
        }}
        showBadgeDot={false}
      />
    </View>
  );
};

const ItemContainer = styled.TouchableOpacity`
  width: 100%;
  padding: ${normalize(5)}px;
`;

MultiselectDropdown.propTypes = {
  list: PropTypes.array.isRequired,
  label: PropTypes.any,
  selectedItem: PropTypes.any,
  handleSelection: PropTypes.func.isRequired,
  zIndexVal: PropTypes.number,
  containerStyle: PropTypes.object,
  isTransparent: PropTypes.bool,
};

const styles = StyleSheet.create({
  inputBox: {
    height: normalize(40),
    borderRadius: normalize(7),
    borderColor: Colors?.borderGrey,
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    marginTop: normalize(10)
  },
  iconStyle: {
    width: Platform.OS === 'ios' ?normalize(23):normalize(19),
    height: Platform.OS === 'ios' ?normalize(23):normalize(19),
    borderWidth: normalize(2),
    borderRadius: Platform.OS === 'ios' ?normalize(4):normalize(2),
  },
})