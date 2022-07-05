import React, { useRef, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  I18nManager
} from 'react-native';
import {
  CrossIcon,
  BlueSmallArrowLeft,
  BlueSmallArrowRight,
} from '../../assets/img';
import { Text } from '../Text/index';
import { useColors } from '../../hooks/useColors';
import { normalize } from '../../lib/globals';
import { strings } from '../../lib/I18n';
import { RotationGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const ImgPreviewModal = ({
  visibility,
  handleModalVisibility,
  containerStyles,
  source,
  data,
  index,
  singleAttchmentPreview = false,
  type = 'Attachment',
}) => {
  const arrowIconWidth = normalize(20);
  const arrowIconHeight = normalize(20);
  const { colors } = useColors();

  const renderItem = ({ item, index }) => {
    const path =
      type == 'Form Attachment'
        ? item.Attachment
        : item?.Attachment != null
          ? item?.Attachment
          : item?.ByteString;
    // ? item?.ByteString
    // :
    // : item?.Attachment;
    let PATH1 = ''
    switch (type) {
      case 'Form Attachment':
        PATH1 = item.Attachment
        break;
      case 'Normal Attachment':
        PATH1 = item.AttachmentTumbnail
        break;
      default:
        PATH1 = item?.Attachment != null ? item?.Attachment : item?.ByteString;
        break;
    }

    return (
      <View style={{ paddingVertical: normalize(10) }}>
        <Image
          source={{ uri: `data:image/png;base64,${PATH1}` }}
          resizeMode='stretch'
          style={styles.viewImageStyle}
        />
      </View>
    );
  };
  const newArray = data?.filter((item) => {
    return (
      item?.AttachmentCategoryId == 67 || item?.AttachmentType == 'image/jpeg' || item?.AttachmentType == 'image/png'
    );
  });
  const currentvalue = data[index];
  const currentIndex = newArray.indexOf(currentvalue);

  const [Index, setIndex] = useState(0);

  const [leftArrowOpacity, setleftArrowOpacity] = useState(1);
  const [rightArrowOpacity, setrightArrowOpacity] = useState(1);

  const flatListRef = useRef(null);
  useEffect(() => {
    if (currentIndex == newArray.length - 1) {
      setIndex(0);
    } else {
      setIndex(currentIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    try {
      flatListRef.current.scrollToIndex({ index: Index, animated: true });
    } catch (error) {
      console.log({ error });
    }
  }, [Index]);

  const handleLeftArrow = () => {
    if (Index == 0) {
      setIndex(0);
      setleftArrowOpacity(0.1);
    } else {
      setleftArrowOpacity(1);
      setrightArrowOpacity(1);
      setIndex((prevIndex) => {
        return (prevIndex = prevIndex - 1);
      });
    }
  };
  const handleRightArrow = () => {
    const lastLength = newArray.length - 1;
    if (Index == lastLength) {
      setIndex(Index);
      setrightArrowOpacity(0.1);
    } else {
      {
        setrightArrowOpacity(1);
        setleftArrowOpacity(1);
        setIndex((prevIndex) => {
          return (prevIndex = prevIndex + 1);
        });
      }
    }
  };

  const keyExtractor = (item, index) => `ID-${index}`;

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibility}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => handleModalVisibility()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleModalVisibility}>
              <CrossIcon height={normalize(16)} width={normalize(16)} />
            </TouchableOpacity>

            {!singleAttchmentPreview ? (
              <View style={{ marginVertical: normalize(15) }}>
                <FlatList
                  scrollEnabled={false}
                  keyExtractor={keyExtractor}
                  ref={flatListRef}
                  data={newArray}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  horizontal
                  snapToAlignment={'center'}
                  // ItemSeparatorComponent={() => (
                  //   <View
                  //     style={{
                  //       width: normalize(20),
                  //       backgroundColor: 'red',
                  //     }}
                  //   />
                  // )}
                  initialScrollIndex={currentIndex}
                  onScrollToIndexFailed={(info) => {
                    const wait = new Promise((resolve) =>
                      setTimeout(resolve, 500),
                    );
                    wait.then(() => {
                      flatListRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                      });
                    });
                  }}
                />

                {/* image for preview */}
                {newArray.length > 1 ? (
                  <View style={styles.Arrows}>
                    {Index != 0 ? (
                      <TouchableOpacity
                        onPress={handleLeftArrow}
                        style={styles.arrowBtnStyles}>
                        <View
                          style={{
                            opacity: leftArrowOpacity,
                            flexDirection: 'row',
                          }}>
                          <BlueSmallArrowLeft
                            width={arrowIconWidth}
                            height={arrowIconHeight}
                            style={{
                              transform: [{ rotate: I18nManager.isRTL?'180deg':'0deg' }],
                              color:colors.PRIMARY_BACKGROUND_COLOR
                            }}
                          />
                          <Text
                            style={{ color: colors?.PRIMARY_BACKGROUND_COLOR }}>
                            {strings('imagePreviewModal.Prev')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View></View>
                    )}

                    {newArray.length - 1 != Index ? (
                      <TouchableOpacity
                        style={styles.arrowBtnStyles}
                        onPress={handleRightArrow}>
                        <View
                          style={{
                            opacity: rightArrowOpacity,
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{ color: colors?.PRIMARY_BACKGROUND_COLOR }}>
                            {strings('imagePreviewModal.Next')}
                          </Text>
                          <BlueSmallArrowRight
                            width={arrowIconWidth}
                            height={arrowIconHeight}
                            style={{transform: [{ rotate: I18nManager.isRTL?'180deg':'0deg' }],
                            color:colors.PRIMARY_BACKGROUND_COLOR
                          }}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ) : (
              <Image
                source={source}
                style={styles.viewImageStyle}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  imgContainer: {
    padding: normalize(10),
  },
  cancelBtn: {
    alignSelf: 'flex-end',
    paddingLeft: normalize(10),
    // height: '2%',
    width: '100%',
    right: normalize(6),
    top: normalize(8),
    //  backgroundColor:'red'
  },
  viewImageStyle: {
    // height: height - normalize(200),
    // height: 500,
    // width: 300,
    //  width: width - normalize(50),

    alignSelf: 'center',

    // marginBottom: normalize(10),
    //  backgroundColor:'green',

    width: windowWidth * 0.91,
    height: windowHeight * 0.35,
  },
  Arrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(5),


  },
  arrowBtnStyles: {
    bottom: normalize(0),
  },
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: normalize(70),
    backgroundColor: 'rgba(232,232,232,0.5)',
  },
  modalView: {
    margin: normalize(10),

    // marginTop: normalize(180),
    // marginBottom: normalize(80),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: normalize(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // flex: 1,
    marginVertical: Platform.OS == 'ios'? height * 0.28: height * 0.25,
    alignSelf: 'center',
  },
  // arrowBtnStyles: {
  //   bottom: normalize(1),
  // },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
// const styles = StyleSheet.create({
//   imgContainer: {
//     padding: normalize(23),backgroundColor:'green',
//   },
//   cancelBtn: {
//     alignSelf: 'flex-end',
//     paddingVertical: normalize(10),
//   },
//   viewImageStyle: {
//     resizeMode: 'contain',
//     height: '90%',
//     width: width - normalize(100),
//     alignSelf: 'center',backgroundColor:'red'
//   },
//   Arrows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: normalize(20),
//     bottom: normalize(50),
//     marginVertical: normalize(10),
//   },
// });
