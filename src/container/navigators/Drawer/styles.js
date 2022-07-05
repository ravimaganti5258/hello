import { StyleSheet, Platform, I18nManager } from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sideMenuHeader: {
    flex: normalize(0.2),
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? normalize(10) : normalize(25),
    backgroundColor: Colors.lightBackground,
    paddingVertical: normalize(20),
    padding: normalize(15),
  },
  headerRow1: {
    flexDirection: 'row',
    marginTop: normalize(20),
    justifyContent: 'space-between',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    flex: 2,
  },
  imgStyle: {
    height: normalize(60),
    width: normalize(60),
    alignSelf: 'center',
  },
  profileDetailStyle: {
    paddingHorizontal: normalize(12),
    flexShrink: 1,
    paddingVertical: normalize(5),
  },
  profileName: {
    fontSize: normalize(16),
    // color: Colors.darkestBlue,
    fontFamily: fontFamily.bold,
  },
  emailField: {
    paddingVertical: normalize(2),
    fontSize: normalize(13),
    color: Colors.mediumDarkGrey,
    fontFamily: fontFamily.regular,
  },
  fRow: {
    flexDirection: 'row',
  },
  startStyle: {
    marginRight: normalize(5),
    alignSelf: 'center',
  },
  headerBtnwrap: {
    flexDirection: 'row',
    flex: 1,
    marginTop: normalize(10),
    marginRight: normalize(5),
  },
  checkBtnStyle: {
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: normalize(3),
    opacity: 1,
    paddingVertical: normalize(5),
  },
  logOutBtn: {
    marginVertical: normalize(12),
    transform: I18nManager.isRTL ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }],
  },
  logBtnStyle: {
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: normalize(3),
    opacity: 1,
  },
  sideMenuContainer: {
    flex: 1,
    paddingVertical: normalize(10),
  },
  menuBtnWrap: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
  },
  menuWrap: {
    flexDirection: 'row',
    flex: 1,
  },
  menuText: {
    fontSize: normalize(16),
    flex: 1,
    color: Colors.secondryBlack,
    fontFamily: fontFamily.regular,
    textAlign: I18nManager.isRTL ? 'left' : 'left',
  },
  menuIcon: {
    marginRight: normalize(10),
    flex: 0.12,
    alignSelf: 'center',
  },
  toggleArrowWrap: {
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  subMenuBtnWrap: {
    flexDirection: 'row',
    padding: normalize(10),
  },
  subMenuContainer: {
    marginLeft: normalize(30),
    marginVertical: normalize(5),
  },
  subMenuTextStyle: {
    fontSize: normalize(15),
  },
  bottomMenuSep: {
    height: normalize(2),
    marginVertical: normalize(10),
    backgroundColor: Colors.lightSilver,
    marginHorizontal: normalize(20),
  },
});
