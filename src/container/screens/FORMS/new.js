import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NestedDropDown} from '../../../components/NestedDropDown';
import {Colors} from '../../../assets/styles/colors/colors';
import {normalize, fontFamily} from '../../../lib/globals';

export const New = () => {
  const list = [
    {id: '1', value: 'Non Taxable', selected: false},
    {id: '2', value: 'Taxes', selected: false},
    {id: '3', value: 'Tax Group', selected: false},
  ];
  const subList = [
    {id: '2', mainValue: 'Taxes', selected: false, value: 'dummy1'},
    {id: '3', mainValue: 'Tax Group', selected: false, value: 'dummy2'},
    {id: '5', mainValue: 'Taxes', selected: false, value: 'dummy3'},
    {id: '6', mainValue: 'Tax Group', selected: false, value: 'dummy4'},
  ];
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  return (
    <NestedDropDown
      style={styles.dropDownWrap}
      hasBorder={true}
      label={'NestedDropdown'}
      list={list}
      subList={subList}
      selectedItem={selectedItem}
      handleSelection={setSelectedItem}
      selectedCategory={selectedCategory}
      handleSelectionCategory={setSelectedCategory}
      zIndexVal={0}
      align={'flex-start'}
      dropDownContainer={styles.dropDownContainerStyle}
      dropDownBodyContainer={styles.dropDownBodyContainerStyle}
      itemStyle={styles.dropdownTextStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: 'black',
  },
  dropDownBodyContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 2,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(7),
  },
});
