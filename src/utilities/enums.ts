export enum ROUTE_PATH {
  home = "/",
  notFound = "*",
  signIn = "/sign-in",
  logout = "/logout",
  register = "/register",
  forgotPassword = "/forgot-password",
  resetPassword = "/forgot-password/reset",
  validationResetCode= "/forgot-password/validation",
  changePassword = "/account/change-password",
  editProfile = "/account/edit",
  personalUser = "/user",
  post = "/post",
  message = "/message", 
}

export enum PAGE_NOT_LOGIN {
  signIn = "/sign-in",
  register = "/register",
  forgotPassword = "/forgot-password",
  validationResetCode= "/forgot-password/validation",
  resetPassword = "/forgot-password/reset",
}

export enum HTTP_STATUS_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  PAYMENT_REQUIRED = 402,
}

export enum IMAGE_TYPES {
  jpeg = "image/jpeg",
  png = "image/png",
  jpg = "image/jpg",
}

export enum VIDEO_TYPES {
  MP4 = "video/mp4",
  AVI = "video/avi"
}

export enum ENDPOINT_API {
  signIn = "/user/sign-in",
  register = "/user/register",
  forgotPassword = "/user/forgot-password",
  validateResetCode = "/user/validate-reset-code",
  resetPassword = "/user/reset-password",
  refreshToken = "/user/refresh-token",
  changePassword = "/user/change-password",
  user = "/user",
  getUserByUsername = "/user/by-username",
  uploadAvatar = "/user/upload-image",
  myPosts = "/post/my-post",
  post = "/post",
  uploadPostMedia = "/post/upload-media",
  followingPosts = "/post/following-post",
  getFollowers = "/follow/get-all-followers",
  getFollowings = "/follow/get-all-followings",
  follow = "/follow",
  comment = "/comment",
  notification = "/notification",
  updateAllNotificationOfUser = "/notification/update-all",
  reaction = "/reaction",
}

export enum NOTIFICATION_TYPE {
  reaction = "reaction",
  comment = "comment",
  follow = "follow",
  reply = "reply"
}

export enum MEDIA_TYPE {
  image = "image",
  video = "video",
}
export enum  REDUCER_TYPE {
  setModalComment = "SET_MODAL_COMMENT_STATE",
  setModalEdit = "SET_MODAL_EDIT_STATE",
  setModalDelete = "SET_MODAL_DELETE_STATE",
  setModalEditComment = "SET_MODAL_EDIT_COMMENT_STATE",
  setModalDeleteComment = "SET_MODAL_DELETE_COMMENT_STATE",
  setModalEditPost = "SET_MODAL_EDIT_POST_STATE",
  setModalDeletePost = "SET_MODAL_DELETE_POST_STATE",
  setModalListReaction = "SET_MODAL_LIST_REACTION_STATE",
  setModalFollowing = "SET_MODAL_FOLLOWING_STATE",
  setModalFollower = "SET_MODAL_FOLLOWER_STATE",
  setModalConfirmUnfollow = "SET_MODAL_CF_UNFOLLOW_STATE",

}