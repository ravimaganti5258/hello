import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {Text} from '../Text';
import I18n, {strings} from '../../lib/I18n';

const LocaleText = ({name, param = {}, style, color, size, ...props}) => {
  const language = useSelector((state) => state.authReducer.language);
  const [crrLanguage, setCrrLanguage] = useState('');

  useEffect(() => {
    I18n.locale = language;
    setCrrLanguage(language);
  }, []);

  return (
    <Text
      style={[
        {
          alignSelf:
            language == 'ar' || language == 'he' ? 'flex-end' : 'flex-start',
        },
        style,
      ]}
      size={size}
      color={color}
      {...props}>
      {strings(name, param)}
    </Text>
  );
};

LocaleText.propTypes = {
  name: PropTypes.string.isRequired,
  param: PropTypes.any,
  style: PropTypes.any,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default LocaleText;
