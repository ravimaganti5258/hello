import React, {useState} from 'react';

import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Dashboard from '../../screens/Dashboard';
import AddPricing from '../../screens/Pricing/AddPricing';
import Settings from '../../screens/Settings';
import {normalize} from '../../../lib/globals';
import UserName from '../../screens/AuthScreens/UserName';
import {Colors} from '../../../assets/styles/colors/colors';
import Equipments from '../../screens/Equipments';
import Notification from '../../screens/Notifications';
import {
  CloseWhiteIcon,
  MoreOptionIcon,
  NotificationBell,
  OpenMenu,
  WhiteSearchIcon,
} from '../../../assets/img';
import {useColors} from '../../../hooks/useColors';
import TodayLog from '../../screens/TodayLog/TodayLog';
import ChangePassword from '../../screens/AuthScreens/ChangePassword';
import TimeOffHistory from '../../screens/TimeOffHistory';
import ApplyTimeOff from '../../screens/TimeOff/ApplyTimeOff';
import JobStack from './JobStack';
import EditPricing from '../../screens/Pricing/EditPricing';
import AddNewEquipment from '../../screens/Equipments/AddNewEquipment';
import EquipmentList from '../../screens/Equipments/EquipmentList';
import SelectEquipment from '../../screens/Equipments/SelectEquipment';
import PriceDetails from '../../screens/Pricing/PriceDetails';

import SlaDetails from '../../screens/SlaDetails/SlaDetails';
import Incidents from '../../screens/Incident/Incident';
import SignatureAndFeedback from '../../screens/SignatureAndFeedback/SignatureAndFeedback';
import OtherInformation from '../../screens/OtherInformations/OtherInformation';
import AddIncident from '../../screens/Incident/AddIncident';
import NearByTechnician from '../../screens/NearbyTechnician/nearByTechnicians';
import MyProfile from '../../screens/Profile/myProfile';
import EditProfile from '../../screens/Profile/editProfile';
import RecentJobs from '../../screens/RecentJob/RecentJobs';

import PdfViewer from '../../screens/Equipments/pdfViewer';

import SyncData from '../../screens/DataSync/SyncData';
import NearByPart from '../../screens/NearByParts/NearByParts';
import NearBy from '../../screens/NearBy/NearByPartsMapView';
import NearByPartsMapView from '../../screens/NearBy/NearByPartsMapView';
import MyPartRequirement from '../../screens/PartRequirement/MyPartRequirement';
import MyPartInventory from '../../screens/MyPartInventory/MyPartInventory';
import PartDetails from '../../screens/MyPartInventory/PartDetails/PartDetails';
import PrivacyPolicy from '../../screens/PrivacyPolicy/PrivacyPolicy';
import AddMoreModal from '../../screens/JobList/addMore'
import SearchBar from '../../../components/SearchBar/index.js';
import {useDispatch} from 'react-redux';
import {setSearchBarVisibility} from '../../../redux/Profile/action';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const DashBoardHeaderRight = (props) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState([]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
    dispatch(setSearchBarVisibility(!showSearch));
  };
  const handleCancelSearch = () => {
    try {
      toggleSearchIcon();
    } catch (error) {}
  };
  const searchAction = () => {
    if (searchQuery) {
    }
  };

  return (
    <View {...props} style={styles.headerRightStyles}>
      <TouchableOpacity onPress={() => handleCancelSearch()}>
        {showSearch ? (
          <CloseWhiteIcon width={normalize(20)} height={normalize(20)} />
        ) : (
          <WhiteSearchIcon width={normalize(22)} height={normalize(21)} />
        )}
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.notificationBellStyles}
        onPress={() => navigation.navigate('Notification')}>
        <NotificationBell width={normalize(22)} height={normalize(21)} />
      </TouchableOpacity> */}
     
      <TouchableOpacity 
      onPress={() => toggleAddMore()}>
        <AddMoreModal
          handleModalVisibility={toggleAddMore}
          visibility={showAddMore}

        />
        <MoreOptionIcon width={normalize(20)} height={normalize(20)}
       
        />
      </TouchableOpacity>
    </View>
  );
};

const JobListMainStack = (props) => {
  const Stack = createStackNavigator();
  const {colors} = useColors();
  const decyptedTokenInfo = useSelector(
    (state) => state.authReducer?.tokenDecryption,
  );
  const defaultScreen = useSelector((state) => state?.authReducer?.screen);

  // const value =  AsyncStorage.getItem('JobList');

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
        }}
        initialRouteName={
          'JobList'
          //   decyptedTokenInfo?.IsChangePassword != '0'
          //     ? 'changePassword'
          //   :
          //   defaultScreen == 'JobList' ? 'JobList' : 'Dashboard'
        }>
        <Stack.Screen
          name={'JobList'}
          component={JobStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Dashboard'}
          component={Dashboard}
          options={({navigation}) => ({
            //headerShown: false,
            headerStyle: {
              ...styles.dashboardStyles,
              backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
            },
            headerTitle: '',
            headerRight: (props) => <DashBoardHeaderRight {...props} />,
            headerLeft: (props) => (
              <TouchableOpacity
                activeOpacity={0.8}
                {...props}
                onPress={() => navigation.openDrawer()}
                style={styles.menuIcon}>
                <OpenMenu width={normalize(25)} height={normalize(20)} />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen name={'Login'} component={UserName} />
        <Stack.Screen
          name={'Equipment'}
          component={Equipments}
          options={{
            headerStyle: {
              backgroundColor: Colors.white,
              ...styles.headerStyles,
            },
            headerTintColor: Colors.black,
          }}
        />
        <Stack.Screen
          name={'Notification'}
          component={Notification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Settings'}
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'PrivacyPolicy'}
          component={PrivacyPolicy}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'TodaysLog'}
          component={TodayLog}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddPricing'}
          component={AddPricing}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EditPricing'}
          component={EditPricing}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddNewEquipment'}
          component={AddNewEquipment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EquipmentList'}
          component={EquipmentList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'changePassword'}
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'TimeOffHistory'}
          component={TimeOffHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddIncident'}
          component={AddIncident}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'ApplyTimeOff'}
          component={ApplyTimeOff}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={'NearBy'}
          component={NearBy}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'SelectEquipment'}
          component={SelectEquipment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'PriceDetails'}
          component={PriceDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'SlaDetails'}
          component={SlaDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Incidents'}
          component={Incidents}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'SignatureAndFeedback'}
          component={SignatureAndFeedback}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'OtherInformation'}
          component={OtherInformation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'NearByTechnician'}
          component={NearByTechnician}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'MyProfile'}
          component={MyProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EditProfile'}
          component={EditProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'RecentJobs'}
          component={RecentJobs}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={'SyncData'}
          component={SyncData}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'NearByPart'}
          component={NearByPart}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'NearByPartsMapView'}
          component={NearByPartsMapView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'MyPartRequirement'}
          component={MyPartRequirement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'MyPartInventory'}
          component={MyPartInventory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'PartDetails'}
          component={PartDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'PdfViewer'}
          component={PdfViewer}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  headerStyles: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  dashboardStyles: {
    shadowRadius: 0,
    shadowOffset: {height: 0, width: 0},
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: Colors.blue,
  },
  menuIcon: {
    paddingHorizontal: normalize(20),
  },
  notificationBellStyles: {
    marginHorizontal: normalize(28),
  },
  headerRightStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(20),
  },
});

export default JobListMainStack;
