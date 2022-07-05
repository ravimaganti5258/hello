import React, {useState} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';

import HeaderComponent from '../../../components/header';
import {Colors} from '../../../assets/styles/colors/colors';
import {fontFamily, normalize, normalizeHeight} from '../../../lib/globals.js';
import {strings} from '../../../lib/I18n';
import Button from '../../../components/Button';
import PartsCard from '../../../components/MyPartRequirement/PartsCard';
import MainHoc from '../../../components/Hoc';
import {useColors} from '../../../hooks/useColors';
import api from '../../../lib/api';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../../lib/buildHeader';
import Loader from '../../../components/Loader';
import {DataNotFound} from '../../../components/DataNotFound';

const ButtonArray = ['Allocated', 'Requested', 'Awaiting'];
const MyPartRequirement = ({children, style, onClick, navigation, ...rest}) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const {colors} = useColors();

  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState(false);
  const [allocateCount, setallocateCount] = useState(0);
  const [requestedCount, setrequestedCount] = useState(0);
  const [awaitingCount, setawaitingCount] = useState(0);
  const [allPart, setAllPart] = useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getAllPartRequirement(selectedIndex);
  }, [selectedIndex]);
  const sortParts = (Part) => {
    let requested = [];
    let Allocated = [];
    let Awaiting = [];

    Part.map((ele) => {
      ele.PartReqStatus == 'Requested'
        ? requested.push(ele)
        : ele.PartReqStatus == 'Awaiting Part'
        ? Awaiting.push(ele)
        : Allocated.push(ele);
    });
    setallocateCount(Allocated.length);
    setrequestedCount(requested.length);
    setawaitingCount(Awaiting.length);
    selectedIndex == 0
      ? setUserData(Allocated)
      : selectedIndex == 1
      ? setUserData(requested)
      : setUserData(Awaiting);
  };
  /* for getting PartRequirement */
  const getAllPartRequirement = (index) => {
    try {
      dispatch({type: SET_LOADER_TRUE});
      const handleCallback = {
        success: (data) => {
          setUserData(data);
          setAllPart(data);
          sortParts(data);
          setselectedIndex(index);
          dispatch({type: SET_LOADER_FALSE});
          setMessage(true);
        },
        error: (error) => {
          dispatch({type: SET_LOADER_FALSE});
          setMessage(true);
        },
      };
      setMessage(false);
      setUserData([]);
      const header = Header(token);

      const endPoint = `?CompanyId=${userInfo?.CompanyId}&TechId=${userInfo?.sub}`;
      api.getAllPartRequirement('', handleCallback, header, endPoint);
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  /*render of (Allocated part) */

  const renderItem = ({item, cancel, allocate, index, row}) => {
    return (
      <PartsCard
        JobId={item?.JobId}
        Description={item?.Description}
        PartRequestNo={item?.PartRequestNo}
        image={item?.image}
        ModelId={item?.ModelId}
        Quantity={item?.Quantity}
        cancel={cancel}
        dataItem={item}
        allocate={allocate}
        index={index}
        row={row}
        callback={(id) => {
          getAllPartRequirement(id);
        }}
        finalData={item}
        selectedIndex={selectedIndex}
        closeRow={(index) => closeRow(index)}
      />
    );
  };

  /* First Tab */
  const Allocated = () => {
    return (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userData}
          keyExtractor={(data, index) => index?.toString()}
          renderItem={({item, index}) =>
            renderItem({item, index: index, row: row})
          }
        />
      </View>
    );
  };

  /* Second Tab */
  const Requested = () => {
    return (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userData}
          keyExtractor={(data, index) => index?.toString()}
          renderItem={({item, index}) =>
            renderItem({item, index: index, allocate: true, row: row})
          }
        />
      </View>
    );
  };
  /* Third Tab */
  const Awaiting = () => {
    return (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userData}
          keyExtractor={(data, index) => index?.toString()}
          renderItem={({item, index}) =>
            renderItem({item, index: index, cancel: true, row: row})
          }
        />
      </View>
    );
  };

  const ProgressBar = ({title, count, setIndex, index, listCount}) => {
    return (
      <>
        <View>
          <Button
            title={strings(`MyPartRequirement.${title}`)}
            onClick={() => {
              setIndex(index);
            }}
            backgroundColor={Colors.white}
            fontSize={normalize(16)}
            txtColor={
              count == 0
                ? Colors?.greyBtnBorder
                : colors?.PRIMARY_BACKGROUND_COLOR
            }
            fontFamily={count == 0 ? fontFamily?.light : fontFamily?.semiBold}
            width={'auto'}
            style={styles.buttonStyle}
            rightText={
              listCount != undefined && listCount > 0 ? ` (${listCount})` : ''
            }
          />
          <View
            style={[
              styles.progressBarSepLine,
              {
                backgroundColor: count
                  ? colors?.PRIMARY_BACKGROUND_COLOR
                  : Colors?.greyBorder,
                height: normalize(3),
                width: normalize(150),
              },
            ]}
          />
        </View>
      </>
    );
  };

  const renderInfo = (val) => {
    switch (val) {
      case 0:
        return (
          <>
            {userData.length > 0 ? <Allocated /> : message && <DataNotFound />}
          </>
        );
      case 1:
        return (
          <>
            {userData?.length > 0 ? <Requested /> : message && <DataNotFound />}
          </>
        );
      case 2:
        return (
          <>
            {userData?.length > 0 ? <Awaiting /> : message && <DataNotFound />}
          </>
        );
      default:
        return <Awaiting />;
    }
  };

  let row = [];

  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }

    prevOpenedRow = row[index];
  };

  return (
    <>
      <View style={{flex: 1}}>
        <HeaderComponent
          title={strings('MyPartRequirement.MyPart_Requirement')}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyle}
        />
        <View style={styles.fRow}>
          {ButtonArray.map((item, index, row) => {
            return (
              <ProgressBar
                title={item}
                onClick={() => {}}
                count={selectedIndex === index ? true : false}
                setIndex={(val) => setselectedIndex(val)}
                index={index}
                key={`ID-${index}`}
                row={row}
                listCount={
                  index === 0
                    ? allocateCount
                    : index === 1
                    ? requestedCount
                    : awaitingCount
                }
              />
            );
          })}
        </View>
        <>
          {isLoading ? <Loader visibility={isLoading} /> : null}
          <View style={{flex: 1}}>{renderInfo(selectedIndex)}</View>
        </>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  /* custom Header component */
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
  },

  /* Top header bar */
  fRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: normalize(5),
  },
  progressBarSepLine: {
    width: 'auto',
  },
  container: {
    margin: normalize(10),
  },
  tabContanier: {
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
  buttonStyle: {
    padding: normalize(5),
    margin: normalize(5),
  },
});
export default MainHoc(MyPartRequirement);
