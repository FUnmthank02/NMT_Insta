import { ROUTE_PATH } from './enums';

export const PAGE_SETTINGS_LAYOUT = [ROUTE_PATH.editProfile, ROUTE_PATH.changePassword];
export const PAGE_MESSAGE_LAYOUT = [ROUTE_PATH.message];

export const FILE_MAX_SIZE = {
  image: 5, //MB
  video: 50, //MB
};

export const OPTIONS_GENDER = [
  { value: true, label: 'Male' },
  { value: false, label: 'Female' }
];


export const PAGE_NOT_LOGIN_LIST = [
  ROUTE_PATH.signIn,
  ROUTE_PATH.register,
  ROUTE_PATH.forgotPassword,
  ROUTE_PATH.resetPassword,
  ROUTE_PATH.validationResetCode,
];