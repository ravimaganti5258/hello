import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DeleteWhiteIcon, EditWhiteIcon} from '../../assets/img/index';
import {
  addZeroPrecesion,
  fontFamily,
  normalize,
  textSizes,
} from '../../lib/globals';
import {strings} from '../../lib/I18n';
import {EVIL_ICONS} from '../../util/iconTypes';
import ConfirmationModal from '../ConfirmationModal';
import {Icon} from '../Icon';
import ShadowBox from '../ShadowBox';
import {Text} from '../Text';
import {cardStyles as styles} from './styles';
import {accessPermission} from '../../database/MobilePrevi';

const JobTaskCards = ({
  containerStyles,
  taskTimer,
  taskIndex,
  showTaskOption,
  workType,
  workRequest,
  taskBorderRadius = 15,
  cardHeaderStyles,
  day,
  hours,
  minutes,
  handleEdit,
  handleDelete,
  hideDeleteButton,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemForDellete, setselectedItemForDellete] = useState({});
  const [permission, setPermission] = useState({});

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  useEffect(() => {
    accessPermission('Job Details').then((res) => {
      setPermission(res);
    });
  }, []);
  return (
    <>
      <ShadowBox
        containerStyles={{
          borderRadius: normalize(taskBorderRadius),
          ...containerStyles,
        }}>
        <View
          style={{
            ...styles.taskHeader,
            borderTopLeftRadius: normalize(taskBorderRadius),
            borderTopRightRadius: normalize(taskBorderRadius),
            ...cardHeaderStyles,
          }}>
          <Text
            color={'white'}
            size={textSizes.h11}
            fontFamily={fontFamily.bold}>
            {strings('Job_Task_card.task')} {addZeroPrecesion(taskIndex)}
          </Text>
          {showTaskOption ? (
            <View style={styles.taskOptainContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.taskOptionIcon}
                onPress={handleEdit}>
                <EditWhiteIcon width={normalize(16)} height={normalize(16)} />
              </TouchableOpacity>
              {hideDeleteButton == true ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.taskOptionIcon}
                  onPress={() => setShowDeleteModal(true)}>
                  <DeleteWhiteIcon
                    width={normalize(16)}
                    height={normalize(16)}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
        <View
          style={{
            ...styles.taskInfoContainer,
            borderBottomRightRadius: normalize(taskBorderRadius),
            borderBottomLeftRadius: normalize(taskBorderRadius),
          }}>
          <View style={styles.taskTimerContainer}>
            <Icon type={EVIL_ICONS} name={'clock'} size={normalize(16)} />
            <Text align={'flex-end'} size={textSizes.h11}>
              {day > 1 ? ` ${day} Days` : day == 1 ? ` ${day} Day` : ''}
              {hours > 1 ? ` ${hours} Hrs` : ` ${hours} Hr`}
              {minutes > 1 ? ` ${minutes} Mins` : ` ${minutes} Min`}
            </Text>
          </View>
          <Text align={'flex-start'} size={normalize(13)}>
            {strings('Job_Task_card.workType')}
          </Text>
          <Text
            align={'flex-start'}
            fontFamily={fontFamily.semiBold}
            size={textSizes.h10}>
            {workType}
          </Text>
          <Text
            align={'flex-start'}
            size={normalize(13)}
            style={{marginTop: normalize(10)}}>
            {strings('Job_Task_card.RequestType')}
          </Text>
          <Text
            align={'flex-start'}
            fontFamily={fontFamily.semiBold}
            size={textSizes.h10}>
            {workRequest}
          </Text>
        </View>
      </ShadowBox>
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => {
            permission?.Delete && toggleDeleteModal(),
              permission?.Delete && handleDelete();
          }}
          permission={permission?.Delete}
        />
      ) : null}
    </>
  );
};

export default JobTaskCards;
