import React, {memo, useEffect, useState} from 'react';

import {FlatList, Platform, ScrollView, StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Checkbox from '../CheckBox';
import {Text} from '../Text';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {Colors} from '../../assets/styles/colors/colors';
import { strings } from '../../lib/I18n';

const RenderItem = memo(
  ({
    item,
    index,
    handleValueChange,
    onFillColor,
    onTintColor,
    onCheckColor,
    style,
    labelColor,
    ckBoxStyle,
    labelStyle,
  }) => {
    return (
      <ItemContainer style={[styles.ckBoxContainerStyles, style]}>
        <Checkbox
          handleValueChange={(newValue) => {
            handleValueChange(item, index);
          }}
          ckBoxStyle={[
            {
              height: Platform.OS === 'ios' ? normalize(18) : normalize(25),
              width: Platform.OS === 'ios' ? normalize(18) : normalize(25),
            },
            ckBoxStyle,
          ]}
          onTintColor={onTintColor}
          onFillColor={onFillColor}
          onCheckColor={onCheckColor}
          tintColor={onTintColor}
          value={item?.selected}
        />
        <Text
          size={textSizes.h11}
          style={[styles.labelStyles, labelStyle]}
          color={labelColor}
          fontFamily={fontFamily.semiBold}>
          {item?.label ? strings(`RecentJobs.${item.label}`) : item.label}
        </Text>
      </ItemContainer>
    );
  },
);

const CheckList = ({
  listData,
  selectedData,
  setSelectedData,
  onTintColor = Colors?.blue,
  onFillColor = Colors?.PRIMARY_BACKGROUND_COLOR,
  onCheckColor = Colors.white,
  style,
  labelColor = Colors.black,
  ckBoxStyle,
  labelStyle,
  selectOnlyOne = false,
}) => {
  const handleValueChange = (itemSelected, index) => {
    const newData = selectedData.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      if (selectOnlyOne) {
        if (index !== i) {
          return {
            ...item,
            selected: false,
          };
        }
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setSelectedData(newData);
  };

  const renderItem = (item, index) => {
    return (
      <RenderItem
        item={item}
        index={index}
        handleValueChange={handleValueChange}
        onCheckColor={onCheckColor}
        onTintColor={onTintColor}
        onFillColor={onFillColor}
        style={style}
        labelColor={labelColor}
        ckBoxStyle={ckBoxStyle}
        labelStyle={labelStyle}
        key={`ID-${index}`}
        selectedData={selectedData}
      />
    );
  };

  return (
    <View>
      <ScrollView nestedScrollEnabled={true}>
        {selectedData.map((item, index) => {
          return renderItem(item, index);
        })}
      </ScrollView>
    </View>
  );
};

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const styles = StyleSheet.create({
  labelStyles: {
    marginLeft: Platform.OS === 'android' ? normalize(5) : normalize(10),
  },
  ckBoxContainerStyles: {
    marginBottom: Platform.OS === 'android' ? 0 : normalize(10),
    marginTop: normalize(5),
    marginLeft: normalize(1),
  },
});

CheckList.propTypes = {
  listData: PropTypes.array.isRequired,
  selectedData: PropTypes.array.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  onTintColor: PropTypes.string,
  onFillColor: PropTypes.string,
  onCheckColor: PropTypes.string,
  style: PropTypes.object,
  labelColor: PropTypes.string,
  ckBoxStyle: PropTypes.any,
  labelStyle: PropTypes.any,
};

export default CheckList;
