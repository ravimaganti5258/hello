import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { fontFamily, normalize } from '../../../lib/globals';

export default class TimerFile extends Component {
  state = {
    minutes: 3,
    seconds: 49,
  };

  componentDidMount() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;

      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const { minutes, seconds } = this.state;
    return (
      <View>
        <Text style={styles.time}>
          {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  time: {
    color: Colors.white,
    marginTop: normalize(20),
    fontSize: normalize(13),
    fontFamily: fontFamily?.bold
  },
})