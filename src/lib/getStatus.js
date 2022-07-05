import { getCurrentLocation, getDistanceFromLatLong } from '../util/helper';

export const getStatus = (type, status, location) => {
  switch (type) {
    case 'forms':
      return getFormStatus(status, location);
      break;

    case 'add Checklist':
      return getCheckFormStatus(status, location);
      break;

    case 'Add Price':
      return getAddPriceStatus(status);
      break;
    default:
      return false;
  }
};

export const getFormStatus = (status) => {
  if (status === 'On Site' || status === 'Completed') {
    return true;
  } else {
    return false;
  }
};

export const getCheckFormStatus = (status) => {
  if (status === 'On Site') {
    return true;
  } else {
    return false;
  }
};

export const getAddPriceStatus = (status) => {
  if (status == 'On Site' || status == 'Completed') {
    return true;
  } else {
    return false;
  }
};

const getCurrentLocationDetail = async (location, distanceInKM) => {
  const userCoordinates = await getCurrentLocation();
  const userLocationObject = {
    latitude: userCoordinates[1],
    longitude: userCoordinates[0],
  };

  const distance = getDistanceFromLatLong(
    userLocationObject.latitude,
    userLocationObject.longitude,
    location.latitude,
    location.longitude,
  );
  return distance;
};
