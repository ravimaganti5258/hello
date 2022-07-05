import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import AddAttachment from '../../screens/Attachment/AddAttachment';
import AddCheckList from '../../screens/Attachment/AddCheckList';
import Attachment from '../../screens/Attachment/Attachment';
import CrewMemberList from '../../screens/CrewMemberList';
import EquipmentAttachment from '../../screens/Equipments/EquipmentAttachment';
import AttachmentList from '../../screens/Attachment/AttachmentList';
import MainForm from '../../screens/FORMS/MainForm';
import FormAttachmentList from '../../screens/FORMS/AttachmentList2';
import JobDetail from '../../screens/JobDetail';
import AddTask from '../../screens/JobDetail/AddTask/AddTask';
import AddParts from '../../screens/JobDetail/PartsAttachments/AddParts';
import SelectParts from '../../screens/JobDetail/PartsAttachments/SelectParts';
import JobList from '../../screens/JobList';
import JobSummary from '../../screens/ProjectDetail/JobSummary';
import {StatusBar} from 'react-native';
import Dashboard from '../../screens/Dashboard';
import EditContactDetail from '../../screens/ProjectDetail/EditContactDetail';
import SlaDetails from '../../screens/SlaDetails/SlaDetails';
import Incidents from '../../screens/Incident/Incident';
import SignatureAndFeedback from '../../screens/SignatureAndFeedback/SignatureAndFeedback';
import OtherInformation from '../../screens/OtherInformations/OtherInformation';
import AddIncident from '../../screens/Incident/AddIncident';
import ShowIncidentItem from '../../screens/Incident/ShowIncidentsItem';
import RecentJobs from '../../screens/RecentJob/RecentJobs';
import IncidentAttechment from '../../screens/Attachment/IncidentAttechmentList';
import ProjectDetail from '../../screens/ProjectDetail/ProjectDetail';
import EquipmentList from '../../screens/Equipments/EquipmentList';
import Notification from '../../screens/Notifications';

const Stack = createStackNavigator();

const JobStack = () => {
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
          ...TransitionPresets.ScaleFromCenterAndroid,
          headerShown: false,
        }}>
        <Stack.Screen
          name={'JobList'}
          component={JobList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'JobDetail'}
          component={JobDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'JobSummary'}
          component={JobSummary}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'CrewMemberList'}
          component={CrewMemberList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EditContactDetail'}
          component={EditContactDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddParts'}
          component={AddParts}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'SelectParts'}
          component={SelectParts}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Attachment'}
          component={Attachment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddAttachment'}
          component={AddAttachment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddCheckList'}
          component={AddCheckList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AttachmentList'}
          component={AttachmentList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'MainForm'}
          component={MainForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EquipmentList'}
          component={EquipmentList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'EquipmentAttachment'}
          component={EquipmentAttachment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'AddTask'}
          component={AddTask}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Equipment'}
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Pricing'}
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'ServiceReport'}
          component={Dashboard}
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
          name={'AddIncident'}
          component={AddIncident}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'ShowIncidentItem'}
          component={ShowIncidentItem}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'RecentJobs'}
          component={RecentJobs}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={'IncidentAttechment'}
          component={IncidentAttechment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'FormAttachmentList'}
          component={FormAttachmentList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={'ProjectDetail'}
          component={ProjectDetail}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name={'Notification'}
          component={Notification}
          options={{headerShown: false}}
        />
        
      </Stack.Navigator>
    </>
  );
};

export default JobStack;
