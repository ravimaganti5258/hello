import {
  DashboardIcon,
  JobIcon,
  InventoryIcon,
  TimeOff,
  NearByIcon,
  Setting,
  ChatIcon,
  Help,
  Sync,
  StarFill,
  ToggleArrow,
  Logout,
  PrivacyPolicy,
  PDF_ICON,
} from '../assets/img/index';
import {strings} from '../lib/I18n';
import {fontFamily, normalize, textSizes} from '../lib/globals';
import {Colors} from '../assets/styles/colors/colors';

export const drawerMenuArray = [
  {
    title: `Dashboard`,
    navigation: 'Dashboard',
    Icon: DashboardIcon,
    width: normalize(19),
    height: normalize(19),
  },
  {
    title: `Jobs`,
    navigation: 'JobList',
    Icon: JobIcon,
    width: normalize(20),
    height: normalize(20),
  },
  {
    title: `Inventory`,
    navigation: '',
    Icon: InventoryIcon,
    width: normalize(20),
    height: normalize(20),
    subTitle: [
      {
        title: 'my_part_inventory',
        navigation: 'MyPartInventory',
      },
      {
        title: 'my_part_requirement',
        navigation: 'MyPartRequirement',
      },
      {
        title: 'find_nearby_part',
        navigation: 'NearByPart',
      },
    ],
  },
  {
    title: `nearByTechnician`,
    navigation: 'NearByTechnician',
    Icon: NearByIcon,
    width: normalize(24),
    height: normalize(23),
  },
  {
    title: `sync_data`,
    navigation: 'SyncData',
    Icon: Sync,
    width: normalize(20),
    height: normalize(20),
  },
  {
    title: `chat`,
    navigation: 'Dashboard',
    Icon: ChatIcon,
    width: normalize(20),
    height: normalize(20),
  },
  {
    title: `timeOff`,
    navigation: 'TimeOffHistory',
    Icon: TimeOff,
    width: normalize(22),
    height: normalize(22),
  },
];

export const BottomMenu = [
  {
    title: `setting`,
    navigation: 'Settings',
    Icon: Setting,
    width: normalize(20),
    height: normalize(20),
  },
  {
    title: `privacy_policy`,
    navigation: 'PrivacyPolicy',
    Icon: PrivacyPolicy,
    width: normalize(20),
    height: normalize(20),
  },
  {
    title: `contact_support`,
    navigation: '',
    Icon: Help,
    width: normalize(20),
    height: normalize(20),
  },
];

export const SatusLabel = [
  {
    label: 'Created',
    color: Colors.primaryColor,
    status: 'Completed',
  },
  {
    label: 'Scheduled',
    color: Colors.primaryColor,
    status: 'in-process',
  },
  {
    label: 'En Route',
    color: '#4e9bff',
    status: 'pending',
  },
  {
    label: 'On Site',
    color: '#5F06AC',
    status: 'pending',
  },
  {
    label: 'Completed',
    color: '#43BF57',
    status: 'pending',
  },

  // {
  //   label: 'Unresolved',
  //   color: '#F49025',
  //   status: 'pending',
  // },
  {
    label: 'Submitted',
    color: '#3F3F3F',
    status: 'pending',
  },
  {
    label: 'Approval Rejected',
    color: '#FE0000',
    status: 'pending',
  },
  {
    label: 'Submitted',
    color: '#3F3F3F',
    status: 'pending',
  },

  {
    label: 'Approved',
    color: '#5F06AC',
    status: 'pending',
  },
];
export const AttcahmentIconLists = [
  {
    id: 0,
    fileName: 'pdf',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 1,
    fileName: 'ppt',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 2,
    fileName: 'doc',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 3,
    fileName: 'jpg',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
  {
    id: 4,
    fileName: 'png',
    icon: PDF_ICON,
    FilePath: null,
    byteData: '',
  },
];
