
export enum ERROR_CODE {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  PAYMENT_REQUIRED = 402,
}

export enum ROUTE_PATH {
  home = "/",
  notFound = "*",
  login = "/login",
  logout = "/logout",
  register = "/register",
  forgotPassword = "/forgot-password",
  resetPassword = "/reset-password/:token",
  company = "/company",
  changePassword = "/change-password",
  profile = "/profile",
}

export enum PAGE_NOT_LOGIN {
  login = "/login",
  register = "/register",
  forgotPassword = "/forgot-password",
}

export enum HTTP_STATUS_CODE {
  SUCCESS = 200,
}

export enum IMAGE_TYPES {
  jpeg = "image/jpeg",
  png = "image/png",
  jpg = "image/jpg",
  tif = "image/tif",
  heic = "image/heic",
}