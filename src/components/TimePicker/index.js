import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Colors} from '../../assets/styles/colors/colors';
import {normalize} from '../../lib/globals';
import { useColors } from '../../hooks/useColors';
const index = ({time, selectedTime}) => {
  const {colors} = useColors();
  const [date, setDate] = useState(new Date());

  const onChangeTime = (date) => {
    setDate(date);
    selectedTime(date);
  };

  useEffect(() => {
    const existingTime = new Date('01/01/2011 ' + time);
    setDate(existingTime);
    selectedTime(existingTime);
  }, [time]);

  return (
    <View style={{alignItems: 'center', paddingVertical: normalize(0)}}>
      <DatePicker
        date={date}
        onDateChange={onChangeTime}
        mode="time"
        textColor={colors?.PRIMARY_BACKGROUND_COLOR}
        fadeToColor={Colors.white}
        androidVariant="nativeAndroid"
        // minimumDate={new Date()}
      />
    </View>
  );
};

export default index;
