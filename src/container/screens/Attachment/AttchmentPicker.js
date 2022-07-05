import React, {useState} from 'react';

import {useSelector} from 'react-redux';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {
  AttchmentBanner,
  AttchmentIcon,
  CameraIcon,
  ImageIcon,
} from '../../../assets/img';
import {Colors} from '../../../assets/styles/colors/colors';
import {normalize, fontFamily, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {Text} from '../../../components/Text';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {getCurrentLocation} from '../../../util/helper';
import ImageMarker from 'react-native-image-marker';

const AttchmentPickerComponent = ({
  onSelectFromCamera,
  onSelectGallery,
  onSelectDoc,
  containerStyle,
  iconColor = Colors?.primaryColor,
}) => {
  const BtnArr = [
    {
      title: strings('attachments.camera'),
      icon: CameraIcon,
      height: normalize(19.77),
      width: normalize(24.77),
      onPress: () => {
        onPressCamera();
      },
    },
    {
      title: strings('attachments.gallery'),
      icon: ImageIcon,
      height: normalize(20),
      width: normalize(22),
      onPress: () => {
        imagefromGalary();
      },
    },
    {
      title: strings('attachments.document'),
      icon: AttchmentIcon,
      height: normalize(19.3),
      width: normalize(18.63),
      onPress: () => {
        addDocument();
      },
    },
  ];
  //Get WaterMark image
  const TechnicianDetails = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const getWaterMarkImage = async (response) => {
    //Watermark data
    let imagePath = 'demo';
    let base64Data = 'demoo';
    const userCoordinates = await getCurrentLocation();
    const userLocationObject = {
      latitude: userCoordinates[1],
      longitude: userCoordinates[0],
    };
    const Technician = TechnicianDetails.TechDisplayName;
    const workOrderNuber = `#${TechnicianDetails.WoNumber}`;
    const Date = moment().format('DD/MM/YYYY');
    const Time = moment().format('hh:mm A');
    const watermarkData = {
      TechnicianName: Technician,
      WorkorderNo: workOrderNuber,
      Latitude: userLocationObject.latitude,
      Longitude: userLocationObject.longitude,
      date: Date,
      time: Time,
    };
    const watermarkText = `
      Work Order ${watermarkData.WorkorderNo} 
      Date: ${watermarkData.date}             Lat: ${watermarkData.Latitude}
      Time: ${watermarkData.time}                Long: ${watermarkData.Longitude}                                       
      Tech: ${watermarkData.TechnicianName}              
      `;

  /* note creating watermark Image  */

    await ImageMarker.markText({
      src: response.path,
      text: watermarkText,
      color: '#de1da8',
      fontSize: normalize(12),
      scale: 1,
      quality: 100,
      fontName: 'OpenSans-Bold',
      position: "bottomLeft"
    })
      .then((path) => {
        imagePath = Platform.OS === 'android' ? 'file://' + path : path;
      })
      .catch((err) => {
        console.log(err);
        imagePath = response.path;
      });
    await RNFetchBlob.fs
      .readFile(imagePath, 'base64')
      .then((data) => {
        base64Data = data;
      })
      .catch((err) => {
        console.log(err);
      });
    return {
      ImagePath: imagePath,
      Base64Data: base64Data,
    };
  };
  const onPressCamera = async () => {
    await ImagePicker.openCamera({
      width: normalize(300),
      height: normalize(400),
      compressImageMaxWidth: normalize(500),
      compressImageMaxHeight: normalize(500),
      cropping: true,
      includeBase64: true,
      cropperToolbarTitle: Platform.OS === 'ios' ? null : strings('attachments.Edit_Photo')

    })
      .then(async (response) => {
        const watermarkdata = await getWaterMarkImage(response);
        const base64 = watermarkdata?.Base64Data;
        const name = response.path.split('/').pop();
        const imageName = 'Image-' + name.slice(-12, name.length);
        const imgExtention = imageName.split('.').pop();
        const date = moment().format('MM-DD-YYYY:HH:mm:ss');
        const item = {
          fileName: name,
          base64: base64,
          path: watermarkdata?.ImagePath,
          date: date,
          type: '.' + imgExtention,
          UploadedFrom: 'Camera',
        };
        onSelectFromCamera(item);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const imagefromGalary = () => {
    ImagePicker.openPicker({
      width: normalize(1000),
      height: normalize(1000),
      compressImageMaxWidth: normalize(1000),
      compressImageMaxHeight: normalize(1000),
      includeBase64: true,
      cropping: false,
      cropperToolbarTitle: Platform.OS === 'ios' ? null : strings('attachments.Edit_Photo'),

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
        const date = moment().format('MM-DD-YYYY:HH:mm:ss');
        const item = {
          fileName: name,
          base64: base64,
          path: response.path,
          date: date,
          type: '.' + name.split('.').pop(),
          UploadedFrom: 'Gallery',
        };
        onSelectGallery(item);
      })
      .catch((err) => {
        console.log(err);
      });
  };

 /* for add Documents */
  
 const addDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.plainText,DocumentPicker.types.pdf,DocumentPicker.types.zip,DocumentPicker.types.csv
        ,DocumentPicker.types.doc,DocumentPicker.types.docx,DocumentPicker.types.ppt, DocumentPicker.types.pptx,DocumentPicker.types.xls,DocumentPicker.types.xlsx],
        includeBase64: true,
      });

      const basePath =
        res.uri.substring(0, res.uri.lastIndexOf('/')) + '/' + res.name;

      let filepath = '';
      if (Platform.OS === 'android') {
        filepath = res.uri;
      } else {
        let basepath = res.uri.substring(0, res.uri.lastIndexOf('/'));
        filepath = basepath + '/' + res.name;
        filepath = Platform.OS === 'ios' ? filepath.substring(7) : filepath;
      }
      const date = moment().format('MM-DD-YYYY:HH:mm:ss');
      RNFetchBlob.fs
        .readFile(filepath, 'base64')
        .then((data) => {
          const item = {
            path: filepath,
            fileName: res.name,
            type: res.type,
            size: res.size,
            date: date,
            base64: data,
          };
          onSelectDoc(item);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.bodyContainer, containerStyle]}>
        <AttchmentBanner width={normalize(141.25)} height={normalize(121.53)} />
        <View style={styles.miniContainer}>
          {BtnArr.map((item, id) => {
            return (
              <View style={styles.titleContainer} key={id.toString()}>
                <TouchableOpacity
                  style={[styles.BtnWrap]}
                  onPress={() => item.onPress()}>
                  <item.icon
                    height={item.height}
                    width={item.width}
                    color={iconColor}
                  />
                  <Text
                    style={styles.titleStyle}
                    fontFamily={fontFamily.semiBold}
                    colors={Colors?.black}>
                    {' '}
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
  },
  titleStyle: {
    paddingHorizontal: normalize(10),
  },
  titleContainer: {
    marginTop: normalize(15),
  },
  miniContainer: {
    marginTop: normalize(20),
  },
});

export default AttchmentPickerComponent;
