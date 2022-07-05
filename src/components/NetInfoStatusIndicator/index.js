import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNetInfo} from '../../hooks/useNetInfo';
import { strings } from '../../lib/I18n';
import {NetInfoMessage} from '../NetInfoMessage';

export const NetInfoStatusIndicator = ({backgroundColor}) => {
  const {isConnected} = useNetInfo();

  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setFlag1(false);
      setFlag2(true);
    } else {
      if (flag2) {
        setFlag1(true);
      }
    }
  }, [isConnected]);

  useEffect(() => {
    if (flag1) {
      var clear = setTimeout(() => {
        setFlag1(false);
        setFlag2(false);
      }, 2000);
    }
    return () => {
      clearTimeout(clear);
    };
  }, [flag1]);

  return (
    <>
      {!isConnected ? (
        <NetInfoMessage
          backgroundColor={backgroundColor}
          message={strings('netinfo.YOU_ARE_OFFLINE')}
        />
      ) : null}
      {flag1 ? (
        <NetInfoMessage
        message={strings('netinfo.YOU_ARE_BACK_ONLINE')}
        backgroundColor={backgroundColor}
          type={'success'}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({});
