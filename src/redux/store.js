import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from './auth/reducer';
import { logReducer } from './log/reducer/reducer';
import { todayLogReducer } from './log/reducer/todayLogReducer';
import { masterDataReducer } from './masterData/reducer';
import { JobDetailsReducer } from './jobDetails/reducer';
import { IncidentsDataReducer } from './incident/reducer';
import { ServiceReportReducer } from './serviceReport/reducer';
import { profileReducer } from './Profile/reducer';
import { backgroungApiReducer } from './pendingApi/reducer';
import { jobListReducer } from './jobList/reducer';
import { notesReducer } from './Notes/reducer';
import { EquipmentReducer } from './Equipment/reducer';
import { notificationListReducer } from './notification/reducer';
import { SettingReducer } from './setting/reducer';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['backgroungApiReducer', 'logReducer', 'SettingReducer'],
};
const rootReducer = combineReducers({
  authReducer: authReducer,
  logReducer: logReducer,
  todayLogReducer: todayLogReducer,
  masterDataReducer: masterDataReducer,
  jobDetailReducers: JobDetailsReducer,
  IncidentsDataReducer: IncidentsDataReducer,
  ServiceReportReducer: ServiceReportReducer,
  profileReducer: profileReducer,
  backgroungApiReducer: backgroungApiReducer,
  jobListReducer: jobListReducer,
  notesReducer: notesReducer,
  EquipmentReducer: EquipmentReducer,
  NotificationReducer: notificationListReducer,
  SettingReducer: SettingReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));

export const persistor = persistStore(store);