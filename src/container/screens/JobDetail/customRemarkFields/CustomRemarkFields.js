import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  I18nManager,
} from 'react-native';
import {Colors} from '../../../../assets/styles/colors/colors';
import {fontFamily, normalize} from '../../../../lib/globals';
import {strings} from '../../../../lib/I18n';
import {Text} from '../../../../components/Text';
import {useColors} from '../../../../hooks/useColors';
import api from '../../../../lib/api';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../../../lib/buildHeader';
import {FlashMessageComponent} from '../../../../components/FlashMessge';
import AllCustomeFields from '../../../../components/AllCustomFields';

const CustomFields = ({title, editable, CustomFields, callBack}) => {
  const [edit, setEdit] = useState(false);
  const [comment2, setcomment2] = useState('');
  const {colors} = useColors();
  const [fields, setFields] = useState({});
  const token = useSelector((state) => state?.authReducer?.token);
  const [loading, setLoading] = useState(false);
  const [jobDetailsCutFields, setJobDetailsCutFields] = useState(CustomFields);
  const onSave = () => {
    const handleCallback = {
      success: (data) => {
        setEdit(false);
        setLoading(false);
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        callBack ? callBack() : null;
      },
      error: (err) => {
        setLoading(false);
        console.log(err);
      },
    };

    setLoading(true);
    let data = jobDetailsCutFields;
    const header = Header(token);
    api.insertcustomFields(data, handleCallback, header);
  };
  return (
    <View>

      <AllCustomeFields
        CustomFields={CustomFields}
        editable={editable}
        setCustomFiledData={(data) => {
          setJobDetailsCutFields(data);
        }}
      />
      <Text
        color={colors?.PRIMARY_BACKGROUND_COLOR}
        onPress={
          editable == false ? null 
          : () => {
          setFields({...fields, Value: comment2}), onSave();
        }}
        align={'flex-end'}
        fontFamily={fontFamily.semiBold}>
        {strings('job_detail.save')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(5),
    marginTop: normalize(25),
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: normalize(8),
    borderColor: Colors.borderColor,
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    marginTop: normalize(-10),
    paddingVertical: Platform.OS === 'ios' ? normalize(2) : 0,
    height: 'auto',
    
  },
  textInput: {
    fontSize: normalize(13),
    padding: normalize(10),
    paddingLeft: normalize(10),
    height: 'auto',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    
  },
});
export default CustomFields;
