import {Alert} from 'react-native';
import PropTypes from 'prop-types';

const ConfirmationAlert = ({
  title,
  message,
  onConfirm,
  cancelBtnText,
  okBtnText = 'Ok',
  thirdBtnText,
  thirdBtnAction,
  toggleAlert,
}) => {
  let Buttons = [];

  if (thirdBtnText != null) {
    const thirdButtom = {
      text: `${thirdBtnText}`,
      onPress: () => {
        thirdBtnAction != null ? thirdBtnAction() : null;
        toggleAlert();
      },
    };

    Buttons.push(thirdButtom);
  }

  if (cancelBtnText != null) {
    const secondButton = {
      text: `${cancelBtnText}`,
      onPress: toggleAlert,
    };

    Buttons.push(secondButton);
  }

  Buttons.push({
    text: `${okBtnText}`,
    onPress: () => {
      onConfirm != null ? onConfirm() : null;
      toggleAlert();
    },
  });

  Alert.alert(`${title}`, `${message}`, Buttons, {cancelable: false});

  return null;
};


ConfirmationAlert.propTypes = {
  title:PropTypes.string.isRequired,
  message:PropTypes.string.isRequired,
  onConfirm:PropTypes.func,
  cancelBtnText:PropTypes.string,
  okBtnText:PropTypes.string,
  thirdBtnText:PropTypes.string,
  thirdBtnAction:PropTypes.func,
  toggleAlert:PropTypes.func.isRequired,
}


export default ConfirmationAlert;
