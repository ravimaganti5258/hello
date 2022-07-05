import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../assets/styles/colors/colors';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import MultiButton from '../../../components/MultiButton';
import api from '../../../lib/api';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {SET_LOADER_FALSE, SET_LOADER_TRUE} from '../../../redux/auth/types';
import {getCurrentDateString} from '../../../util/helper';
import RejectReasonModal from './RejectReasonModal';

const AcceptRejectContainer = ({getWorkOrderAppointment, ...props}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [acceptToggle, setacceptToggle] = useState('');

  const dispatch = useDispatch();

  const toggleRejectModal = () => {
    setShowRejectModal(!showRejectModal);
  };

  const acceptRejectBtn = [
    {
      btnName: strings('job_detail.reject'),
      onPress: () => toggleRejectModal(),
      btnStyles: {...styles.btnHeight, ...styles.rejectBtnStyles},
      btnTxtStyles: styles.btnTxtStyles,
    },
    {
      btnName: strings('job_detail.accept'),
      onPress: () => handleAcceptRejectPayload(),
      btnStyles: {...styles.btnHeight, ...styles.acceptBtnStyles},
      btnTxtStyles: styles.btnTxtStyles,
    },
  ];

  useEffect(() => {
    props.toggleContainer(acceptToggle);
  }, [acceptToggle]);

  const token = useSelector((state) => state?.authReducer?.token);

  const updateAcceptanceStatus = (data, handleCallback) => {
    try {
      api.updateAcceptRejectJob(data, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      dispatch({type: SET_LOADER_FALSE});
    }
  };

  //api for job accept
  const handleAcceptRejectPayload = (
    AcceptanceStatusId = 1,
    AcceptanceReasonId = null,
    callback,
  ) => {
    const AcceptanceDate = `${getCurrentDateString()}T00:00:00`;

    const data = {
      CompanyId: getWorkOrderAppointment?.CompanyId,
      WoJobId: getWorkOrderAppointment?.WoJobId,
      AcceptanceStatusId: AcceptanceStatusId,
      AcceptanceUserId: getWorkOrderAppointment?.TechId,
      AcceptanceDate: AcceptanceDate,
      AcceptanceSourceId: 1,
      AcceptanceReasonId: AcceptanceReasonId,
      woId: getWorkOrderAppointment?.WorkOrderId,
      woAppointMentId: getWorkOrderAppointment?.WoAppointmentId,
    };
    const handleCallback = {
      success: (acceptResponse) => {
        dispatch({type: SET_LOADER_FALSE});
        FlashMessageComponent('success', strings('flashmessage.Job_accepted'));
        setTimeout(() => {
        setacceptToggle('accept');
        }, 1000);
      },
      error: (acceptResponseError) => {
        dispatch({type: SET_LOADER_FALSE});
      },
    };
    dispatch({type: SET_LOADER_TRUE});

    AcceptanceStatusId == 2
      ? updateAcceptanceStatus(data, callback)
      : updateAcceptanceStatus(data, handleCallback);
  };

  return (
    <>
      <MultiButton
        constinerStyles={styles.multiBtnContainer}
        buttons={acceptRejectBtn}
      />
      {showRejectModal ? (
        <RejectReasonModal
          visibility={showRejectModal}
          handleModalVisibility={toggleRejectModal}
          updateAcceptanceStatus={handleAcceptRejectPayload}
          toggle={props.toggleContainer}
        />
      ) : null}
    </>
  );
};

export default AcceptRejectContainer;

const styles = StyleSheet.create({
  multiBtnContainer: {
    backgroundColor: Colors?.popUpLightGreyBackground,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(15),
  },
  btnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors?.white,
    fontFamily: fontFamily?.semiBold,
  },
  btnHeight: {
    height: normalize(36),
  },
  rejectBtnStyles: {
    backgroundColor: Colors?.dangerRed,
  },
  acceptBtnStyles: {
    backgroundColor: Colors?.successGreen,
  },
});
