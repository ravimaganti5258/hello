import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    Text,
    Alert,
    StatusBar,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
///////photo library package///////////
import PhotoEditor from '@baronha/react-native-photo-editor';
import RNFetchBlob from 'rn-fetch-blob';
import { CropIcon, DrawIcon } from '../../assets/img';
import { Colors } from '../../assets/styles/colors/colors';
import { normalize } from '../../lib/globals';
import { Images } from '../../lib/Images';
import MultiButton from '../MultiButton';
import { strings } from '../../lib/I18n';

const ImageEditorComponent = ({ image, Edit, Path, setEditImg, setUpdatedImgCropData, setEditedImgData }) => {

    const ImageEditorBtn = [
        {
            btnName: strings('attachments.crop'),
            onPress: () => {
                onPressCropImg()
            },
            iconName: CropIcon,
            btnTxtStyles: styles.confirmTextStyles,
            btnStyles: styles.confirmBtnStyles,
            leftIcon: true,
            leftIconStyle: {
                fill: Colors?.black,
                height: normalize(15),
                width: normalize(15),
            },
        },
        {
            btnName: strings('attachments.Edit'),
            onPress: () => {
                onPressEditImage();
            },
            iconName: DrawIcon,
            btnStyles: styles.confirmBtnStyles,
            btnTxtStyles: styles.confirmTextStyles,
            leftIcon: true,
            leftIconStyle: {
                fill: Colors?.black,
                height: normalize(15),
                width: normalize(15),
            },
        },
    ];

    //*** Image crpper functions */
    const onPressCropImg = () => {
        try {
            const imagePath =
                Platform.OS === 'ios' ? image?.base64 : 'file://' + Path;
            ImagePicker.openCropper({
                //chnaging path for edit image
                path: Edit ? imagePath : image?.path,
                width: normalize(300),
                height: normalize(400),
                compressImageMaxWidth: normalize(500),
                compressImageMaxHeight: normalize(500),
                includeBase64: true,
                cropperToolbarTitle: Platform.OS === 'ios' ? null : strings('attachments.Edit_Photo')
                
            })
                .then((imageData) => {
                    setUpdatedImgCropData({ ...image, path: imageData?.path, base64: imageData?.data })
                    setEditImg(false)
                })
                .catch((error) => { });
        } catch (error) {
            console.log({ error });
        }
    };


    //*** Image Edit functions */
    const onPressEditImage = async () => {
        try {
            const newPAth = Edit ? image?.base64 : Platform.OS == 'ios' ? 'file://' + image?.path : image?.path;

            await PhotoEditor.open({
                path: newPAth,
                stickers: Images.stickers,
            })
                .then((imageData) => {
                    //chnage path name for ios for Rnfetchblob
                    imageData =
                        Platform.OS === 'ios' ? imageData.substring(7) : imageData;
                    //converting and change new path and base64 of updated image
                    RNFetchBlob.fs
                        .readFile(imageData, 'base64')
                        .then((data) => {
                            setEditedImgData({ ...image, path: imageData, base64: data })
                            setEditImg(false)
                            // setEdit(false);
                            // setImage({ ...image, path: imageData, base64: data });
                        })
                        .catch((err) => { });
                    //
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log({ error });
        }
    };

    return (

        <View style={styles.multiBtnWrap}>
            <MultiButton
                buttons={ImageEditorBtn}
                constinerStyles={styles.multiBtnContainer}
            />
        </View>

    );

};


const styles = StyleSheet.create({
    multiBtnContainer: {
        width: '85%',
        alignSelf: 'center',
        marginTop: normalize(24),
        marginBottom: normalize(15),
    },
    confirmBtnStyles: {
        padding: normalize(5),
        backgroundColor: Colors?.cropBtnColor,
    },
    confirmTextStyles: {
        fontSize: normalize(14),
        color: Colors.black,
    },
})
export default ImageEditorComponent;
