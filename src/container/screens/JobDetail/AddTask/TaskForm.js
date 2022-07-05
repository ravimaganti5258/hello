import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../../assets/styles/colors/colors';
import { Dropdown } from '../../../../components/Dropdown';
import { Text } from '../../../../components/Text';
import { normalize, fontFamily } from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import { emptyDropDown } from '../../../../util/helper';

const TaskForm = ({
  label,
  list,
  seletedField,
  setItem,
  list2,

  selectedField2,
  setItem2,
  selectedWorkType,

  type = 'task',
  containerStyle,
  mandatory = false,
  isDisable,
  onPressCb,
  dropdownOpen,
  dropDownOpen2,
  dropdownState = () => null,
  dropdownState2 = () => null,
  multiSelectDrop = false,
}) => {
  let disable =
    label == 'work_request' && Object.keys(selectedWorkType).length === 0
      ? true
      : isDisable;



  return (
    <View style={[{ paddingVertical: normalize(12) }, containerStyle]}>
      <Text
        align={'flex-start'}
        color={'#000000'}
        style={styles.textHeadingStyle}>
        {mandatory && <Text color={Colors.red}>{'* '}</Text>}
        {type === 'task' ? strings(`add_new_task.${label}`) : label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 1 }}>
          <Dropdown
            style={styles.dropDownWrap}
            hasBorder={true}
            label={seletedField?.label}
            list={list}
            dropdownOpen={dropdownOpen}
            dropdownState={() => dropdownState()}
            selectedItem={seletedField}
            handleSelection={(val) => setItem(val)}
            zIndexVal={0}
            align={'flex-start'}
            placeholder={strings('add_new_task.Select')}
            disable={disable}
            dropDownContainer={{
              borderColor: Colors.darkSecondaryTxt,
              borderRadius: normalize(10),
            }}
            onPressCb={onPressCb}
            dropDownBodyContainer={{
              borderColor: Colors.darkSecondaryTxt,
              elevation: 4,
              height: label == 'duration' ? normalize(120) : 'auto'
            }}
            itemStyle={styles.dropdownTextStyle}
            multiSelectDrop={multiSelectDrop}
          />
        </View>
        {label == 'duration' && (
          <View style={{ flex: 1, paddingLeft: normalize(20) }}>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={selectedField2?.label}
              list={list2}
              selectedItem={selectedField2}
              handleSelection={setItem2}
              zIndexVal={0}
              onPressCb={onPressCb}
              dropdownOpen={dropDownOpen2}
              dropdownState={() => dropdownState2()}
              placeholder={strings('add_new_task.Select')}
              align={'flex-start'}
              dropDownContainer={{
                borderColor: Colors.darkSecondaryTxt,
                borderRadius: normalize(10),
              }}
              dropDownBodyContainer={{
                borderColor: Colors.darkSecondaryTxt,
                elevation: 4,
                height: normalize(120)
              }}
              itemStyle={styles.dropdownTextStyle}
              multiSelectDrop={multiSelectDrop}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textHeadingStyle: {
    paddingLeft: normalize(5),
    fontFamily: fontFamily.regular,
    fontSize: normalize(13)
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
    backgroundColor: 'yellow'
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    fontSize: normalize(14),
    padding: normalize(5),
    color: Colors.black,
  },
});

export default TaskForm;
