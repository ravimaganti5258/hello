import React, {useEffect, useState} from 'react';

import {I18nManager, View} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import {Text} from '../Text';
import {fontFamily, normalize, textSizes} from '../../lib/globals';
import {Icon} from '../Icon';
import {FEATHER, FONT_AWESOME} from '../../util/iconTypes';
import {Colors} from '../../assets/styles/colors/colors';

export const Input = ({
  placeholder,
  style,
  value,
  keyboardType = 'default',
  secureTextEntry = false,
  editable,
  onFocus,
  onBlur,
  onChangeText,
  maxLength,
  autoCorrect,
  icon,
  label,
  labelTextStyle,
  iconAction,
  height = normalize(40),
  errorText,
  validationType,
  iconStyle,
  inputColor = Colors.black,
  iconSize = normalize(16),
  multiline = false,
  iconType = FEATHER,
  onEndEditing,
  containerStyle,
  placeHolderStyles,
  rightIcon,
  rightIconName,
  inputContainer,
  labelStyles,
  openEyeIconStyles,
  inputRightText,
  inputRightTextStyles,
  ...props
}) => {
  const [sPassword, setSPassword] = React.useState(secureTextEntry);
  const [error, setError] = useState('');
  useEffect(() => {
    validationSwitch(validationType);
  }, [validationType]);

  const validationSwitch = (validationType) => {
    switch (validationType) {
      case 'req':
        if (value.length < 1) {
          setError('Required Field');
        } else {
          setError('');
        }
        break;
      case 'email':
        var mail =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!mail.test(value)) {
          setError('Invalid Email Id');
        } else {
          setError('');
        }
        break;
      case 'phone':
        if (value.length < 10 || value.length > 10) {
          setError('Invalid phone number');
        } else {
          setError('');
        }
      case 'mobile':
          if (value.length < 10 || value.length > 10) {
            setError('Invalid mobile number');
          } else {
            setError('');
          }
      default:
        break;
    }
  };
  return (
    <View>
      <InputContainer style={inputContainer}>
        <View style={{flex: 1}}>
          {label && (
            <Text
              align={'flex-start'}
              style={[
                {
                  paddingLeft: 2,
                  color: editable == false ? Colors.darkGray : inputColor,
                },
                labelStyles,
              ]}
              fontWeight="500">
              {label}
            </Text>
          )}
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: errorText ? Colors.darkRed : 'grey',
                paddingRight: 10,
              },
              containerStyle,
            ]}>
            <InputBox
              style={[
                {
                  color: editable == false ? Colors.darkGray : inputColor,
                  flex: 1,textAlign:I18nManager.isRTL?'right':'left'
                },
                style,
              ]}
              fontStyle={value == '' ? 'italic' : 'normal'}
              height={style?.height || height}
              placeholder={placeholder}
              value={value}
              keyboardType={keyboardType}
              secureTextEntry={sPassword}
              editable={editable}
              multiline={multiline}
              autoCapitalize={'none'}
              onFocus={onFocus}
              onBlur={onBlur}
              onEndEditing={onEndEditing}
              onChangeText={onChangeText}
              maxLength={maxLength}
              autoCorrect={autoCorrect}
              color={inputColor}
              placeholderTextColor={
                inputColor == Colors.black ? '#a9a9a9' : '#989898'
              }
            />

            {icon == 'eye' || icon == 'eye-off' ? (
              <InputIcon
                type={iconType}
                name={sPassword ? 'eye-off' : 'eye'}
                onPress={() => setSPassword((prevVal) => !prevVal)}
                size={iconSize}
                color={inputColor == Colors.black ? Colors.darkGray : '#989898'}
                style={
                  !sPassword && openEyeIconStyles
                    ? openEyeIconStyles
                    : iconStyle
                }
              />
            ) : (
              <InputIcon
                type={iconType}
                style={iconStyle}
                onPress={iconAction}
                name={icon}
                size={iconSize}
                color={inputColor == 'black' ? 'gray' : '#989898'}
              />
            )}
            {rightIcon && rightIcon}
            {inputRightText && (
              <Text style={inputRightTextStyles}>{inputRightText}</Text>
            )}
          </View>
        </View>
      </InputContainer>
      {errorText ? (
        <ErrorText
          color={inputColor == 'black' ? Colors.darkRed : Colors.primaryColor}>
          {errorText}
        </ErrorText>
      ) : null}
    </View>
  );
};

const ErrorText = styled(Text)`
  align-self: flex-start;
  font-size: ${textSizes.h12}px;
  margin-left: ${normalize(3)}px;
  margin-top: ${normalize(3)}px;
  color: ${({color}) => color};
`;

const InputContainer = styled.View`
  margin-top: ${normalize(20)}px;
  width: 100%;
  flex-direction: row;
`;

const InputBox = styled.TextInput`
  width: 100%;
  padding-left: ${normalize(3)}px;
  font-size: ${textSizes.h9}px;
  
`;

const InputIcon = styled(Icon)``;

Input.propTypes = {
  placeholder: PropTypes.string,
  style: PropTypes.any,
  value: PropTypes.any,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  editable: PropTypes.bool,
  onFocus: PropTypes.any,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  maxLength: PropTypes.number,
  autoCorrect: PropTypes.any,
  icon: PropTypes.any,
  label: PropTypes.string,
  iconAction: PropTypes.any,
  height: PropTypes.number,
  errorText: PropTypes.string,
  validationType: PropTypes.string,
  iconStyle: PropTypes.any,
  inputColor: PropTypes.string,
  iconSize: PropTypes.number,
  multiline: PropTypes.bool,
  iconType: PropTypes.string,
};
