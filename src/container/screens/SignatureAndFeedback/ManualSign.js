import React, {Component,useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,Image
} from 'react-native';

import SignatureScreen from "react-native-signature-canvas";
import {Colors} from '../../../assets/styles/colors/colors';
import {Text} from '../../../components/Text';
import {fontFamily, normalize} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';

const ManualSign = ({setSignture, preview, img, jobInfo, scrolling,themeColor='#17338d'}) => {
  const ref = useRef();
const [signPerview, setsignPerview] = useState(preview)
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {

    signature= signature.substring(22);
   
    setSignture(signature);

  };
  // Called after ref.current.clearSignature()
  const handleClear = () => {
    if(signPerview == false){
    ref.current.clearSignature()
    setSignture('');
    }
    else{
    setSignture('');

    setsignPerview(false)
    }
  };

  // Called after end of stroke
  const handleEnd = () => {
   ref.current.readSignature(); 
   scrolling(true)
  };


  return (
    <View>
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 5,
        minHeight: normalize(200),
        borderWidth: 1,
        borderRadius:1,
        borderStyle: 'dashed',
        borderColor: Colors?.borderGrey,
      }}>

        {!signPerview?
 <SignatureScreen
 ref={ref}
 onEnd={handleEnd}
 onOK={handleOK}
 autoClear={false}
 onBegin={() => scrolling(false)}
 descriptionText="sign"
/>
:
<Image
            resizeMode={"contain"}
            style={{ width:normalize(350), height: normalize(200),alignSelf:'center' }}
            source={{ uri: img }}
          />
        }
       {/* <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleOK}
      autoClear={false}
      descriptionText="sign"
    /> */}
    </View>
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
      <TouchableOpacity
        onPress={jobInfo?.SubmittedSource != 2? () => {
          handleClear();
        }:()=>{}}>
        <Text
          align={'flex-end'}
          color={themeColor}
          style={{
            padding: normalize(5),
            fontFamily: fontFamily.bold,
          }}>
          {strings('signature_feedback.clear')}
        </Text>
      </TouchableOpacity>

    
    </View>

  </View>

  );
};




// const styles = StyleSheet.create({
//   signature: {
//     flex: 1,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: Colors?.borderGrey,
//   },
//   buttonStyle: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     backgroundColor: '#eeeeee',
//     margin: 10,
//   },
// });

export default ManualSign;
