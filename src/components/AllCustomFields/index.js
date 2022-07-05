import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, I18nManager } from 'react-native';
import TaskForm from '../../container/screens/JobDetail/AddTask/TaskForm';
import { dateFormat, fontFamily, normalize } from '../../lib/globals';
import FormFields from '../FormCompoent/FormFields';
import { Text } from '../Text/index';
import CheckBoxComponent from '../CustomCheckbox/index';
import { Calender } from '../../assets/img';
import LabelComponent from '../LableComponent/index';
import { Colors } from '../../assets/styles/colors/colors';
import DatePickerModal from '../../container/screens/JobDetail/PartsAttachments/DatePickerModal';
import { useColors } from '../../hooks/useColors';
import { emptyDropDown } from '../../util/helper';

//Render  custom compoennets fields based on type
const FieldsType = ({ data, setCustomFilledData, editable }) => {
  const [selectedDropDown, setSelectedDropDown] = useState([]);
  const [showDatePicker, setDatePicker] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(-1);
  const { colors } = useColors();
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };

  const RenderCustomeFieldHeader = ({ value }) => {
    return (
      value !== '' && (
        <Text
          align={'flex-start'}
          style={[
            {
              backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
            },
            styles.customHeadingText,
          ]}>
          {value}
        </Text>
      )
    );
  };

  const [dropDownIndex, setDropDownIndex] = useState(-1);
  const RenderFields = ({ item, id }) => {

    const [input, setinput] = useState(item?.Value);
    const updateFormValue = (val, index) => {
      let form = [...data];
      form[index].Value = val;
      setCustomFilledData(form);
    };
    const onPressSingleCheckBox = (index) => {
      let form = [...data];
      form[index].IsActive = !form[index].IsActive;
      setCustomFilledData(form);
    };

    switch (item?.FieldTypeId) {
      // Text Field
      case 1:
        return (
          <>
            <RenderCustomeFieldHeader value={item?.HeadingName} />
            <FormFields
              label={item?.FieldName}
              rightIcon={false}
              complusory={false}
              editable={editable == false ? editable : true}
              containerStyle={{ marginVertical: normalize(5) }}
              onEndEditing={(val) => {
                updateFormValue(input, id);
              }}
              value={input}
              setValue={setinput}
            />
          </>
        );

      //date
      case 3:
        return (
          <View style={{ marginTop: normalize(15) }}>
            <RenderCustomeFieldHeader value={item?.HeadingName} />
            <LabelComponent
              label={item?.FieldName}
              labelStyle={styles.feeddbacklabelStyle}
              style={{ marginVertical: normalize(2), paddingLeft: normalize(5)}}
              required={item?.IsMandatory}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setSelectedDateIndex(id);
                toggleDatePicker();
              }}
              style={styles.calenderInputContainer}>
              <Text style={styles.dateTxtStyles}>
                {item?.Value != null
                  ? dateFormat(item?.Value, 'DD/MM/YYYY')
                  : ''}
              </Text>
              <Calender height={normalize(21)} width={normalize(23)} />
            </TouchableOpacity>
          </View>
        );
      //"Dropdown

      case 5:
        const values = item?.CustomFieldDropdown?.map((ele) => {
          let obj = {
            id: ele.DropdownId,
            label: ele.DropdownValue,
            value: ele.DropdownValue,
            ...ele,
          };
          return obj;
        });

        let sel = [];
        values.map((ele) => {
          if (ele.id == item?.Value) {
            sel.push(ele);
          }
        });

        return (
          <View>
            <RenderCustomeFieldHeader value={item?.HeadingName} />
            <TaskForm
              label={item.FieldName}
              isDisable={editable == false ? true : false}
              list={values.length > 0 ? values : emptyDropDown}
              seletedField={sel[0]}
              setItem={(val) => {
                // handleDropdown(val, id);
                updateFormValue(val?.id, id);
                setDropDownIndex(-1)
              }}
              type={'Main form'}
              mandatory={item?.IsMandatory}
              dropdownOpen={dropDownIndex === id}
              multiSelectDrop={true}
              dropdownState={() => {
                setDropDownIndex(id)
              }}

            />
          </View>
        );
      //Checkbox single checkbox
      case 6:
        return (
          <View style={{ marginVertical: normalize(5) }}>
            <RenderCustomeFieldHeader value={item?.HeadingName} />
            <View style={{ marginLeft: normalize(5) }}>
              <CheckBoxComponent
                onChange={() => {
                  onPressSingleCheckBox(id);
                }}
                check={item?.IsActive}
                label={item?.FieldName}
                containerStyle={{
                  padding: normalize(5),
                }}
                CheckBoxWrapStyle={{ borderWidth: 2 }}
                labelStyle={{ fontFamily: fontFamily.semiBold }}
              />
            </View>
          </View>
        );

      //default
      default:
        return <View></View>;
    }
  };

  return (
    <>
      {data.map((ele, id) => {
        return <RenderFields item={ele} id={id} key={id.toString()} />;
      })}

      {showDatePicker ? (
        <DatePickerModal

          handleModalVisibility={toggleDatePicker}
          visibility={showDatePicker}
          selectedDate={
            data[selectedDateIndex]?.Value != ''
              ? data[selectedDateIndex]?.Value
              : ''
          }
          setDate={(val) => {
            if (val != '') {
              let form = [...data];
              form[selectedDateIndex].Value = val;
              setCustomFilledData(form);
            }

          }}
        />
      ) : null}
    </>
  );
};

//All custom fields
const AllCustomeFields = ({ CustomFields, setCustomFiledData, editable, callback }) => {
  const updateAllCustomFields = (res) => {
    let data = { ...CustomFields, CustomFields: res };
    setCustomFiledData(data);
  };

  switch (CustomFields?.PanelId) {
    // Technician Job Details-Other Information Panel
    case 33:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );
      break;
    // Mobile -Job Details
    case 60:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    // Mobile Other Information Panel
    case 59:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );
    //Technician Job Details-Job Details Panel
    case 28:
      return (
        <View>
          {/* <Text>{CustomFields?.PanelName}</Text> */}
          <FieldsType
            data={CustomFields?.CustomFields}
            editable={editable}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    //Technician Job Details-Add Job Popup
    case 29:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    //Technician Job Details-Edit Job Popup
    case 30:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    //Technician Job Details-Add Equipment Popup
    case 31:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    //Technician Job Details-Edit Equipment Popup
    case 32:
      return (
        <View>
          <FieldsType
            data={CustomFields?.CustomFields}
            setCustomFilledData={(data) => {
              updateAllCustomFields(data);
            }}
          />
        </View>
      );

    //default
    default:
      return <View />;
  }

  // // return CustomFields.map((item, index) => {
  // return customeFiledsBasedonPanel();
  // // });
};
export default AllCustomeFields;

const styles = StyleSheet.create({
  dateTxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(10),
    textAlign: 'left',
    
  },
  feeddbacklabelStyle: {
    fontSize: normalize(14),
  },
  calenderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    borderRadius: normalize(8),
    marginTop: normalize(8),
    paddingRight: normalize(10),
  },
  customHeadingText: {
    color: Colors?.white,
    padding: normalize(7),
    marginLeft: normalize(2),
    marginTop: normalize(5),
    marginBottom: normalize(5),
  },
});
