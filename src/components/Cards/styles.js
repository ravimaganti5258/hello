import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/styles/colors/colors';

import {normalize} from '../../lib/globals';

export const cardStyles = StyleSheet.create({
  container: {
    padding: normalize(14),
    paddingTop: normalize(12),
  },
  headerStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyles: {
    marginRight: normalize(7),
  },
  imageStyles: {
    height: normalize(85),
    width: normalize(83),
    borderRadius: normalize(6),
    marginRight: normalize(10),
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalize(10),
    minHeight: normalize(70),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  timeOffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(10),
  },
  numContainer: {
    height: normalize(80),
    width: normalize(83),
    backgroundColor: Colors.lightYellow,
    borderRadius: normalize(10),
    marginRight: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  notificationContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.7,
    borderTopColor: Colors.darkGray,
    paddingVertical: normalize(10),
  },
  notificationDetails: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: normalize(2),
  },
  notificationIcon: {
    padding: normalize(3),
    borderRadius: normalize(50),
    alignSelf: 'flex-start',
    margin: normalize(4),
  },
  taskContainer: {
    borderRadius: normalize(10),
    backgroundColor: 'tomato',
  },
  taskHeader: {
    backgroundColor: 'darkblue',
    padding: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTimerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  taskInfoContainer: {
    padding: normalize(8),
    backgroundColor: Colors.appGray,
  },
  taskOptainContainer: {
    flexDirection: 'row',
  },
  taskOptionIcon: {
    marginHorizontal: normalize(8),
    padding: normalize(2),
  },
  shadowContainer: {
    padding: normalize(6),
    borderLeftWidth: normalize(6),
  },
  jobNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTxtContainer: {
    paddingVertical: normalize(2),
    paddingHorizontal: normalize(10),
    backgroundColor: Colors.extraLightBlue,
    borderRadius: normalize(3),
  },
  notesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.darkGray,
    paddingBottom: normalize(10),
    marginTop: normalize(8),
  },
  eventCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(5),
    paddingTop: normalize(5),
    borderTopWidth: 0.5,
    borderTopColor: Colors.darkGray,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
