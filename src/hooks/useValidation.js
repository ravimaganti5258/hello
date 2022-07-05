import {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';

import {
  emailValidator,
  nameValidator,
  passwordValidator,
  phoneNoValidator,
} from '../lib/validations/validator';

export const useValidation = (type = 'name', defValue = '') => {
  const [value, setValue] = useState(defValue);
  const [valueErr, setValueErr] = useState('');
  const navigation = useNavigation();

  const clearState = () => {
    setValueErr('');
    setValue('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', clearState);
    return unsubscribe;
  }, [navigation]);

  const setValues = (inputValue, response) => {
    if (response.error) {
      setValue(inputValue);
      setValueErr(response.errMessage);
    } else {
      setValue(inputValue);
      setValueErr('');
    }
  };
  const handleValidation = (inputValue) => {
    switch (type) {
      case 'email':
        {
          const response = emailValidator(inputValue);
          setValues(inputValue, response);
        }
        break;
      case 'password':
        {
          const response = passwordValidator(inputValue);
          setValues(inputValue, response);
        }
        break;
      case 'name':
      case 'First Name':
      case 'Last Name':
        {
          const response = nameValidator(inputValue, type);
          setValues(inputValue, response);
        }
        break;
      case 'phone':
        {
          const response = phoneNoValidator(inputValue);
          setValues(inputValue, response);
        }
        break;
      default:
        console.log('Invalid Type');
    }
  };

  return [value, valueErr, handleValidation, setValue];
};
