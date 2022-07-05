import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Platform, Alert } from 'react-native';
import { Colors } from '../../assets/styles/colors/colors';
import { useColors } from '../../hooks/useColors';
import { Text } from '../Text';
import { normalize, fontFamily } from '../../lib/globals';
import SwipeableComponent from '../Swipeable';
import ConfirmationModal from '../ConfirmationModal';
import { PartsQuantityIcon } from '../../assets/img';
import api from '../../lib/api';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../redux/auth/types';
import { Header } from '../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { FlashMessageComponent } from '../FlashMessge';
import { strings } from '../../lib/I18n';

const PartsCard = ({
  JobId,
  PartRequestNo,
  Description,
  ModelId,
  Quantity,
  image,
  cancel,
  row,
  index,
  allocate,
  route,
  callback,
  finalData,
  selectedIndex,
  dataItem,
  closeRow = () => null,
}) => {
  const { colors } = useColors();

  //state for api
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state.authReducer.userInfo);
  const jobDetail = useSelector((state) => state?.jobDetailReducers);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const dispatch = useDispatch();

  const [showModal, setshowModal] = useState(false);
  const toggleDeallocate = () => {
    getSerialNo();
    setshowModal(!showModal);

  };
  const [serialNoArray, setserialNoArray] = useState([]);
  // const [showModelAllocate, setshowModelAllocate] = useState(false);
  // const toggleAllocate = () => {
  //   setshowModelAllocate(!showModelAllocate);
  // };
  const getSerialNo = () => {
    try {
      const handleCallback = {
        success: (serialNoRes) => {
          setserialNoArray(serialNoRes?.SerialNumbers);
        },
        error: (serialNoError) => { },
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&PartId=${finalData?.PartId}&WhId=${dataItem?.WarehouseId}`;
      api.getSerialNo([], handleCallback, header, endPoint);
    } catch (error) { }
  };
  const [showModelCancle, setshowModelCancle] = useState(false);
  const toggleCancle = () => {
    try {
      row[index]?.close();
      setshowModelCancle(!showModelCancle);
    } catch (error) {
      // row[index]?.close();
      setshowModelCancle(!showModelCancle);
    }
  };

  // to check the image from api
  const [showImage, setShowImage] = useState(false);
  useEffect(() => {
    checkImage();
  }, []);

  const checkImage = () => {
    let value = route;
    if (value) {
      setShowImage(!showImage);
    }
  };

  //api for DeAllocate Request
  const insertAllocateParts = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        CompanyId: userInfo.CompanyId,
        WorkOrderId: dataItem?.WorkOrderId,
        JobId: finalData.JobId,
        PartRequestId: finalData?.PartRequestId,
        PartId: finalData.PartId,
        ReqQty: dataItem.Quantity,
        PartNotes: '',
        IsOEM: 0,
        IsCoreReturn: 0,
        OEMName: '',
        OrderNo: '',
        ShipVia: '',
        ShippingDate: null,
        TrackingNo: '',
        ETADate: null,
        ETATime: '',
        RMANo: '',
        RMATrackingNo: '',
        RMAShippingDate: null,
        RMANotes: '',
        WhId: dataItem?.WarehouseId,
        IsSerialized: serialNoArray.length ? 1 : 0,
        loginid: userInfo?.sub,
        SerialNo: serialNoArray,
        RequestStatusId: finalData.RequestStatusId,
        PartOEM: null,
        SourceID: 2,
        CreatedBy: userInfo?.sub,
        LastChangedBy: null,
        CoreReturnStatusID: null,
        CoreReturnNotes: '',
        partPricing: {

        },
        DropPoint: '',
        OEMPartReqTypeId: 1,
        ReceivedOn: null,
        Attachement: null,
        IsBOQRequest: null,
        VendorId: null,
        BrandId: null,
        ModelId: finalData.ModelId,
        MovingCost: 0,
        IsDeAllocate: 1,
        ApprovalStatusId: dataItem.ApprovalStatusId,
        WoPartPriceId: null,
        ApprovedQty: dataItem.ApprovedQty,
        WarrantyMonths: null,
        InstalledDate: null,
        BOQTechId: null,
      };

      const handleCallback = {
        success: (data) => {
          const msgCode = data?.PoErrorCode;
          FlashMessageComponent('success', strings('MyPartRequirement.Part_deallocated_successfully'));
          // FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          dispatch({ type: SET_LOADER_FALSE });
          setTimeout(() => {
            callback(1);
          }, 300)
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
          FlashMessageComponent('reject', strings('MyPartRequirement.record_not_found'))
        },
      };
      {
        const header = Header(token);
        dispatch({ type: SET_LOADER_FALSE });
        api.getPartRequirementInsertAllocate(data, handleCallback, header);
      }
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  // api for Insert Request tab allocate 

  const insertRequestedParts = () => {

    try {
      dispatch({ type: SET_LOADER_TRUE });
      const payload = {
        CompanyId: userInfo.CompanyId,
        WorkOrderId: dataItem?.WorkOrderId,
        JobId: finalData.JobId,
        PartRequestId: finalData?.PartRequestId,
        PartId: finalData.PartId,
        ReqQty: dataItem?.Quantity,
        PartNotes: '',
        IsOEM: 0,
        IsCoreReturn: 0,
        OEMName: '',
        OrderNo: '',
        ShipVia: '',
        ShippingDate: null,
        TrackingNo: '',
        ETADate: null,
        ETATime: '',
        RMANo: '',
        RMATrackingNo: '',
        RMAShippingDate: null,
        RMANotes: '',
        WhId: dataItem?.WarehouseId,
        IsSerialized: serialNoArray.length ? 1 : 0,
        loginid: userInfo?.sub,
        SerialNo: serialNoArray,
        RequestStatusId: finalData.RequestStatusId,
        PartOEM: null,
        SourceID: 2,
        CreatedBy: userInfo?.sub,
        LastChangedBy: null,
        CoreReturnStatusID: null,
        CoreReturnNotes: '',
        partPricing: {
          // WoPartPriceId: 0,
          // CompanyId: 0,
          // WoJobId: 0,
          // PartRequestId: null,
          // PriceTypeId: 270,
          // Qty: 1,
          // UnitPrice: 0,
          // Description: 'Test P1',
          // DiscountTypeId: 80,
          // Discount: 0,
          // TaskNo: 0,
          // CreatedBy: 32,
          // CreatedDate: null,
          // LastChangedBy: 1687,
          // LastUpdate: null,
          // CreatedSourceId: null,
          // UpdatedSourceId: null,
          // TaxTypeId: 0,
          // TaxIdGroupId: 0,
          // Tax: null,
          // TaxPercent: 0,
        },
        DropPoint: '',
        OEMPartReqTypeId: 1,
        ReceivedOn: null,
        Attachement: null,
        IsBOQRequest: null,
        VendorId: null,
        BrandId: null,
        ModelId: finalData.ModelId,
        MovingCost: 0,
        IsDeAllocate: 0,
        ApprovalStatusId: dataItem?.ApprovalStatusId,
        WoPartPriceId: null,
        ApprovedQty: dataItem.ApprovedQty,
        WarrantyMonths: null,
        InstalledDate: null,
        BOQTechId: null,
      };

      const handleCallback = {
        success: (data) => {
          if (data?.PoErrorCode) {
            dispatch({ type: SET_LOADER_FALSE });
            const msgCode = data?.PoErrorCode;
            if (msgCode.length > 5) {
              FlashMessageComponent(
                'reject',
                strings(`Response_code.${msgCode}`),
              );
            } else if (msgCode.charAt(0) === '9') {
              // FlashMessageComponent(
              //   'success',
              //   strings(`Response_code.${msgCode}`));
              FlashMessageComponent('success', strings('MyPartRequirement.Part_allocated_successfully'));
              setTimeout(() => {
                callback(2);
              }, 500)
            } else {
              FlashMessageComponent(
                'reject',
                strings(`Response_code.${msgCode}`),
              );
            }
          }


        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      {
        const header = Header(token);
        api.getPartRequirementInsertAllocate(payload, handleCallback, header);
      }
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  //api for cancle part
  const handleCancle = () => {
    const data = {
      CompanyId: userInfo?.CompanyId,
      loginid: userInfo?.sub,
      PartRequestId: [
        {
          WojobId: finalData?.JobId,
          PartNo: finalData?.PartNo,
          PartRequestNo: finalData?.PartRequestId,
          Description: finalData?.Description,
          PartReqStatus: finalData?.PartReqStatus,
          RequestedQty: finalData?.Quantity,
          PartId: finalData?.PartId,
          PartReqStatusId: 5,
          PartRequestId: finalData?.PartRequestId,
          AttachmentExists: finalData?.AttachmentExists,
          ApprovalStatus: finalData?.ApprovalStatus,
          ApprovalStatusId: finalData?.ApprovalStatusId,
          IsBOQRequest: finalData?.IsBOQRequest,
          VendorId: userInfo?.VendorId,
          ApproveReason: '',
          ApprovedQty: finalData?.ApprovedQty,
        },
      ],

      SourceID: 2,
    };
    const handleCallback = {
      success: (res) => {
        FlashMessageComponent('success', strings('MyPartRequirement.Part_cancelled_successfully'));
        callback(selectedIndex);
        toggleCancle();
      },
      error: (Error) => {
        toggleCancle();
      },
    };
    const header = Header(token);
    api.cancelParts(data, handleCallback, header);
  };

  //dummy image
  var image = require('../../assets/images/Nature.png');
  return (
    <>
      <SwipeableComponent
        index={index}
        row={row}
        rowOpened={(index) => {
          closeRow(index);
        }}
        containerStyle={styles.SwiperContainer}
        buttons={
          cancel
            ? [
              {
                title: strings('MyPartRequirement.Cancel_Part'),
                action: () => toggleCancle(),
                style: { backgroundColor: Colors.deleateRed },
              },
            ]
            : allocate
              ? [
                {
                  title: strings('MyPartRequirement.Allocate_Part'),
                  action: () => toggleDeallocate(),
                  style: { backgroundColor: Colors.blue },
                },
                {
                  title: strings('MyPartRequirement.Cancel_Part'),
                  action: () => toggleCancle(),
                  style: { backgroundColor: Colors.deleateRed },
                },
              ]
              : [
                {
                  title: strings('MyPartRequirement.Deallocate_Part'),
                  action: () => toggleDeallocate(),
                  style: { backgroundColor: Colors.blue },
                },
                {
                  title: strings('MyPartRequirement.Cancel_Part'),
                  action: () => toggleCancle(),
                  style: { backgroundColor: Colors.deleateRed },
                },
              ]
        }>
        <View style={styles.container}>
          {showImage ? (
            <Image style={styles.imageContainer} source={image} />
          ) : null}
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.text,
                  { color: colors?.PRIMARY_BACKGROUND_COLOR },
                ]}>
                {strings('MyPartRequirement.job')}
                {JobId}
              </Text>
            </View>
            <Text style={styles.otherText}>
              {strings('MyPartRequirement.part')}
              {PartRequestNo}
            </Text>
            <Text style={styles.textModal}>
              {strings('MyPartRequirement.model')}
              {ModelId}
            </Text>
            </View>

          <View style={styles.iconCotainer}>
            <PartsQuantityIcon
              height={normalize(19)}
              width={normalize(18)}
              color={Colors.darkGray}
            />
            <Text style={styles.textNum}>{Quantity}</Text>
          </View>
        </View>
      </SwipeableComponent>
      {showModal ? (
        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={
            allocate != true
              ? strings('confirmation_modal.Deallocate')
              : strings('confirmation_modal.allocate')
          }
          handleModalVisibility={toggleDeallocate}
          visibility={showModal}
          handleConfirm={
            allocate != true ? insertAllocateParts : insertRequestedParts
          }
        />
      ) : (
        // : allocate
        // ? [
        //     <ConfirmationModal
        //       title={'Confirmation'}
        //       discription={'Are you sure want to Allocate the part?' }
        //       handleModalVisibility={toggleDeallocate}
        //       visibility={showModal}
        //       handleConfirm={insertRequestedParts}
        //     />,
        //   ]

        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.cancleMessage')}
          handleModalVisibility={toggleCancle}
          visibility={showModelCancle}
          handleConfirm={handleCancle}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  SwiperContainer: {
    flexDirection: 'row',
    width: normalize(390),
    height: normalize(120),
    borderRadius: 10,
    marginBottom: Platform.OS === 'ios' ? normalize(20) : normalize(5),
    shadowColor: Colors.darkGray,
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  container: {
    backgroundColor: Colors.appGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: normalize(390),
    height: normalize(120),
    borderRadius: 10,
    // marginBottom: Platform.OS === 'ios' ? normalize(20) : normalize(10),
    padding: normalize(10),
    shadowColor: Colors.darkGray,
    // shadowOffset: {
    //   height: normalizeHeight(2),
    //   width: normalize(1),
    // },
  },
  discriptionContainer: {
    flex: 0.4,
    marginVertical: normalize(10),
    flexDirection: 'column',
  },
  imageContainer: {
    width: normalize(130),
    height: normalize(100),
    borderRadius: 10,
    flex: 0.4,
    backgroundColor: Colors.appGray,
  },
  text: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(14),
    marginRight: normalize(100),
    paddingTop: normalize(15),
    marginBottom: normalize(5),
    alignSelf: 'flex-start',
  },
  otherText: {
    fontSize: normalize(16),
    color: Colors.black,
    fontFamily: fontFamily.semiBold,
    marginBottom: normalize(5),
    alignSelf: 'flex-start',
  },
  textModal: {
    fontSize: normalize(16),
    color: Colors.black,
    alignSelf: 'flex-start',
  },
  textDescription: {
    fontSize: normalize(15),
    color: Colors.lightestBlack,
    alignSelf: 'flex-start',
  },
  textNum: {
    color: Colors.greyBtnBorder,
    fontSize: normalize(16),
    fontFamily: fontFamily.semiBold,
    marginLeft: normalize(10),
  },
  iconCotainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default PartsCard;
