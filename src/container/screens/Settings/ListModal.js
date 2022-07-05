import React from 'react';

import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';

import { Icon } from '../../../components/Icon';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { FEATHER } from '../../../util/iconTypes';

const ListModal = ({
  visibility,
  handleModalVisibility,
  data,
  title,
  handleAction,
  type
}) => {

  const { height } = useDimensions();
  const renderItem = ({ item }) => {
    switch (type) {
      case 'theme': {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => {
              handleAction(item?.name);
              handleModalVisibility();
            }}>
            <View
              style={[styles.itemConatiner, { backgroundColor: item?.color }]}
            />
            <Text size={textSizes.h11}>{strings(`settings.${item?.name}`)}</Text>
          </TouchableOpacity>
        );
      }
      case 'language': {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              { flexDirection: 'column', paddingVertical: normalize(10) },
            ]}
            onPress={() => {
              handleAction(item?.LanguageName == 'Arabic' ? 'ar' : 'en');
              handleModalVisibility();
            }}>
            <Text align={'flex-start'}>{item?.LanguageName}</Text>
            <Text
              align={'flex-start'}
              color={Colors.darkGray}
              size={textSizes.h11}>
              {item?.LanguageName == 'Arabic' ? strings(`settings.${item?.LanguageName}`) :
                item?.LanguageName}

            </Text>
          </TouchableOpacity>
        );
      }
      case 'screen': {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              { flexDirection: 'column', paddingVertical: normalize(10) },
            ]}
            onPress={() => {
              handleAction(item?.name);
              handleModalVisibility();
            }}>
            <Text align={'flex-start'}>{strings(`settings.${item?.displayName}`)}</Text>
            <Text
              align={'flex-start'}
              color={Colors.darkGray}
              size={textSizes.h11}>
              {strings(`settings.${item?.name}`)}
            </Text>
          </TouchableOpacity>
        );
      }
    }
  };

  return (
    <ModalContainer
      visibility={visibility}
      handleModalVisibility={handleModalVisibility}>
      <View style={[styles.container, { maxHeight: height / 2 }]}>
        <View style={styles.titleContainer}>
          <Text size={textSizes.h9} fontFamily={fontFamily.bold}>
            {title}
          </Text>
          <Icon
            type={FEATHER}
            name={'x'}
            size={normalize(20)}
            onPress={handleModalVisibility}
          />
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `ID-${index}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ModalContainer>
  );
};

export default ListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: normalize(20),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
  },
  itemConatiner: {
    height: normalize(17),
    width: normalize(20),
    borderRadius: normalize(3),
    marginRight: normalize(10),
  },
});
