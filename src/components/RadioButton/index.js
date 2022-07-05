import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../assets/styles/colors/colors';

const RadioButton = ({
  data,
  containerStyle,
  radioCircleStyle,
  selectedStyle,
  onPressRadio,
  checked,
  color
}) => {
  const [value, setvalue] = useState(false);
  return (
    <View>
      <View style={[styles.container, containerStyle]}>
        {/* <Text style={styles.radioText}>{res.text}</Text> */}
        <TouchableOpacity
          style={[styles.radioCircle, radioCircleStyle]}
          onPress={onPressRadio}>
          {checked && <View style={[styles.selectedRb, selectedStyle,{ backgroundColor: color.PRIMARY_BACKGROUND_COLOR}]} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioText: {
    marginRight: 35,
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    // backgroundColor: Colors.primaryColor,
  },
});
