import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  I18nManager,
  ActivityIndicator, ImageBackground
} from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows';
import { WhiteLogout, WhiteLogout2, CheckInImg, CheckOutImg } from '../../assets/img';
import { Colors } from '../../assets/styles/colors/colors';
import { fontFamily, normalize } from '../../lib/globals';
import { Text } from '../Text';


const CheckBtn = ({ title, onPress, bgColor, checkIn, loader }) => {

  const checkInBtn1 = () => {
    return (
      <Neomorph
        darkShadowColor={'#000'} // <- set this
        // lightShadowColor={'#fff'} // <- this
        style={[
          styles.checkInStyle,
          {
            backgroundColor: bgColor,
            marginTop: normalize(5)

          },
        ]}>
        <View style={styles.btnWrap2}>
          {loader ? (
            <ActivityIndicator size={'small'} color={Colors?.white} />
          ) : (
            <>

              <WhiteLogout
                style={styles.logOutBtn}
                height={normalize(17)}
                width={normalize(19)}
              />


              <Text

                style={[styles.titleSty, { fontSize: normalize(15) }]}>
                {title}
              </Text>
            </>
          )}
        </View>
      </Neomorph>
    )
  }

  return (

    <View style={{}}>
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}>

        {!checkIn ?
          <View style={styles.checkInWrap

          }>
            {checkInBtn1()}
          </View>


          : <View style={{


          }}>
            <CheckOutImg

              style={[styles.checkoutBtnSty, { color: bgColor }]}
              height={normalize(80)}
              width={normalize(175)}

            />

            <View style={[styles.btnWrap, { position: 'absolute', left: normalize(27), top: normalize(12) }]}>
              <WhiteLogout2
                style={styles.logOutBtn}
                height={normalize(16)}
                width={normalize(18)}
              />
              <Text style={styles.titleSty
              }>{title}</Text>
            </View>
          </View>}
      </TouchableOpacity>
    </View>





  )
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}>
      <Neomorph
        darkShadowColor={!checkIn ? '#000' : '#fff'} // <- set this
        lightShadowColor={!checkIn ? '#fff' : '#000'} // <- this
        style={[
          styles.checkInStyle,
          {
            backgroundColor: bgColor,
          },
        ]}>
        <View style={styles.btnWrap}>
          {loader ? (
            <ActivityIndicator size={'small'} color={Colors?.white} />
          ) : (
            <>
              {!checkIn ? (
                <WhiteLogout
                  style={styles.logOutBtn}
                  height={normalize(16)}
                  width={normalize(18)}
                />
              ) : (
                <WhiteLogout2
                  style={styles.logOutBtn}
                  height={normalize(16)}
                  width={normalize(18)}
                />
              )}

              <Text
                style={{
                  fontSize: normalize(14),
                  fontFamily: fontFamily.semiBold,
                  color: Colors.white,
                }}>
                {title}
              </Text>
            </>
          )}
        </View>
      </Neomorph>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  logOutBtn: {
    marginRight: normalize(7),
    transform: I18nManager.isRTL ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }],
  },
  checkInView: {
    flexDirection: 'row',
    marginVertical: normalize(10),
    justifyContent: 'space-between',
    marginTop: normalize(20),
  },
  checkInStyle: {
    // shadowOpacity: 0.15, // <- and this or yours opacity
    shadowRadius: normalize(6),
    borderRadius: normalize(40),
    width: normalize(155),
    height: normalize(40),

  },
  btnWrap: {
    flexDirection: 'row',
    flex: 1,
  },
  btnWrap2: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  checkOutShaddow: {
    shadowRadius: 2,
    borderRadius: normalize(20),
    width: normalize(150),
    height: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleSty: {
    fontSize: normalize(14),
    fontFamily: fontFamily.semiBold,
    color: Colors.white,
    textAlign: 'center'
  },
  checkInWrap: {
    justifyContent: 'center',
    marginVertical: normalize(-5)
  },
  checkoutBtnSty: {
    marginVertical: normalize(-20), marginLeft: normalize(-12),
    color: '#ccc'
  },

});

export default CheckBtn;
