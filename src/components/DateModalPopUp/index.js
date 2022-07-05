import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {CloseWhiteIcon} from '../../assets/img/index';
import {Colors} from '../../assets/styles/colors/colors';
import {dateFormat, fontFamily, normalize, timeFormat} from '../../lib/globals';
import {TimeValidation} from '../../lib/validations/validator';
import PairButton from '../Button/pairBtn';
import {Text} from '../Text/index';
import TimePicker from '../TimePicker/index';
import DatePicker from '../DatePicker/index';
import moment from 'moment';
import {useColors} from '../../hooks/useColors';
import {strings} from '../../lib/I18n';
import {useDimensions} from '../../hooks/useDimensions';

const {width, height} = Dimensions.get('screen');

let calendarDate = moment();
const CalenderApp = ({
  onCancle,
  visible,
  pickerType,
  pickerTitle = 'Modal',
  startLable,
  endLable,
  selectedDate,
  selectedTime,
  startDate,
  endDate,
  fromTime,
  endTime,
  leaveType
}) => {
  const {height} = useDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [startTimePicked, setStartTimePicked] = useState(fromTime);
  const [endTimePicked, setEndTimePicked] = useState(endTime);
  const [currentDate, setCurrentDate] = useState(
    calendarDate.format('YYYY-MM-DD'),
  );
  const {colors} = useColors();
  const markerStyle = {
    markerCustom: {
      color: Colors.lighestBlue,
      customStyles: {
        container: {
          backgroundColor: Colors.lighestBlue,
          width: normalize(65),
          borderRadius: normalize(0),
        },
        text: {
          color: Colors.darkTextGrey,
        },
      },
    },
    darkCustomStyle: {
      container: {
        backgroundColor:colors.PRIMARY_BACKGROUND_COLOR,
        // backgroundColor: Colors.blue,
        borderRadius: 8,
      },
      text: {
        color: Colors.white,
        fontWeight: 'bold',
      },
    },
  };
  useEffect(() => {
    const existingSTime = new Date('01/01/2011 ' + fromTime);
    const existingETime = new Date('01/01/2011 ' + endTime);
    setStartTimePicked(timeFormat(existingSTime));
    setEndTimePicked(timeFormat(existingETime));
  }, [fromTime, endTime]);

  const [markedDate, setMarkedDates] = useState({});
  

  const _handleMarkedDate = (startDate, endDate) => {
    setFromDate(startDate);
    setToDate(endDate);

    let markedDates = {};

    markedDates[startDate] = {
      startingDay: true,
      customStyles: markerStyle.darkCustomStyle,
    };
    let startDates = moment(startDate);
    let endDates = moment(endDate);
    let range = endDates.diff(startDates, 'days');

    if (range > 0) {
      for (let i = 1; i <= range; i++) {
        let tempDate = startDates.add(1, 'day');
        tempDate = moment(tempDate).format('YYYY-MM-DD');
        if (i < range) {
          markedDates[tempDate] = markerStyle.markerCustom;
        } else {
          markedDates[endDate] = {
            endingDay: true,
            customStyles: markerStyle.darkCustomStyle,
          };
        }
      }
    }
    setMarkedDates(markedDates);
  };

  useEffect(() => {
    _handleMarkedDate(startDate, endDate);
  }, [startDate, endDate, visible]);

  const _handleSubmit = () => {
    if (pickerType == 'Calender') {
      if (selectedIndex == 0) {
        setSelectedIndex(1);
      } else {
        let startDate = moment(fromDate);
        let endDate = moment(toDate);
        let range = endDate.diff(startDate, 'days');
        if (range >= 0) {
          selectedDate(fromDate, toDate), onCancle();
          setSelectedIndex(0);
        } else {
          alert(strings('calender.Select_an_upcoming_date')), selectedDate('', '');
        }
      }
    } else {
      if (selectedIndex == 0) {
        setSelectedIndex(1);
      } else {
        if (startTimePicked != '' && endTimePicked != '') {
          const {res, msg} = TimeValidation(startTimePicked, endTimePicked);
          if (!res) {
            selectedTime(startTimePicked, endTimePicked);
            onCancle();
            setSelectedIndex(0);
          } else {
            Alert.alert(msg);
          }
        }
      }
    }
  };

  const _ToggleDateSelector = ({
    Lable1,
    Lable2,
    value1,
    value2,
    onCancle1,
    onCancle2,
  }) => {
    return (
      <>
        <View style={styles.fieldContainer}>
          <View
            style={
              selectedIndex == 0
                ? [
                    styles.selectedFieldWrap,
                    {backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR},
                  ]
                : styles.FieldWrap
            }>
            <TouchableOpacity
              onPress={() => setSelectedIndex(0)}
              style={{flex: 1}}>
              <Text
                align={'flex-start'}
                color={selectedIndex == 0 ? Colors.white : Colors.blue}
                size={normalize(12)}>
                {Lable1}
              </Text>
              <Text
                align={'flex-start'}
                color={
                  selectedIndex == 0
                    ? value1 == ''
                      ? Colors.borderGrey
                      : Colors.white
                    : value1 != ''
                    ? Colors.blue
                    : Colors.borderGrey
                }
                size={normalize(12)}
                style={{paddingTop: normalize(2)}}>
                {value1 == '' ? strings('DatePickerModal.Please_Select') : value1}
              </Text>
            </TouchableOpacity>
            <CloseWhiteIcon
              style={{alignSelf: 'center'}}
              onPress={() => onCancle1()}
            />
          </View>
          <View
            style={[
              selectedIndex == 1
                ? [
                    styles.selectedFieldWrap,
                    {backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR},
                  ]
                : styles.FieldWrap,
            ]}>
            <TouchableOpacity
              onPress={() => setSelectedIndex(1)}
              style={{flex: 1}}>
              <Text
                align={'flex-start'}
                size={normalize(12)}
                color={selectedIndex == 1 ? Colors.white : Colors.blue}>
                {Lable2}      
              </Text>
              <Text
                align={'flex-start'}
                size={normalize(13)}
                color={
                  selectedIndex == 1
                    ? value2 == ''
                      ? Colors.borderGrey
                      : Colors.white
                    : value2 != ''
                    ? Colors.blue
                    : Colors.borderGrey
                }
                style={{paddingTop: normalize(2)}}>
                {value2 == '' ? strings('DatePickerModal.Please_Select')  : value2}
              </Text>
            </TouchableOpacity>
            <CloseWhiteIcon
              style={{alignSelf: 'center'}}
              onPress={() => onCancle2()}
            />
          </View>
        </View>
      </>
    );
  };

  const inputValue = (value) => {
    return value == '' ? value : dateFormat(value, 'DD/MM/YYYY');
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        animationType={'fade'}
        onRequestClose={() => {
          onCancle();
        }}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              // {
              //   maxHeight:
              //     pickerType != 'Calender' ? height / 1.5 : height / 1.5,
              // },
            ]}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
              <View style={{marginBottom: normalize(15),marginLeft:normalize(15)}}>
                <Text
                  align={'flex-start'}
                  fontFamily={fontFamily.bold}
                  size={normalize(16)}>
                  {pickerTitle}{' '}
                </Text>
              </View>
              {pickerType === 'Calender' && (
                <>
                  <_ToggleDateSelector
                    Lable1={startLable}
                    Lable2={endLable}
                    value1={inputValue(fromDate)}
                    value2={inputValue(toDate)}
                    onCancle1={() => {
                      setFromDate(''), setMarkedDates({});
                    }}
                    onCancle2={() => {
                      setToDate(''), setMarkedDates({});
                    }}
                  />

                  <DatePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={(date) => {
                      let startDate = dateFormat(date, 'DD/MM/YYYY');
                      if(leaveType == 0){
                      setFromDate(date);
                      setToDate(date);
                      }else{
                      setFromDate(date);
                      }
                    }}
                    setToDate={(date) => {
                      let endDate = dateFormat(date, 'YYYY/MM/DD');
                      setToDate(date);
                    }}
                    currentDate={currentDate}
                    markingDate={markedDate}
                    setMarkingDates={(obj) => {
                      setMarkedDates(obj);
                    }}
                    setSelectedIndex={(index) => {
                      setSelectedIndex(index);
                    }}
                  />
                </>
              )}
              {pickerType === 'Time' && (
                <>
                  <_ToggleDateSelector
                    Lable1={startLable}
                    Lable2={endLable}
                    value1={startTimePicked}
                    value2={endTimePicked}
                    onCancle1={() => {
                      setStartTimePicked('');
                    }}
                    onCancle2={() => {
                      setEndTimePicked('');
                    }}
                  />
                  {selectedIndex == 0 && (
                    <TimePicker
                      selectedTime={(date) => {
                        let dt = new Date(date);
                        const time = timeFormat(dt);
                        setStartTimePicked(time);
                      }}
                      time={startTimePicked}
                    />
                  )}
                  {selectedIndex == 1 && (
                    <TimePicker
                      selectedTime={(date) => {
                        let dt = new Date(date);
                        const time = timeFormat(dt);
                        setEndTimePicked(time);
                      }}
                      time={endTimePicked}
                    />
                  )}
                </>
              )}

              <View style={styles.footer}>
                <PairButton
                  title1={strings('pair_button.cancel')}
                  title2={strings('pair_button.select')}
                  onPressBtn1={() => onCancle()}
                  onPressBtn2={() => _handleSubmit()}
                />
              </View>
            {/* </ScrollView> */}
          </View>
        </View>

        <View style={styles.modalBackground} />
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
     flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    zIndex: 90,
    top:normalize(100)
    // backgroundColor:'red',
    //  marginBottom:normalize(120)
  },
  modalView: {
    // margin: normalize(10),
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
    // alignItems: 'center',
    shadowColor: Colors.completeTransparent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    // borderTopWidth: 1,
    // paddingTop: normalize(20),
    paddingTop: normalize(5),

    borderTopColor: Colors.flatGrey,
    // backgroundColor:"red"
  },
  fieldContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    padding: normalize(2),
    borderColor: Colors.borderColor,
    borderRadius: normalize(10),
    marginHorizontal: normalize(15),
  },
  selectedFieldWrap: {
    flex: 0.5,
    padding: normalize(10),
    backgroundColor: Colors.blue,
    borderRadius: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FieldWrap: {
    flex: 0.5,
    padding: normalize(10),
    backgroundColor: Colors.white,
    borderRadius: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.borderGrey,
    zIndex: 10,
    opacity: 0.5,
  },
});

export default CalenderApp;
