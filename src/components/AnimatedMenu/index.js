import React, {useEffect, useState} from 'react';

import {Animated, TouchableWithoutFeedback} from 'react-native';
import {normalize} from '../../lib/globals';

const AnimatedMenu = ({type, onPress, color, ...props}) => {
  const [active, setActive] = useState(props.active);

  const [containerAnim, setContainerAnim] = useState(new Animated.Value(0));
  const [topBar, setTopBar] = useState(new Animated.Value(0));
  const [bottomBar, setBottomBar] = useState(new Animated.Value(0));
  const [middleBarOpacity, setMiddleBarOpacity] = useState(
    new Animated.Value(1),
  );
  const [bottomBarMargin, setBottomBarMargin] = useState(new Animated.Value(4));
  const [topBarMargin, setTopBarMargin] = useState(new Animated.Value(0));
  const [marginLeft, setMarginLeft] = useState(new Animated.Value(0));
  const [width, setWidth] = useState(new Animated.Value(25));

  const cross = () => {
    if (!active) {
      Animated.spring(topBar, {
        toValue: 0.9,
        useNativeDriver: false,
      }).start();
      Animated.spring(bottomBar, {
        toValue: 0.9,
        useNativeDriver: false,
      }).start();
      Animated.spring(bottomBarMargin, {
        toValue: -10,
        useNativeDriver: false,
      }).start();
      Animated.timing(middleBarOpacity, {
        toValue: 0,
        duration: 30,
        useNativeDriver: false,
      }).start();
    } else {
      setActive(false);
      Animated.spring(topBar, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(bottomBar, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      Animated.spring(bottomBarMargin, {
        toValue: 4,
        useNativeDriver: false,
      }).start();
      Animated.spring(middleBarOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  const activeEffect = () => {
    Animated.spring(topBar, {
      toValue: 0.9,
      useNativeDriver: false,
    }).start();
    Animated.spring(bottomBar, {
      toValue: 0.9,
      useNativeDriver: false,
    }).start();
    Animated.spring(bottomBarMargin, {
      toValue: -10,
      useNativeDriver: false,
    }).start();
    Animated.timing(middleBarOpacity, {
      toValue: 0,
      duration: 30,
      useNativeDriver: false,
    }).start();
  };

  const handleOnPress = () => {
    cross();
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPress={handleOnPress}
      style={{justifyContent: 'center', alignItems: 'center', zIndex: 10}}>
      <Animated.View
        style={{
          width: normalize(55),
          justifyContent: 'center',
          alignItems: 'center',
          height: normalize(55),
          borderRadius: normalize(40 / 2),
          transform: [
            {
              rotate: containerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <Animated.View
          style={{
            height: 2,
            marginLeft: marginLeft,
            width: width,
            marginBottom: topBarMargin,
            backgroundColor: color ? color : 'black',
            transform: [
              {
                rotate: topBar.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '50deg'],
                }),
              },
            ],
          }}
        />
        <Animated.View
          style={{
            height: 2,
            width: 20,
            opacity: middleBarOpacity,
            backgroundColor: color ? color : 'black',
            marginTop: 4,
          }}
        />
        <Animated.View
          style={{
            height: 2,
            marginLeft: marginLeft,
            width: width,
            backgroundColor: color ? color : 'black',
            marginTop: bottomBarMargin,
            transform: [
              {
                rotate: bottomBar.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-50deg'],
                }),
              },
            ],
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedMenu;
