import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ModalContainer } from '../../../../components/Modal';
import DatePicker from '../../../../components/DatePicker/index';
import { fontFamily, normalize, timeFormat } from '../../../../lib/globals';
import { Text } from '../../../../components/Text';
import { useDimensions } from '../../../../hooks/useDimensions';
import MultiButton from '../../../../components/MultiButton';
import { Colors } from '../../../../assets/styles/colors/colors';
import { useColors } from '../../../../hooks/useColors';
import TimePicker from '../../../../components/TimePicker';
import { FlashMessageComponent } from '../../../../components/FlashMessge';
import { strings } from '../../../../lib/I18n';

const DatePickerModal = ({
  handleModalVisibility,
  visibility,
  setDate,
  selectedDate,
  title = strings('DatePickerModal.Select_Date'),
  type = 'calender',
  startTimePicked = new Date(),
  setStartTimePicked,
}) => {
  const [markedDate, setMarkedDate] = useState({});

  const { height } = useDimensions();
  const { colors } = useColors();

  //array for buttons of date picker
  const buttons = [
    {
      btnName: strings('DatePickerModal.Cancel'),
      onPress: () => (type == 'calender' ? handleCancel() : handleTimeCancel()),
      btnStyles: styles.btnStyles,
      btnTxtStyles: { ...styles.btnTxtStyles, color: Colors.secondryBlack },
    },
    {
      btnName: strings('DatePickerModal.Save'),
      onPress: () => (type == 'calender' ? handleSave() : handleSaveTime()),
      btnStyles: {
        ...styles.btnStyles,
        backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
      },
      btnTxtStyles: styles.btnTxtStyles,
    },
  ];

  const handleCancel = () => {
    setDate('');
    handleModalVisibility();
  };

  const handleSave = () => {
    selectedDate
      ? handleModalVisibility()
      : FlashMessageComponent('reject', strings('DatePickerModal.Please_Select_Date'));
  };

  const handleSaveTime = () => {
    handleModalVisibility();
  };

  const handleTimeCancel = () => {
    setStartTimePicked('');
    handleModalVisibility();
  };

  useEffect(() => {
    let markedDates = {};
    markedDates[selectedDate] = {
      startingDay: true,
      customStyles: {
        container: {
          backgroundColor: Colors.blue,
          borderRadius: 10,
        },
        text: {
          color: Colors.white,
          fontWeight: 'bold',
        },
      },
    };
    setMarkedDate(markedDates);
  }, [selectedDate]);

  return (
    <ModalContainer
      handleModalVisibility={handleModalVisibility}
      visibility={visibility}
      containerStyles={styles.mainContainer}>
      <View style={[styles.modalContainer, { maxHeight: height / 1.4 }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.titleStyles}>{title}</Text>
          {type == 'calender' ? (
            <DatePicker
              getSelectedDate={setDate}
              type={'addParts'}
              fromDate={selectedDate}
              markingDate={markedDate}
            />
          ) : (
            <TimePicker
              selectedTime={(date) => {
                let dt = new Date(date);
                const time = timeFormat(dt);
                setStartTimePicked(time);
              }}
              time={startTimePicked}
            />
          )}
          <MultiButton buttons={buttons} />
        </ScrollView>
      </View>
    </ModalContainer>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  mainContainer: {
    top: Platform.OS === 'ios' ? normalize(70) : normalize(50),
  },
  modalContainer: {
    padding: normalize(20),
  },
  titleStyles: {
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
    fontSize: normalize(16),
  },
  btnStyles: {
    backgroundColor: Colors.silver,
  },
  btnTxtStyles: {
    fontSize: normalize(14),
    color: Colors.white,
  },
});
