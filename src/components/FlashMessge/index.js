import React from 'react';
import { I18nManager, View, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Colors } from '../../assets/styles/colors/colors';
import {
  CrossIcon,
  WhiteRight,
  FlashCloseIcon,
  FlashRightIcon,
  FlashWarnIcon,

} from '../../assets/img';
import { Text } from '../Text/index';
import { fontFamily, normalize } from '../../lib/globals';

export const switchIcon = (key) => {
  let obj = {
    IconName: FlashRightIcon,
    bgColor: Colors.successBgColor,
    msgColor: Colors.successTextColor,
    closeX: 'X',
  };
  switch (key) {
    case 'success':
      obj = {
        IconName: FlashRightIcon,
        bgColor: Colors.greenFlash,
        msgColor: Colors.greenSuccess,
        closeX: 'x',
      };
      break;

    case 'reject':
      obj = {
        IconName: FlashCloseIcon,
        bgColor: Colors.flashRed,
        msgColor: Colors.redReject,
        closeX: 'x',
      };
      break;

    case 'warning':
      obj = {
        IconName: FlashWarnIcon,
        bgColor: Colors.flashWarn,
        msgColor: Colors.textWarning,
        closeX: 'x',
      };
      break;

    default:
      obj;
      break;
  }
  return obj;
};

const RenderMessage = ({ IconName, text, textColor, closeX, bgColor }) => {
  return (
    <View

      style={{
       width: Dimensions.get('window').width,
        // marginTop: Platform.OS == 'ios' ? normalize(10) : normalize(10),
        // width: Dimensions.get('window').width,
        flex: 1,
        marginTop: Platform.OS == 'ios' ? normalize(0) : normalize(110),
        alignItems: 'center',
        // width: '100%',
      }}>
      <View
        style={{
          width: '120%',
          borderRadius: normalize(5),
          shadowColor: '#808080',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 2,
          justifyContent: 'center',
          backgroundColor: bgColor,
          paddingLeft: normalize(15),
          paddingRight: normalize(15),
          flex:1,paddingVertical:10,
          // height: ,
          marginTop: Platform.OS == 'ios' ? normalize(15): normalize(10)
        }}>
        <View style={styles.view}>
          <View style={{ alignSelf: 'center' }}>
            <IconName />
          </View>
          <Text style={styles.text} color={textColor}>
            {text}
          </Text>
          <TouchableOpacity onPress={hideMessage} style={styles.closeX}>
            <Text style={styles.closeXText}>{closeX}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const FlashMessageComponent = (
  type = 'success',
  message,
  duration = 900,
  authScreen,
  messageDescripton,
  iconPosition = 'top',

) => {
  const { bgColor, IconName, msgColor, closeX } = switchIcon(type);
  return showMessage({
    message: (
      
        <View style={{flex:1}}>
          <RenderMessage
            IconName={IconName}
            text={message}
            textColor={msgColor}
            closeX={'x'}
            bgColor={bgColor}
          />
        </View>
    
    ),
    type: type,
    icon: 'none',
    position: iconPosition,
    backgroundColor: 'transeparent',
    duration: duration,
    style: {
      flex:1,justifyContent:'center',
      marginTop: Platform.OS == 'ios' ? !authScreen ? normalize(20) : normalize(70) : !authScreen ? normalize(110) : normalize(60)

      // borderRadius: normalize(5),
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.5,
      // shadowRadius: 2,
      // elevation: 2,
    },
  });
};


/* -----my profile Edit------*/
const RenderMessageNew = ({ IconName, text, textColor, closeX, bgColor }) => {
  return (
    <View
      style={{
        
       width:Platform.OS == 'ios' ? "115%" : 450,
        marginTop: Platform.OS == 'ios' ? normalize(8) : normalize(30),
        paddingLeft: Platform.OS == 'ios' ? normalize(-50) : normalize(-50),

      }}>
      <View
        style={{
          width: Platform.OS == 'ios' ? "100%" : "100%",
          height:Platform.OS == 'ios' ? "60%" : 26,
          backgroundColor: bgColor,
          marginTop: Platform.OS == 'ios' ? normalize(20): normalize(0),
          marginLeft:  Platform.OS == 'ios' ? normalize(-20) : normalize(-20),
        }}>
        <View style={styles.viewnew}>
          <View style={{ alignSelf: 'center' ,paddingTop:Platform.OS == 'ios' ? normalize(10) : normalize(10),}}>
            <IconName />
          </View>
          <Text style={styles.textnew} color={textColor}>
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
};


export const FlashMessageComponenttwo = (
  type = 'success',
  message,
  duration=900,
  authScreen,
  messageDescripton,
  iconPosition = 'left',
) => {
  const { bgColor, IconName, msgColor, closeX } = switchIcon(type);
  return showMessage({
    message: (
      <>
        <RenderMessageNew
          IconName={IconName}
          text={message}
          textColor={msgColor}
          closeX={'x'}
          bgColor={bgColor}
        />
      </>
    ),
    type: type,
    icon: 'none',
    position: iconPosition,
    backgroundColor: 'transparent',
    duration:duration,
    style: {
      marginTop: Platform.OS == 'ios' ? !authScreen ? normalize(70) : normalize(20) : !authScreen ?  normalize(110) : normalize(60)
    },
  });
};


const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: normalize(30),
    paddingRight: normalize(15)
  },
  viewnew: {
    marginRight:80,
    marginTop:-5,
    flexDirection: 'row',
    width: '100%',
    paddingLeft:20,
    textAlign:'center'
  },
  text: {
    paddingLeft: normalize(14),
    fontFamily: fontFamily.bold,
    width: '90%',
    marginTop: normalize(2),
    flexWrap: 'wrap',
    paddingRight:normalize(10),
    textAlign:'left'
  },

  textnew: {
    fontFamily: fontFamily.semiBold,
    width: '100%',
    marginTop: normalize(10),
    fontSize:12,

    flexWrap: 'wrap',
  },
  
  closeX: {
    width: '10%',
    paddingRight: normalize(15)
  },
  closeXnew: {
    width: '10%',
    
    paddingRight: normalize(90)
  },
  closeXText: {
    color: Colors.lightestGrey,
    fontSize: normalize(16),
    paddingHorizontal: normalize(8),
  },
  render: {
    justifyContent: 'flex-start',
    marginTop: '20%',
    paddingTop: '5%'
  }
});