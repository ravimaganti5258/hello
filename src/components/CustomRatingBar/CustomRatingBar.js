import { defaultFormat } from 'moment';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import {FillStarIcon, StarFill, EmptyStarIcon} from '../../assets/img/index';
import {normalize} from '../../lib/globals';

const CustomRatingBar = ({setRating, Rating, jobInfo}) => {
  const [defaultRating, setdefaultRating] = useState(Rating);
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);
  useEffect(() => {
    setdefaultRating(Rating)
  }, [Rating]);
  useEffect(()=>{
    setRating(defaultRating)
  },[defaultRating])
  return (
    <View style={style.CustomRatingBarStyle}>
      {maxRating.map((item, key) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            style={{paddingRight: normalize(14)}}
            onLongPress={jobInfo?.SubmittedSource != 2 ? () => {
              item==1 ? setdefaultRating(0) : setdefaultRating(item);
            }:()=>{}}
            onPress={jobInfo?.SubmittedSource != 2 ? () => {
              setdefaultRating(item);
            }:()=>{}}>
            {(item <= defaultRating && defaultRating != 0) ? (
              <StarFill height={normalize(25)} width={normalize(26)} />
            ) : (
              <EmptyStarIcon height={normalize(25)} width={normalize(26)} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CustomRatingBar;
const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  // star: {
  //   height: normalize(23),
  //   width: normalize(28),
  //   resizeMode: 'contain',
  //   marginLeft: normalize(7),
  // },
  CustomRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
