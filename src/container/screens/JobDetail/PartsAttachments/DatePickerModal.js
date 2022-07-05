import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {ModalContainer} from '../../../../components/Modal';
import DatePicker from '../../../../components/DatePicker/index';
import {dateFormat, fontFamily, normalize, timeFormat} from '../../../../lib/globals';
import {Text} from '../../../../components/Text';
import {useDimensions} from '../../../../hooks/useDimensions';
import MultiButton from '../../../../components/MultiButton';
import {Colors} from '../../../../assets/styles/colors/colors';
import {useColors} from '../../../../hooks/useColors';
import TimePicker from '../../../../components/TimePicker';
import { strings } from '../../../../lib/I18n';
import moment from 'moment';

const DatePickerModal = ({
  handleModalVisibility,
  visibility,
  setDate,
  selectedDate,
  title = strings('DatePickerModal.Select_Date'),
  type = 'calender',
  startTimePicked = new Date(),
  setStartTimePicked,
  dateTimePicker,
  selectedDateTimeValue,
  resumeJobDateClear,
}) => {
  const [markedDate, setMarkedDate] = useState({});
  const [slctTime,setSlctTime] = useState('');
  const [Type, setType] = useState(type);
  const [selTime, setSelTime] = useState('');

  const {height} = useDimensions();
  const {colors} = useColors();
  var frmtDate = moment().format('YYYY-MM-DD');
  const [selDate, setSelDate] = useState(frmtDate);


  const buttons = [
    {
      btnName: strings('DatePickerModal.Cancel'),
      onPress: () => (Type == 'calender' ? handleCancel() : handleTimeCancel()),
      btnStyles: styles.btnStyles,
      btnTxtStyles: {...styles.btnTxtStyles, color: Colors.secondryBlack},
    },
    {
      btnName: strings('DatePickerModal.Select'),
      onPress: () => (Type == 'calender' ? handleSave() : handleSaveTime()),
      btnStyles: {
        ...styles.btnStyles,
        backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
      },
      btnTxtStyles: styles.btnTxtStyles,
    },
  ];

  const handleCancel = () => {
    if(resumeJobDateClear =='ResumeJobModal' && resumeJobDateClear !=null && resumeJobDateClear != undefined){
      handleModalVisibility();
    }else{
      setDate('');
      handleModalVisibility();
    }
  };

  const handleSave = () => {
    if (!dateTimePicker) {
      setDate(selDate)
      handleModalVisibility();
    } else {
      setType('time');
    }
  };

  const handleSaveTime = () => {
    if (dateTimePicker) {
      let dtime = dateFormat(selDate, 'DD/MM/YYYY');
      let tM = selTime?.toString().split(' ');
      selectedDateTimeValue(dtime + ' ' + tM[4]);
      setStartTimePicked(slctTime);
    }
    else{
      setStartTimePicked(slctTime);
    }
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
          backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
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
      <View style={[styles.modalContainer, {maxHeight: height / 1.4}]}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.titleStyles}>
            {' '}
            {Type == 'calender' ? title : strings('DatePickerModal.Select_Time')}
          </Text>
          {Type == 'calender' ? (
            <DatePicker
              getSelectedDate={(val) => {
                 setSelDate(val);
              }}
              type={'addParts'}
              fromDate={selectedDate}
              markingDate={markedDate}
            />
          ) : (
            <TimePicker
              selectedTime={(date) => {
                let dt = new Date(date);
                const time = timeFormat(dt);
                setSlctTime(time)
                // setStartTimePicked(time);
                setSelTime(date);
              }}
              time={dateTimePicker ? '' : startTimePicked}
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
    top: Platform.OS === 'ios' ? normalize(70) : normalize(50)
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
