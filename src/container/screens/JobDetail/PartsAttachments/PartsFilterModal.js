import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../../../../lib/I18n';
import { Input } from '../../../../components/Input';
import { ModalContainer } from '../../../../components/Modal';
import { Text } from '../../../../components/Text';
import { useDimensions } from '../../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../../lib/globals';
import { Colors } from '../../../../assets/styles/colors/colors';
import { Dropdown } from '../../../../components/Dropdown';
import Button from '../../../../components/Button';
import { useNetInfo } from '../../../../hooks/useNetInfo';
import { MATERIAL_ICONS } from '../../../../util/iconTypes';
import { useColors } from '../../../../hooks/useColors.js';

const LabelComponents = ({ label }) => {
  return (
    <Text align={'flex-start'} size={normalize(13)}>
      {label}
    </Text>
  );
};

const PartsFilterModal = ({
  visibility,
  handleModalVisibility,
  title,
  brandList,
  modelList,
  selectedBrand,
  selectedModel,
  handleBrandSelection,
  handleModelSelection,
  openScan,
  onChangeDescription,
  description,
  onPartNoChange,
  partNo,
  onApplyFilter,
}) => {
  const { height } = useDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useColors();
  const handleApplyFilter = () => {
    try {
      onApplyFilter ? onApplyFilter() : null;
      handleModalVisibility();
    } catch (error) { }
  };

  const { isConnected } = useNetInfo();

  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}
      containerStyles={{
        ...styles.modalContainer,
        top: !isConnected
          ? Platform.OS === 'ios'
            ? normalize(120) + insets.top
            : normalize(16 + 70)
          : normalize(50) + insets.top,
      }}
      overlayStyles={{
        top: !isConnected
          ? Platform.OS === 'ios'
            ? normalize(110) + insets.top
            : normalize(16 + 70)
          : Platform.OS === 'ios'
            ? normalize(43) + insets.top
            : normalize(58),
      }}
      >
      <View style={[styles.container, { maxHeight: height / 1.4 }]}>
        <View style={[styles.triangle]} />
        <KeyboardAvoidingView
          behavior={'padding'}
          keyboardVerticalOffset={normalize(115)}
          enabled>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <Text
              align={'flex-start'}
              size={textSizes.h10}
              style={{ marginBottom: normalize(17) }}
              fontFamily={fontFamily.bold}>
              {title}
            </Text>

            <View style={{ marginTop: normalize(10) }}>
              <LabelComponents label={strings('PartsFilterModal.Brand')} />
              <Dropdown
                list={brandList}
                handleSelection={handleBrandSelection}
                selectedItem={selectedBrand}
                label={selectedBrand?.label || strings('PartsFilterModal.Select')}
                dropDownBodyContainer={styles.dropDownBorder}
                dropDownContainer={{
                  ...styles.dropDownBorder,
                  marginTop: normalize(7),
                }}
              />
            </View>

            <View style={styles.fieldContainer}>
              <LabelComponents label={strings('PartsFilterModal.Model')} />
              <Dropdown
                list={modelList}
                handleSelection={handleModelSelection}
                selectedItem={selectedModel}
                label={selectedModel?.label || strings('PartsFilterModal.Select')}
                dropDownBodyContainer={styles.dropDownBorder}
                dropDownContainer={{
                  ...styles.dropDownBorder,
                  marginTop: normalize(7),
                }}
              />
            </View>

            <View style={styles.fieldContainer}>
              <LabelComponents label={strings('PartsFilterModal.Part')} />
              <Input
                containerStyle={styles.inputContainerStyles}
                inputContainer={{ marginTop: normalize(10) }}
                iconType={MATERIAL_ICONS}
                icon={'qr-code'}
                iconSize={normalize(20)}
                style={{ fontSize: normalize(14) }}
                iconAction={openScan}
                onChangeText={onPartNoChange}
                value={partNo}
              />
            </View>

            <View style={styles.fieldContainer}>
              <LabelComponents label={strings('PartsFilterModal.Description')} />
              <Input
                containerStyle={styles.inputContainerStyles}
                inputContainer={{
                  marginTop: normalize(10),
                  marginBottom: normalize(25),
              }}
                style={{ fontSize: normalize(14) }}
                onChangeText={onChangeDescription}
                value={description}
              />
            </View>
            <Button
              title={strings('PartsFilterModal.Apply')}
              txtStyle={styles.applyBtnTxt}
              style={[styles.applyBtnStyles,{backgroundColor:colors?.PRIMARY_BACKGROUND_COLOR}]}
              onClick={handleApplyFilter}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ModalContainer>
  );
};

export default PartsFilterModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(23),
  },
  modalContainer: {
    width: '95%',
    borderRadius: normalize(8),
    marginTop: Platform.OS === 'ios' ? normalize(3) : normalize(-23),

  },
  ckBoxStyles: {
    marginLeft: Platform.OS === 'android' ? -normalize(10) : 0,
  },
  inputContainerStyles: {
    borderWidth: normalize(1),
    borderRadius: normalize(7),
    borderColor: Colors.darkSecondaryTxt,
    height: normalize(40),
  },
  labelStyles: {
    fontSize: normalize(13),
    alignSelf: 'flex-start',
  },
  ckBoxRowStyles: {
    marginBottom: normalize(11),
    marginTop: normalize(11),
    marginLeft: normalize(3),
  },
  categoryContainer: {
    marginVertical: normalize(15),
  },
  crewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(28),

  },
  crewTextStyles: {
    marginLeft: normalize(10),
    fontSize: textSizes.h11,
    fontFamily: fontFamily.semiBold,
  },
  applyBtnStyles: {
    width: '100%',
    // backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
    borderRadius: normalize(100),
    height: normalize(36),
  },
  applyBtnTxt: {
    fontSize: textSizes.h11,
    color: Colors.white,
  },
  inputStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.semiBold,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(20),
    borderRightWidth: normalize(20),
    borderBottomWidth: normalize(20),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -normalize(9),
    right: normalize(28),
  },
  dropDownBorder: {
    borderColor: Colors?.greyBorder,

  },
  fieldContainer: {
    marginTop: normalize(25),

  },
});
