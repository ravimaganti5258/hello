import React from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {Colors} from '../../../../assets/styles/colors/colors';
import MultiButton from '../../../../components/MultiButton';
import {useColors} from '../../../../hooks/useColors';
import {normalize} from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';

const QRCodeUI = ({onSuccess, onCancel, onDone}) => {
  const {colors} = useColors();

  const buttons = [
    {
      btnName: strings('QRCodeUI.Cancel'),
      onPress: onCancel,
      btnTxtStyles: {fontSize: normalize(14)},
      btnStyles: {backgroundColor: Colors?.white},
    },
    {
      btnName: strings('QRCodeUI.Save'),
      onPress: onDone,
      btnTxtStyles: {fontSize: normalize(14), color: Colors?.white},
      btnStyles: {backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR},
    },
  ];

  return (
    <QRCodeScanner
      onRead={onSuccess}
      containerStyle={{height: '100%'}}
      topViewStyle={{
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      }}
      bottomViewStyle={{backgroundColor: Colors?.black, height: 80}}
      bottomContent={<MultiButton buttons={buttons} />}
      showMarker={true}
    />
  );
};

export default QRCodeUI;
