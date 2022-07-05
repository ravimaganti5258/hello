import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { equipments } from '../../../assets/jsonData';
import { Colors } from '../../../assets/styles/colors/colors';
import Cards from '../../../components/Cards';
import { Icon } from '../../../components/Icon';
import { Text } from '../../../components/Text';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { Images } from '../../../lib/Images';
import { FEATHER } from '../../../util/iconTypes';

const OptionButtons = ({
  image = '',
  optText = '',
  containerStyles,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.optionButton, ...containerStyles }}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.optionContainer}>
        <Image source={image} style={styles.optionIcon} />
        <Text size={textSizes.h12} fontFamily={fontFamily.medium}>
          {optText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Equipments = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Equipments (${equipments?.length})`,
    });
  }, [navigation]);

  const listHeaderComponent = () => {
    return (
      <>
        <View style={styles.headerViewContainer}>
          <View style={styles.userNameContainer}>
            <Icon
              type={FEATHER}
              name={'user'}
              size={normalize(22)}
              style={{ marginRight: normalize(5) }}
              color={Colors.white}
            />
            <Text color={Colors.white} fontFamily={fontFamily.medium}>
              Aaron Williams
            </Text>
          </View>
          <Text color={Colors.white} fontFamily={fontFamily.medium}>
            {strings('common.job')} # 22145004
          </Text>
        </View>
        <View style={styles.optionButtonContainer}>
          <OptionButtons image={Images.scanIcon} optText={strings('Equipments.scan')} />
          <OptionButtons image={Images.addIcon} optText={strings('Equipments.add_new')} />
          <OptionButtons image={Images.addExisting} optText={strings('Equipments.add_existing')} />
        </View>
      </>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemContainer}>
        <Cards
          type={strings('Equipments.equipment')}
          containerStyles={{ alignSelf: 'center' }}
          equipmentModel={item?.model}
          equipmentBrand={item?.brand}
          equipmentSerialNo={item?.equipmentSerialNo}
          tagNumber={item?.equipmentTagNo}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={equipments}
          renderItem={renderItem}
          keyExtractor={(item, index) => `ID-${index}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeaderComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default Equipments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.extraLightGrey,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: Colors.extraLightGrey,
    zIndex: 100,
  },
  headerViewContainer: {
    backgroundColor: Colors.secondryBlue,
    flexDirection: 'row',
    borderBottomLeftRadius: normalize(12),
    borderBottomRightRadius: normalize(12),
    justifyContent: 'space-between',
    padding: normalize(10),
    alignItems: 'center',
    marginBottom: normalize(4),
    paddingHorizontal: normalize(15),
  },
  optionIcon: {
    marginRight: normalize(5),
    height: normalize(13),
    width: normalize(13),
    resizeMode: 'contain',
  },
  optionButton: {
    padding: normalize(2),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonContainer: {
    flexDirection: 'row',
    padding: normalize(7),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderItemContainer: {
    marginHorizontal: normalize(8),
    marginVertical: normalize(4),
  },
});
