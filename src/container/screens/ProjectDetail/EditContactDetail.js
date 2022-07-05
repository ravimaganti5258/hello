import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  I18nManager,
  View,
} from 'react-native';
import {BlackMoreOptionIcon, WhiteRight} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors';
import PairButton from '../../../components/Button/pairBtn';
import {Dropdown} from '../../../components/Dropdown/index';
import CommonHeader from '../../../components/header';
import MainHoc from '../../../components/Hoc/index';
import {Input} from '../../../components/Input';
import {Text} from '../../../components/Text/index';
import {fontFamily, normalize} from '../../../lib/globals.js';
import {strings} from '../../../lib/I18n';
import AddMoreModal from '../JobList/addMore';
import {MASTER_DATA} from '../../../database/webSetting/masterSchema';
import {
  queryAllRealmObject,
  insertNewRealmObject,
} from '../../../database/index';
import Loader from '../../../components/Loader/index.js';
import api from '../../../lib/api/index.js';
import {Header} from '../../../lib/buildHeader.js';
import {useDispatch, useSelector} from 'react-redux';
import {FlashMessageComponent} from '../../../components/FlashMessge';
import {combineReducers} from 'redux';
import {useValidation} from '../../../hooks/useValidation.js';
import {allFieldsValidation} from '../../../lib/validations/validator.js';
import {EMAIL_REGX} from '../../../lib/validations/regex';


const EditContactDetail = ({navigation, route}) => {
  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedTitle, setSelectedTitle] = useState({
    id: 1,
    label: 'Mrs',
    value: 'Mrs',
  });
  const [selectedType, setSelectedType] = useState({});
  const [titleList, setTitleList] = useState([
    {id: 1, label: 'Mrs', value: 'Mrs'},
  ]);
  const [typeList, setTypeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const token = useSelector((state) => state?.authReducer?.token);
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleAddMore();
      },
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetchDatafromRoute();
  }, [route]);

  useEffect(() => {
    // setIsLoading(true);
    fetchDataRealm();
  }, []);

  const fetchDatafromRoute = () => {
    setIsLoading(false);
    const info = route?.params?.contactDetail;
    if (route?.params?.contactDetail) {
      setContactInfo(info);
      setFirstName(info?.FirstName);
      setLastName(info?.LastName);
      setWorkPhone(info?.Phone1);
      setMobile(info?.Phone2);
      setEmail(info?.Email);
      setSelectedType({
        id: info?.CustomerId,
        label: info?.CustomerType,
        value: info?.CustomerType,
      });
      setSelectedTitle(
        `${info?.TitleId}` == 47
          ? 'Mr'
          : `${info?.TitleId}` == 48
          ? 'Mrs'
          : `${info?.TitleId}` == 49
          ? 'Ms'
          : `${info?.TitleId}` == 50
          ? 'Mdm'
          : `${info?.TitleId}` == 51
          ? 'Sir'
          : `${info?.TitleId}` == 52
          ? 'Dr'
          : ''
      );
    }
    setIsLoading(false);
  };
  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];

        const result = res?.TitleNames.map((obj) => {
          let data = {
            id: obj.TitleId,
            label: obj.Title,
            value: obj.Title,
          };
          return data;
        });

        if (result != undefined && result.length > 0) {
         if( route?.params?.contactDetail?.TitleId){
           let title =result.filter(r=> r.id == route?.params?.contactDetail?.TitleId)[0];
           setSelectedTitle(title)
         }
          setTitleList(result);
        }

        const workTypeDropDown = res?.ContactTypes.map((obj) => {
          let data = {
            id: obj.ContactTypeId,
            label: obj.ContactTypeDesc,
            value: obj.ContactTypeDesc,
          };
          return data;
        });
        if (workTypeDropDown != undefined && workTypeDropDown.length > 0) {
          setTypeList(workTypeDropDown);
        }
      })

      .catch((error) => {});
  };

  const onFocusOut = (e, Label) => {
    const res = allFieldsValidation(Label, e.nativeEvent.text);
    res.error && FlashMessageComponent('reject', res.errMessage);
  };

  const validationOnSubmit = () => {
    const list = [
      {name: 'First Name', value: firstName},
      {name: 'Last Name', value: lastName},
    ];

    const err = [];
    list.filter((ele) => {
      const res = allFieldsValidation(ele.name, ele.value);
      return res.error == true ? err.push(res) : false;
    });

    return err;
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
 

  const checkInputValidation = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    const phoneNoValidation = /^[0-9]+([0-9]+)+$/;

    if (reg.test(email) === false) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDEMAILADD'));
      // FlashMessageComponent(strings('Response_code.INVALIDEMAILADD'));
    } else if (!phoneNoValidation.test(mobile) || mobile?.length < 10) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDMOBILENO'));
    } else if (!phoneNoValidation.test(workPhone) || workPhone?.length < 10) {
      FlashMessageComponent('reject', strings('Response_code.INVALIDPHONEENO'));
    }
   else{
    _onPressSubmit();
  }
  
  };
  const _onPressSubmit = () => {
    const errList = validationOnSubmit();

    if (errList?.length == 0) {
      const handleCallback = {
        success: (data) => {

          setIsLoading(false);
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('Warning',  strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
          }
            navigation.goBack();
        },
        error: (error) => {
          setIsLoading(false);
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      setIsLoading(true);
      let data = {
        WoContactId: contactInfo.WoContactId,
        CompanyId: contactInfo.CompanyId,
        WorkOrderId: contactInfo.WorkOrderId,
        WoAddressId: contactInfo.WoAddressId,
        AddressTypeId: contactInfo.AddressTypeId,
        TitleId: selectedTitle.id,
        FirstName: firstName,
        MiddleInitial: contactInfo.MiddleInitial,
        LastName: lastName,
        Phone1: workPhone,
        Phone2: mobile,
        IsPrimary: contactInfo.IsPrimary,
        Fax: contactInfo.Fax,
        Email: email,
        ContactTypeId: contactInfo.CustomerTypeId,
        CreatedBy: contactInfo.CreatedBy,
        CreatedDate: '0001-01-01T00:00:00',
        LastChangedBy: contactInfo.LastChangedBy,
        LastUpdate: '0001-01-01T00:00:00',
        CreatedSourceId: null,
        UpdatedSourceId: 2,
        Title: null,
        ActualContactName: null,
        CreatedSourceLoginId: null,
        UpdatedSourceLoginId: null,
        CustomerId: contactInfo.CustomerId,
        CustomerAddressId: contactInfo.CustAddressId,
        CustomerContactId: contactInfo.CustContactId,
        IsActive: contactInfo.IsActive ? 1 : 0,
      };
      api.updateContactDetails(data, handleCallback, Header(token));
    } else {
      FlashMessageComponent('reject', errList[0].errMessage);
    }
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        title={strings('edit_contact_detail.header_title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
        HeaderRightIcon={headerRightIcons}
      />

      <View style={{padding: normalize(20), flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? normalize(100) : 0}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <Text align={'flex-start'} style={{paddingLeft: normalize(5)}}>
              {strings('edit_contact_detail.title')}
            </Text>
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={selectedTitle?.label ? selectedTitle?.label : selectedTitle}
              list={titleList}
              placeholder={selectedTitle?selectedTitle?.label:'Select'}
              selectedItem={selectedTitle}
              handleSelection={setSelectedTitle}
              zIndexVal={0}
              align={'flex-start'}
              dropDownContainer={{
                borderColor: Colors.darkSecondaryTxt,
                borderRadius: normalize(10),
              }}
              dropDownBodyContainer={{
                borderColor: Colors.darkSecondaryTxt,
                elevation: 10,
              }}
              itemStyle={styles.dropdownTextStyle}
            />

            <Input
              style={[styles.inputFieldStyle]}
              value={firstName}
              onEndEditing={(e) => onFocusOut(e, 'First Name')}
              onChangeText={setFirstName}
              label={strings('edit_contact_detail.first_name')}
              labelStyles={styles.labelStyles}
              containerStyle={styles.InputWrap}
            />

            <Input
              style={[styles.inputFieldStyle]}
              value={lastName}
              onEndEditing={(e) => onFocusOut(e, 'Last Name')}
              onChangeText={setLastName}
              label={strings('edit_contact_detail.last_name')}
              labelStyles={styles.labelStyles}
              containerStyle={styles.InputWrap}
            />
            <View style={{paddingTop: normalize(25)}}>
              <Text align={'flex-start'} style={{paddingLeft: normalize(5)}}>
                {strings('edit_contact_detail.type')}
              </Text>
              <Dropdown
                style={styles.dropDownWrap}
                hasBorder={true}
                placeholder={'Select'}
                label={selectedType.label}
                list={typeList}
                selectedItem={selectedType}
                handleSelection={setSelectedType}
                zIndexVal={0}
                align={'flex-start'}
                dropDownContainer={{
                  borderColor: Colors.darkSecondaryTxt,
                  borderRadius: normalize(10),
                }}
                dropDownBodyContainer={{
                  borderColor: Colors.darkSecondaryTxt,
                  elevation: 10,
                }}
                itemStyle={styles.dropdownTextStyle}
              />
            </View>

            <Input
              style={[styles.inputFieldStyle]}
              value={workPhone}
              maxLength={10}
              onEndEditing={(e) => onFocusOut(e, 'phone')}
              onChangeText={setWorkPhone}
              label={strings('edit_contact_detail.work_phone')}
              labelStyles={styles.labelStyles}
              containerStyle={styles.InputWrap}
              keyboardType={'numeric'}
              validationType={'phone'}
            />

            <Input
              style={[styles.inputFieldStyle]}
              value={mobile}
              maxLength={10}
              onEndEditing={(e) => onFocusOut(e, 'mobile')}
              onChangeText={setMobile}
              label={strings('edit_contact_detail.mobile')}
              labelStyles={styles.labelStyles}
              containerStyle={styles.InputWrap}
              keyboardType={'numeric'}
              validationType={'mobile'}
            />
            <Input
              style={[styles.inputFieldStyle]}
              value={email}
              onEndEditing={(e) => onFocusOut(e, 'email')}
              onChangeText={setEmail}
              label={strings('edit_contact_detail.email')}
              labelStyles={styles.labelStyles}
              containerStyle={styles.InputWrap}
              editable={true}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <View style={styles.footer}>
        <PairButton
          title1={strings('pair_button.cancel')}
          title2={strings('pair_button.update')}
          onPressBtn2={() => checkInputValidation()}
          onPressBtn1={() => navigation.goBack()}
        />
      </View>

      {showAddMore ? (
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}
        />
      ) : null}
      <Loader visibility={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
    flex: 1,
  },
  footer: {
    justifyContent: 'flex-end',
    paddingBottom: normalize(20),
  },
  inputFieldStyle: {
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  InputWrap: {
    borderWidth: 1,
    borderRadius: normalize(10),
    borderColor: Colors.borderColor,
    paddingLeft: Platform.OS == 'ios' ? normalize(5) : normalize(5),
  },
  labelStyles: {
    padding: normalize(5),
    marginLeft: normalize(2),
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(2),
    color: Colors.secondryBlack,
  },
});
export default MainHoc(EditContactDetail);
