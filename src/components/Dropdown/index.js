import React from 'react';

import styled from 'styled-components/native';
import { Platform, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../Text';
import { fontFamily, normalize, textSizes } from '../../lib/globals';
import { Icon } from '../Icon';
import { Colors } from '../../assets/styles/colors/colors';
import { useDimensions } from '../../hooks/useDimensions';
import { useColors } from '../../hooks/useColors';

const DropdownItem = ({
  item,
  align,
  selected,
  index,
  array,
  onPress,
  hasBorder,
  itemStyle,
  ...props
}) => {
  const {colors} = useColors();

  return (
    <ItemContainer
      onPress={onPress}
      {...props}
      style={{
        backgroundColor: selected ? Colors.darkSecondaryTxt : Colors.white,
        borderBottomWidth: hasBorder ? 1 : 0,
        borderBottomColor: Colors.darkSecondaryTxt,
      }}>
      <Text
        align={align}
        style={[
          {
            color: selected ? colors?.PRIMARY_BACKGROUND_COLOR: Colors.secondryBlack,
            paddingVertical: normalize(3),
            paddingLeft: normalize(5),
          },
          itemStyle,
        ]}
        size={normalize(14)}
        fontFamily={fontFamily.semiBold}>
        {item?.value}
      </Text>
    </ItemContainer>
  );
};
export const Dropdown = ({
  list,
  label,
  selectedItem,
  handleSelection,
  zIndexVal = 0,
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
  const dropdownRef = React.useRef();
  const [showDropdownItem, setShowDropdownItem] = React.useState(false);

  const handleItemPress = React.useCallback((item) => {

    handleSelection(item);
  }, []);

  const renderItem = (item, index, array) => {
    return (
      <DropdownItem
        key={`ID-${index}`}
        item={item}
        index={index}
        array={array}
        align={align}
        selected={selectedItem?.id === item?.id}
        hasBorder={hasBorder}
        onPress={() => {
          handleItemPress(item);
          !multiSelectDrop && setShowDropdownItem(false);
        }}
      />
    );
  };
  const handleDropdownPress = () => {
    !multiSelectDrop && setShowDropdownItem(!showDropdownItem);
     onPressCb(showDropdownItem)
    dropdownState()
  };


  return (
    <View style={Platform.OS === 'ios' && { zIndex: zIndexVal }}>
      <Container style={containerStyle}>
        <DropdownContainer
          ref={dropdownRef}
          activeOpacity={0.8}
          disabled={disable}
          onPress={handleDropdownPress}
          style={[
            {
              backgroundColor: isTransparent ? 'transparent' : Colors.white,
              opacity: disable ? 0.5 : 1,
              borderWidth: hasBorder ? 1 : 0,
              borderRadius: 6,
              elevation: 0,
              borderColor: '#D9D9D9',
              width: width,
              height: height,
            },
            dropDownContainer,
          ]}>
          <Text
            size={textSizes.h11}
            fontFamily={fontFamily.semiBold}
            fontWeight="500"
            style={itemStyle}>
            {label != undefined ? label : placeholder}
          </Text>
          <Icon
            type="Entypo"
            name="chevron-down"
            color={Colors.darkSecondaryTxt}
            size={normalize(15)}
          />
        </DropdownContainer>
      </Container>
      {multiSelectDrop &&
        dropdownOpen && (
          <DropdownOverlay
            style={{
              zIndex: zIndexVal,
              position: zIndexVal > 0 ? 'absolute' : undefined,
              top: zIndexVal > 0 ? normalize(40) : undefined,
              marginTop: zIndexVal == 0 ? normalize(0) : normalize(12),
            }}
            onPress={() => {
              // setShowDropdownItem(false);
            }}>
            <DropdownBodyContainer
              style={[{ borderWidth: hasBorder ? 1 : 0, }, dropDownBodyContainer]}
              pointerEvents={'box-none'}>
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                {list.map((item, index, array) => {
                  return renderItem(item, index, array);
                })}
              </ScrollView>
            </DropdownBodyContainer>
          </DropdownOverlay>
        )}

      {!multiSelectDrop &&
        showDropdownItem && (
          <DropdownOverlay
            style={{
              zIndex: zIndexVal,
              position: zIndexVal > 0 ? 'absolute' : undefined,
              top: zIndexVal > 0 ? normalize(40) : undefined,
              marginTop: zIndexVal == 0 ? normalize(0) : normalize(12),
            }}
            onPress={() => {
              setShowDropdownItem(false);
            }}>
            <DropdownBodyContainer
              style={[{ borderWidth: hasBorder ? 1 : 0 }, dropDownBodyContainer]}
              pointerEvents={'box-none'}>
              <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                {list.map((item, index, array) => {
                  return renderItem(item, index, array);
                })}
              </ScrollView>
            </DropdownBodyContainer>
          </DropdownOverlay>
        )}
    </View>
  );
};

const Container = styled.View`
  padding: ${normalize(5)}px 0;
`;

const DropdownContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${normalize(8)}px;
  padding-left: ${normalize(4)}px;
`;

const DropdownOverlay = styled.TouchableOpacity`
  left: 0;
  right: 0;
  top: 0;
`;

const DropdownBodyContainer = styled.View`
  align-self: center;
  max-height: ${normalize(150)}px;
  width: 100%;
  border-radius: ${normalize(7)}px;
  background-color: ${Colors.white};
  overflow: hidden;
`;

const ItemContainer = styled.TouchableOpacity`
  width: 100%;
  padding: ${normalize(5)}px;
`;

Dropdown.propTypes = {
  list: PropTypes.array.isRequired,
  label: PropTypes.any,
  selectedItem: PropTypes.any,
  handleSelection: PropTypes.func.isRequired,
  zIndexVal: PropTypes.number,
  containerStyle: PropTypes.object,
  isTransparent: PropTypes.bool,
};