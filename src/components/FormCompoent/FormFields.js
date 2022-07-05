import React, { useState, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  I18nManager
} from 'react-native';

import { fontFamily, normalize } from '../../lib/globals';
import {
  BlackMoreOptionIcon,
  AttchmentBanner,
  CameraIcon,
  ImageIcon,
  AttchemntIconRed,
  AttchmentIcon,
} from '../../assets/img';

import { Text } from '../Text';
import { Colors } from '../../assets/styles/colors/colors';
import {
  RichToolbar,
  RichEditor,
  actions,
  defaultActions,
} from 'react-native-pell-rich-editor';
import { Input } from '../Input';
import CheckBoxComponent from '../CustomCheckbox/index';
import ImagePicker from 'react-native-image-crop-picker';
import { strings } from '../../lib/I18n';
import { useColors } from '../../hooks/useColors';
const FormFields = memo(
  ({
    label,
    complusory,
    value,
    setValue,
    rightIcon,
    checkbox,
    containerStyle,
    titleList,
    onPressCheckbox,
    onPressRightIcon,
    maxLength = 35,
    keyboardType = 'default',
    defaultVal,
    onBlur,
    onEndEditing,
    multiline = false,
    richTextEditor = false,
    attchmentCumplusory = false,
    attachmentCount,
    editable,
    disabled,
  }) => {
    const onFocusOut = () => { };
    const [onFousSignature, setonFousSignature] = useState(false);
    const [onEditorLoad, setOnEditorLoad] = useState(false);
    const richText = React.createRef() || useRef();
    const RichText = useRef(); //reference to the RichEditor component
    const [article, setArticle] = useState('');
    const onFocusOutSing = () => {
      setonFousSignature(true);
    };

    const { colors } = useColors();
    // this function will be called when the editor has been initialized
    function editorInitializedCallback() {
      RichText.current?.registerToolbar(function (items) {
        // items contain all the actions that are currently active
        setOnEditorLoad(true)
      });
    }

    // Callback after height change
    function handleHeightChange(height) {
    }

    async function onPressAddImage() {
      const item = await imagefromGalary();

      // you can easily add images from your gallery
    }
    const imagefromGalary = () => {
      ImagePicker.openPicker({
        width: normalize(1000),
        height: normalize(1000),
        includeBase64: true,
        cropping: false,
        mediaType: 'photo',
        smartAlbums: [
          'PhotoStream',
          'Generic',
          'Panoramas',
          'Videos',
          'Favorites',
          'Timelapses',
          'AllHidden',
          'RecentlyAdded',
          'Bursts',
          'SlomoVideos',
          'UserLibrary',
          'SelfPortraits',
          'Screenshots',
          'DepthEffect',
          'LivePhotos',
          'Animated',
          'LongExposure',
        ],
      })
        .then((response) => {
          const base64 = response.data;
          const name = response.path.split('/').pop();
          const item = {
            fileName: name,
            base64: base64,
            path: response.path,
          };
          RichText.current?.insertImage(item?.path);
          return item;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const onPressSignature = () => {
      return (
        <>

          <RichEditor
            disabled={false}
            containerStyle={styles.editor}
            ref={RichText}
            style={styles.rich}
            placeholder={strings('RichEditor.Start_Writing_Here')}
            onChange={(text) => setArticle(text)}
            editorInitializedCallback={editorInitializedCallback}
            onHeightChange={handleHeightChange}
          />

          {onEditorLoad ? <RichToolbar
            style={[styles.richBar]}
            editor={RichText}
            disabled={false}
            iconTint={'black'}
            selectedIconTint={'black'}
            disabledIconTint={'grey'}
            selectedButtonStyle={{ backgroundColor: Colors.darkGray }}
            onPressAddImage={onPressAddImage}
            iconSize={normalize(15)}
            flatContainerStyle={{ flexWrap: 'wrap', width: '100%' }}
            itemStyle={{
              padding: normalize(5),
              borderWidth: 1,
              margin: normalize(5),
              borderColor: Colors.greyBorder,
            }}
            actions={[
              ...defaultActions,
              actions.heading1,
              actions.redo,
              actions.undo,
              actions.insertImage,
              actions.setStrikethrough,
              actions.fontSize,
              actions.setSubscript,
              actions.setSuperscript,
              actions.code,
              actions.alignCenter,
              actions.alignFull,
              actions.alignLeft,
              actions.alignRight,
            ]}
            // map icons for self made actions
            iconMap={{
              [actions.heading1]: ({ tintColor }) => (
                <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
              ),

              // [actions.undo]: ({tintColor}) => (
              //   <Text style={[styles.tib, {color: tintColor}]}>undo</Text>
              // ),
              // [actions.redo]: ({tintColor}) => (
              //   <Text style={[styles.tib, {color: tintColor}]}>redo</Text>
              // ),
              // [actions.setStrikethrough]: strikethrough,
              // ['insertVideo']: video,
            }}
          //   insertVideo={insertVideo}
          /> : null}


        </>
      );
    };
    return (
      <View style={[{ marginVertical: normalize(10) }, containerStyle]}>
        <Text
          align={'flex-start'}
          color={'#000000'}
          style={{ paddingLeft: normalize(5) }}>
          {complusory && <Text color={Colors.red}>{'*  '}</Text>}
          {label}
        </Text>
        {checkbox ? (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              {titleList?.map((ele, id) => {
                return (
                  <View style={{ padding: normalize(10) }} key={id.toString()}>
                    <CheckBoxComponent
                      onChange={() => {
                        onPressCheckbox(ele, id);
                      }}
                      check={ele?.selected}
                      label={ele?.ValueList}
                      containerStyle={{
                        padding: normalize(10),
                      }}
                      labelStyle={{ fontFamily: fontFamily.semiBold }}
                    />
                  </View>
                );
              })}
            </View>
            {rightIcon && (
              <TouchableOpacity
                onPress={() => onPressRightIcon()}
                style={{
                  justifyContent: 'flex-end',
                  flex: 0.2,
                  margin: normalize(20),
                  height: normalize(50)

                }}>
                {attchmentCumplusory ? (
                  <AttchemntIconRed
                    height={normalize(18)}
                    width={normalize(17)}
                    color={colors.PRIMARY_BACKGROUND_COLOR}
                    // style={{ color: 'blue' }}
                  />
                ) : (
                  <AttchmentIcon height={normalize(18)}
                    width={normalize(17)} 
                    color = {colors.PRIMARY_BACKGROUND_COLOR}
                    // fill={colors?.PRIMARY_BACKGROUND_COLOR} 
                    // style={{ color: colors?.PRIMARY_BACKGROUND_COLOR }} 
                    />
                )}

                {attachmentCount > 0 &&
                  <View style={[styles.attachmentCountStyle, { top: 0 }]}>
                    <Text color={Colors.white}>{attachmentCount}</Text>
                  </View>}


              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{ flex: 1 }}>
              {!richTextEditor ? (
                // <Input
                //   style={[styles.inputFieldStyle]}
                //   value={value}
                //   onEndEditing={
                //     label === 'Signature' ? onFocusOutSing : onFocusOut
                //   }
                //   onChangeText={(text) => setValue(text)}
                //   containerStyle={styles.dateInput}
                //   inputContainer={{marginTop: normalize(5)}}
                //   maxLength={maxLength}
                //   keyboardType={keyboardType}
                //   // onBlur={value}
                // />
                <View style={[styles.dateInput]}>
                  <TextInput
                    value={value}
                    editable={editable}
                    onChangeText={setValue}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    onBlur={onEndEditing}
                    // onPressOut={onEndEditing}
                    // onChange={(e)=>{onEndEditing(e.nativeEvent.text)}}
                    // onEndEditing={onEndEditing}
                    // onSubmitEditing={(e) => onEndEditing(e.nativeEvent.text)}
                    // defaultValue={defaultVal}style=
                    style={{
                      padding: Platform.OS === 'ios' ? normalize(15) : normalize(7),
                      textAlign: I18nManager.isRTL ? 'right' : 'left'

                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    marginVertical: normalize(5),
                    borderColor: Colors?.borderColor,
                    //   minHeight: normalize(200),
                  }}>
                  {onPressSignature()}
                  {/* {onEditorLoad && <RichToolbar editor={richText} />}
                  <RichEditor
                    ref={(r) => (richtext = r)}
                    initialContentHTML={''}
                    editorInitializedCallback={() => {
                      richText.current?.registerToolbar(function (items) {});
                      setOnEditorLoad(true);
                    }}
                  /> */}
                </View>
              )}
            </View>
            {rightIcon && (
              <TouchableOpacity
                onPress={() => onPressRightIcon()}
                style={{
                  justifyContent: 'flex-end',
                  flex: 0.2,
                  margin: normalize(15),

                }}>
                {attchmentCumplusory ? (
                  <AttchemntIconRed
                    height={normalize(18)}
                    width={normalize(17)}
                    color={colors.PRIMARY_BACKGROUND_COLOR}
                    // style={{ color: 'blue' }}
                  />
                ) : (
                  <AttchmentIcon height={normalize(18)}
                    width={normalize(17)} 
                    color={colors?.PRIMARY_BACKGROUND_COLOR} 
                    // style={{ color: colors?.PRIMARY_BACKGROUND_COLOR }} 
                    />
                )}
                {attachmentCount > 0 &&
                  <View style={styles.attachmentCountStyle}>
                    <Text color={Colors.white}>{attachmentCount}</Text>
                  </View>}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    flex: 1,
  },
  bodyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors?.appGray,
  },
  BtnWrap: {
    flexDirection: 'row',
    backgroundColor: Colors?.white,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(50),
    elevation: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
  },
  itemSeperator: {
    height: '2%',
    backgroundColor: Colors.borderColor,
    marginVertical: normalize(10),
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: normalize(7),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS === 'ios' ? normalize(5) : normalize(5),
    // padding: Platform.OS === 'ios' ? normalize(12) : normalize(-2),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
  },
  inputLableStyle: {
    padding: normalize(5),
    marginLeft: normalize(2),
  },
  editor: {
    backgroundColor: 'black',
    marginBottom: normalize(10),
  },
  rich: {
    // flex: 1,
  },
  richBar: {
    height: 'auto',
    backgroundColor: '#FFF',
    paddingBottom: normalize(20),
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  tib: {
    textAlign: 'center',
    color: '#515156',
  },
  attachmentCountStyle: {
    position: 'absolute',
    top: normalize(14),
    left: normalize(10),
    // right:normalize(28),
    backgroundColor: Colors.primaryColor,
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',

  },
});

export default FormFields;
