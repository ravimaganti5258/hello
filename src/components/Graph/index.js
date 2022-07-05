import React from 'react';

import {StyleSheet, View, Text, Platform} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Colors} from '../../assets/styles/colors/colors';
import {useDimensions} from '../../hooks/useDimensions';
import {fontFamily, normalize, textSizes} from '../../lib/globals';

const Graph = ({totalJobs,completedJobs}) => {
  const {width} = useDimensions();

  const lineData = {
    datasets: [
      {
        data: completedJobs,
        strokeWidth: 0.5,
      },
      {
        data: totalJobs,
        strokeWidth: 1,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={lineData}
        width={width * 0.86}
        height={normalize(120)}
        chartConfig={{
          backgroundColor: Colors.white,
          backgroundGradientFrom: Colors.white,
          backgroundGradientTo: Colors.white,
          color: () => Colors.black,
          labelColor: () => Colors.black,
          propsForDots: {
            r: '4',
            strokeWidth: '0.5',
            stroke: Colors.black,
            fill: Colors.white,
          },
          propsForBackgroundLines: {
            strokeDasharray: 5,
            strokeDashoffset: 0,
            strokeWidth: .5,

          },
        }}
        yLabelsOffset={0}
        xLabelsOffset={0}
        style={styles.graphStyles}
        withHorizontalLabels={false}
        withScrollableDot={false}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={false}
        withHorizontalLines={true}
        withVerticalLabels={false}
        withVerticalLines={false}
      />
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  iconTxtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphStyles: {
    marginRight: normalize(30),
    borderRadius: normalize(20),
    paddingTop: normalize(8),
    paddingRight: normalize(15),
    // paddingLeft: normalize(5),
  },
});
