import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { normalize } from '../../../lib/globals';

const OtpInput = ({ saveOtp, setfirst, setSecond, setThird, setFour }) => {
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '' });

  return (
    <View style={styles.otpContainer}>
      <View style={styles.otpBox}>
        <TextInput
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={firstInput}
          autoFocus
          onChangeText={(text) => {
            setOtp({ ...otp, 1: text });
            text && secondInput.current.focus();
            setfirst(text);
            saveOtp({ ...otp, 1: text });
          }}
          value={otp}
        />
      </View>
      <View style={styles.otpBox}>
        <TextInput
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={secondInput}
          onChangeText={(text) => {
            setOtp({ ...otp, 2: text });
            text ? thirdInput.current.focus() : secondInput.current.focus();
            setSecond(text);
            saveOtp({ ...otp, 2: text });
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Delete" || nativeEvent.key === "Backspace") {
              firstInput.current.focus();
            }
          }}
          value={otp}
        />
      </View>
      <View style={styles.otpBox}>
        <TextInput
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={thirdInput}
          onChangeText={(text) => {
            setOtp({ ...otp, 3: text });
            text ? fourthInput.current.focus() : thirdInput.current.focus();
            setThird(text);
            saveOtp({ ...otp, 3: text });
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Delete" || nativeEvent.key === "Backspace") {
              secondInput.current.focus();

            }
          }}
          value={otp}
        />
      </View>
      <View style={styles.otpBox}>
        <TextInput
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={fourthInput}
          onChangeText={(text) => {
            setOtp({ ...otp, 4: text });
            !text && thirdInput.current.focus();
            setFour(text);
            saveOtp({ ...otp, 4: text });
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Delete" || nativeEvent.key === "Backspace") {
              thirdInput.current.focus();
            }
          }}
          value={otp}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    width: Dimensions.get('window').width * 0.8,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  content: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  phoneNumberText: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  otpBox: {
    marginHorizontal: normalize(5),
    borderColor: 'white',
    borderBottomWidth: 2,
    width: normalize(40),
    marginTop: normalize(20),
    marginLeft: normalize(10),
    justifyContent: 'center'
  },
  otpText: {
    fontSize: 28,
    color: 'white',
    padding: 0,
    textAlign: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(10),
  },
});

export default OtpInput;
