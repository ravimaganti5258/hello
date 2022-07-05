import {useEffect, useState} from 'react';

import NetInfo from '@react-native-community/netinfo';

export const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((info) => {
      setIsConnected(info.isConnected),
        setIsInternetReachable(info?.isInternetReachable);
    });
    return unsubscribe;
  }, []);

  return {isConnected, isInternetReachable};
};
