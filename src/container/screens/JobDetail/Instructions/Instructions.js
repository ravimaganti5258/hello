import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EditBlackIcon, DeleteBlackIcon, PlusIcon } from '../../../../assets/img';
import { Colors } from '../../../../assets/styles/colors/colors';
import Button from '../../../../components/Button';
import { FlashMessageComponent } from '../../../../components/FlashMessge';
import { Text } from '../../../../components/Text';
import { useColors } from '../../../../hooks/useColors';
import api from '../../../../lib/api';
import { Header } from '../../../../lib/buildHeader';
import {
  fontFamily,
  normalize,
  textSizes,
  timConvert,
} from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import TechnicianRemarkModal from '../TechnicianRemarkModal';
import ConfirmationModal from '../../../../components/ConfirmationModal/index.js';
import { SET_LOADER_FALSE } from '../../../../redux/auth/types';

const ButtonArray = ['Service Notes', 'Technician Remarks', 'Instructions'];

const Instructions = ({
  Selected,
  serviceNote,
  techRemark,
  instruction,
  text,
  WorkOrderId,
  jobId,
  callback,
  isAccept,
  submittedSource
}) => {
  const { colors } = useColors();
  const [selectedIndex, setselectedIndex] = useState(0);
  const [verScroll, setverScroll] = useState();
  const [hrScroll, sethrScroll] = useState();
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const scrollViewRef = useRef(null);
  const [showTechRemark, setShowTechRemark] = useState(false);
  const [selctedText, setSelectedText] = useState();
  const [noteId, setNoteId] = useState();
  const [edit, setedit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemForDellete, setselectedItemForDellete] = useState({});
  const dispatch = useDispatch();

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const toggleTechRemark = () => {
    setShowTechRemark(!showTechRemark);
  };

  const autoScroll = (index) => {
    index > 0
      ? scrollViewRef.current.scrollToEnd({ animated: true })
      : scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  // api function for delete api
  const deleteNotesApiCall = () => {
    toggleDeleteModal();

    const item = selectedItemForDellete;
    const handleCallback = {
      success: (data) => {
        dispatch({ type: SET_LOADER_FALSE });
        FlashMessageComponent('success', strings('flashmessage.Deleted_successfully'));
        // callback()
        let cbId =
          ButtonArray[selectedIndex] === 'Service Notes'
            ? 0
            : ButtonArray[selectedIndex] == 'Technician Remarks'
              ? 1
              : 2;
        callback(cbId);
      },
      error: (error) => {
        console.log(error);
      },
    };
    const endPoint = `?CompanyId=${userInfo?.CompanyId}&NotesID=${item?.NotesID}`;

    let headers = Header(token);
    api.deleteNotes('', handleCallback, headers, endPoint);

  };

  const ProgressBar = ({ title, onClick, count, setIndex, index, listCount }) => {
    return (
      <>
        <View style={{}}>
          <Button
            title={title}
            onClick={() => {
              setIndex(index);
              autoScroll(index);
            }}
            backgroundColor={Colors?.white}
            fontSize={normalize(14)}
            fontFamily={fontFamily.bold}
            width={'auto'}
            style={{ padding: normalize(10), margin: normalize(6) }}
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
                  : Colors.greyBorder,
                height: count ? normalize(2) : normalize(1),
              },
            ]}
          />
        </View>
      </>
    );
  };

  //**information/remark/notes details ui for data*/
  const InfoWrap = ({ data, userInfo }) => {
    const jobInfo = useSelector(
      (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation
    );
    const splitData = data.CreatedDate?.split('T');
    const time = timConvert(splitData[1]);
    const { CreatedBy } = data
    return (
      <View style={styles.infoContainer}>
        <Text align={'flex-start'} color={Colors.seviceNoteColor}>
          {data.Note}
        </Text>
        <View style={styles.fRWSB}>
          <View style={styles.notes}>
            <Text
              align="center"
              style={styles.createdByStyle}
              color={Colors.userTextColor}>
              - {data.CreatedByName},
              <Text color={Colors.dateColor}>
                {' '}
                {data?.LastUpdatesmobile ?data?.LastUpdatesmobile.split(' ')[0] :data?.CreatedDatesmobile.split(' ')[0]}
                {'  '}
              </Text>
              <Text color={Colors.dateColor} style={styles.timeStyle}> {data?.LastUpdatesmobile ? data?.LastUpdatesmobile.split(' ')[1] + ' ' + data?.LastUpdatesmobile.split(' ')[2]: data?.CreatedDatesmobile.split(' ')[1] + ' ' + data?.CreatedDatesmobile.split(' ')[2]}</Text>
            </Text>
          </View>
          {isAccept === 1 && CreatedBy == userInfo.sub && submittedSource != 2 && (
            <View style={styles.editBtnWrap}>
              <TouchableOpacity
                onPress={
                  () => {
                    toggleTechRemark();
                    setedit(true);
                    setSelectedText(data.Note);
                    setNoteId(data.NotesID);
                  }
                }>
                <EditBlackIcon width={normalize(16)} height={normalize(15)} />
              </TouchableOpacity>
              {CreatedBy === jobInfo?.TechId ?
                <TouchableOpacity
                onPress={
                  () => {
                    toggleDeleteModal();
                    setselectedItemForDellete(data);
                  }
                }>
                <DeleteBlackIcon width={normalize(12)} height={normalize(17)} />
              </TouchableOpacity>
              :
              null
              }
              
            </View>
          )}
        </View>
      </View>
    );
  };

  //render function for the instruction, notes & remark
  const renderInfo = (val) => {
    switch (val) {
      case 0:
        return (
          <>
            {serviceNote?.length > 0 ? (
              serviceNote?.map((item, index) => {
                return (
                  <>
                    <InfoWrap data={item} key={`ID-${index}`} userInfo={userInfo} />
                    {serviceNote?.length - 1 > index && renderSeprator()}
                  </>
                );
              })
            ) : (
              <View style={{ padding: normalize(30) }}>
                <Text>{strings('notes.No_Notes_Found')}</Text>
              </View>
            )}
          </>
        );

      case 1:
        return (
          <>
            {techRemark?.length > 0 ? (
              techRemark?.map((item, index) => {
                return (
                  <>
                    <InfoWrap data={item} key={`ID-${index}`} userInfo={userInfo} />
                    {techRemark?.length - 1 > index && renderSeprator()}
                  </>
                );
              })
            ) : (
              <View style={{ padding: normalize(30) }}>
                <Text>{strings('notes.No_Technician_Remarks_Found')}</Text>
              </View>
            )}
          </>
        );
      case 2:
        return (
          <>
            {instruction?.length > 0 ? (
              instruction?.map((item, index) => {
                return (
                  <>
                    <InfoWrap data={item} key={`ID-${index}`} userInfo={userInfo} />
                    {instruction?.length - 1 > index && renderSeprator()}
                  </>
                );
              })
            ) : (
              <View style={{ padding: normalize(30) }}>
                <Text>{strings('notes.No_Instructions_Found')}</Text>
              </View>
            )}
          </>
        );

      default:
        return (
          <>
            {serviceNote?.map((item, index) => {
              return (
                <>
                  <InfoWrap data={item} key={`ID-${index}`} userInfo={userInfo} />
                  {serviceNote?.length - 1 > index && renderSeprator()}
                </>
              );
            })}
          </>
        );
    }
  };
  const renderSeprator = () => {
    return <View style={styles.itemSeperator} />;
  };

  return (
    <>
      <View style={[styles.container]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          ref={scrollViewRef}
          scrollEnabled={true}
          scrollsToTop={true}
          onScroll={(event) => {
            sethrScroll(event.nativeEvent.contentOffset.x),
              setverScroll(event.nativeEvent.contentOffset.y);
          }}>
          <View style={styles.fRow}>
            {ButtonArray.map((item, index) => {
              return (
                <ProgressBar
                  title={strings(`notes.${item}`)}
                  onClick={() => { }}
                  count={selectedIndex === index ? true : false}
                  setIndex={(val) => setselectedIndex(val)}
                  index={index}
                  listCount={
                    index === 0
                      ? serviceNote?.length
                      : index === 1
                        ? techRemark?.length
                        : instruction?.length
                  }
                />
              );
            })}
          </View>
        </ScrollView>
        <View
          style={{
            maxHeight: normalize(200),
            minHeight: normalize(150),
            paddingVertical: normalize(10),

          }}>
          <ScrollView nestedScrollEnabled={true}>
            {renderInfo(selectedIndex)}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.addTaskContainer, { padding: normalize(12) }]}>
        <PlusIcon
          height={normalize(10)}
          width={normalize(10)}
          fill={colors?.PRIMARY_BACKGROUND_COLOR}
        />
        <Text
          color={colors?.PRIMARY_BACKGROUND_COLOR}
          style={styles.addTaskText}
          onPress={isAccept == 1 && submittedSource != 2 ?
            () => {
              toggleTechRemark();
              setedit(false);
            } : null
          }>
          {strings('notes.add')}
        </Text>
      </View>

      <TechnicianRemarkModal
        handleModalVisibility={toggleTechRemark}
        visibility={showTechRemark}
        title={ButtonArray[selectedIndex]}
        text={selctedText}
        getNoteId={noteId}
        edit={edit}
        WorkOrderId={WorkOrderId}
        jobId={jobId}
        callback={callback}
        
      />
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('notes.Confirmation')}
          discription={strings('notes.Are_you_sure_want_to_Delete')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={deleteNotesApiCall}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: normalize(20),
    borderWidth: normalize(1),
    borderColor: Colors?.greyBorder,
    borderRadius: normalize(8),
    backgroundColor: Colors?.white,
  },
  fRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  itemSeperator: {
    height: normalize(1),
    backgroundColor: Colors.greyBorder,
    marginHorizontal: normalize(15),
    marginVertical: normalize(5),
  },
  progressBarSepLine: {
    width: '100%',
  },
  infoContainer: {
    marginHorizontal: normalize(18),
    marginVertical: normalize(15),
  },
  fRWSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notes: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  editBtnWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.18,
    alignSelf: 'center',
  },
  createdByStyle: {
    paddingTop: normalize(5),
    flex: 1,
    top: normalize(-4),
    textAlign: 'left',
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  addTaskText: {
    fontFamily: fontFamily.bold,
    fontSize: textSizes.h11,
    alignSelf: 'flex-end',
    marginLeft: normalize(7),
  },
  timeStyle: {
    paddingLeft: normalize(50)
  }
});

export default Instructions;
