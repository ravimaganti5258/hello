import React, { memo, useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,Platform
} from 'react-native';

import HeaderComponent from '../../../components/header';
import MainHoc from '../../../components/Hoc';
import MapViewContainer from '../../../components/MapView';
import MarkerView from '../../../components/MarkerView';
import EventCardsNearBy from '../../../components/NearByCards/EventCardsNearBy';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, normalizeHeight } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { Colors } from '../../../assets/styles/colors/colors';
import Loader from '../../../components/Loader';
import { DataNotFound } from '../../../components/DataNotFound';
import { useColors } from '../../../hooks/useColors';

const callStatus = 'Call';

const NearByPartsMapView = ({ navigation, route }) => {
  const {colors} = useColors()

  const [loading, setLoading] = useState(true);
  const { width } = useDimensions();
  const [coordinates, setCoordinates] = useState([]);
  const [partList, setPartList] = useState(route?.params?.data);
  const [msg, setMsg] = useState(false);
  useEffect(() => {
    setPartList(route?.params?.data);
    setMsg(true);
  }, [route?.params]);

  /* createing view references */ 

  const onViewRef = React.useRef(({ viewableItems }) => {
    try {
      const longitude = viewableItems[0]?.item?.Longitude;
      const latitude = viewableItems[0]?.item?.Latitude;
      const Lon = parseFloat(longitude);
      const Lat = parseFloat(latitude);
      longitude || latitude != null ? setCoordinates([Lon, Lat]) : null;
    } catch (error) { }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  setTimeout(() => {
    setLoading(false);
  }, 5000);

  const renderItem = ({ item, index }) => {
    return <RenderItem item={item} width={width} navigation={navigation} />;
  };

  const RenderItem = memo(({ item, width }) => {
    const { PartNo } = route?.params;
    let travelTime = item?.TravelTime;
    return (
      <>
        <View style={{...styles.cardContainer, width:width}}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.renderItemStyles]}
          >
            <View style={{ width: width - 12 }}>
              <EventCardsNearBy
                type={'mapViewCards'}
                part={item?.PartNo}
                Model={item?.Model}
                DisplayName={item?.DisplayName}
                callStatus={callStatus}
                Phone={item?.Phone}
                Available={item?.AvailbleQty}
                TravelTime={travelTime}
                Distance={item?.Distance}
              />
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  });

  return (
    <>
      <HeaderComponent
        title={strings('NearByMap.NearBy_Map')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />
      {route?.params?.data.length == 0 ? (
        msg && <DataNotFound />
      ) : (
        <MapViewContainer
          centerCoordinate={
            coordinates.length > 0 ? coordinates : [1.097456, 49.43709]
          }
          zoomLevel={coordinates.length > 0 ? 4 : 1}
          scrollEnabled={false}
          zoomEnabled={false}>
          {coordinates.length > 0 ? (
            <MarkerView coordinate={coordinates}
            markerColor={colors?.PRIMARY_BACKGROUND_COLOR}
            />

          ) : null}
        </MapViewContainer>
      )}
      <Loader visibility={loading} />
      <View style={styles.flatListStyles}>
        <FlatList
          data={partList}
          keyExtractor={(item, index) => `ID-${index}`}
          renderItem={renderItem}
          horizontal={true}
          pagingEnabled={true}
          scrollEventThrottle={1}
          snapToAlignment={'center'}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          maxToRenderPerBatch={1}
          contentInset={{
            top: 0,
            botton: 0,
            left: normalize(2),
            right: normalize(2),
          }}
          contentContainerStyle={styles.flatlistStyle}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flatListStyles: {
    position: 'absolute',
    bottom: normalize(4),
    paddingVertical: normalize(40),
  },
  renderItemStyles: {
    marginLeft: Platform.OS === 'ios' ? normalize(6) : normalize(5),
    marginRight: Platform.OS === 'ios' ? normalize(6) : normalize(6),
  },
  cardContainer: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  cardStyles: {
    marginBottom: normalize(8),
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
  },
  tabContanier: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNodata: {
    marginTop: normalize(50),
    paddingTop: normalize(30),
    height: normalizeHeight(250),
    width: normalize(300),
  },
  tabText: {
    fontSize: normalize(18),
    color: Colors.greyBtnBorder,
  },
  flatlistStyle:{
    paddingHorizontal: Platform.OS === 'android' ? normalize(2) : 0,
  }
});

export default MainHoc(NearByPartsMapView);
