import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import {
  ArrowBack,
  OpenMenu,
  MenuIcon,
  MenuBurger,
} from '../../assets/img/index';
import { normalize } from '../../lib/globals';
import { NetInfoStatusIndicator } from '../NetInfoStatusIndicator';

const Header = ({
  containerStyle,
  leftIconDisable,
  onPressRightText,
  ...props
}) => {
  return (
    <>
      <NetInfoStatusIndicator />
      <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
        <View style={[styles.headerContainer, containerStyle]}>
          {props.leftIcon == 'Arrow-back' ? (
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={styles.leftIconStyle}
              disabled={leftIconDisable}>
              <ArrowBack
                fill={'blue'}
                height={normalize(16)}
                width={normalize(16)}
                style={{
                  transform: I18nManager.isRTL
                    ? [{ rotate: '180deg' }]
                    : [{ rotate: '0deg' }],
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => props.navigation.openDrawer()}
              style={styles.leftIconStyle}>
              {props.leftIcon == 'MenuBurger' ? (
                <MenuBurger
                  height={normalize(18)}
                  width={normalize(18)}
                  style={styles.MenuBurgerStyle}
                />
              ) : (
                <OpenMenu />
              )}
            </TouchableOpacity>
          )}
          <Text
            style={[
              props.headerTextStyle,
              props?.headerTextStyle
                ? { textAlign: I18nManager.isRTL ? 'left' : 'left' }
                : { textAlign: I18nManager.isRTL ? 'left' : 'right' },
              { paddingVertical: normalize(8) },
            ]}>
            {props.title ? props.title : ''}
          </Text>

          {props.headerRightText ? (
            <TouchableOpacity
              style={{ paddingVertical: normalize(10) }}
              onPress={() =>
                onPressRightText
                  ? onPressRightText()
                  : props.navigation.navigate(
                    props.headerRightTextNavigation,
                    props.navigationParams
                      ? props.navigationParams
                      : undefined,
                  )
              }>
              <Text
                style={[
                  {
                    marginRight: normalize(15),
                    fontSize: normalize(14),
                  },
                  props.rightTextStyle,
                ]}>
                {props.headerRightText}
              </Text>
            </TouchableOpacity>
          ) : null}

          {props.HeaderRightIcon &&
            props.HeaderRightIcon.map((Icon, i) => {
              return (
                <TouchableOpacity
                  style={{ alignSelf: 'center', padding: normalize(5) }}
                  onPress={() => Icon.onPress()}
                  key={`ID-${i}`}>
                  {Icon?.onPress?.name === 'handleCancelSearch' ?
                    <Icon.name
                      width={normalize(20)}
                      height={normalize(20)}
                      style={{ marginRight: normalize(10) }}
                    /> :
                    <Icon.name
                      width={normalize(23)}
                      height={normalize(23)}
                      style={{ marginRight: normalize(10) }}
                    />}
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? 15 : 0,
    paddingLeft: normalize(10),
    paddingVertical: normalize(10),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 7,
  },
  container: {
    overflow: 'hidden',
    paddingBottom: 5,
  },
  leftIconStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    //marginRight: normalize(15),
    //marginLeft: 10,
    height: normalize(40),
    width: normalize(30),
  },
  headerText: {
    paddingLeft: normalize(10),
  },
  MenuBurgerStyle: {
    marginRight: normalize(10),
  },
});

export default Header;
