import { getLocalStorage } from "@/utilities/helper";
import STORAGE from "@/utilities/storage";
import Http from "./http";
import { ENDPOINT_API } from "@/utilities/enums";
import HttpAuth from "./httpAuth";
import { AddCommentModel, AddFollowModel, AddNotificationModel, AddPostModel, AddReactionModel, ChangePasswordModel, RegisterModel, SignInModel, TokenModel, UpdateCommentModel, UpdateNotificationModel, UpdatePostModel, UpdateUserProfileModel } from "@/utilities/interfaces";

export const BearerToken = () => {
  return `Bearer ${getLocalStorage(STORAGE.accessToken)}`;
};

const API = {
  signIn: (data: SignInModel) => Http.post(ENDPOINT_API.signIn + `?username=${data.username}&password=${data.password}`),
  register: (data: RegisterModel) => Http.post(ENDPOINT_API.register, data),
  refreshToken: (data: any) => Http.get(ENDPOINT_API.refreshToken, data),
  forgotPassword: (email: string) =>
    Http.post(ENDPOINT_API.forgotPassword + `?email=${email}`),
  validateResetCode: (code: string) =>
    Http.post(ENDPOINT_API.validateResetCode + `?code=${code}`),
  resetPassword: (password: string) =>
    Http.put(ENDPOINT_API.resetPassword + `?password=${password}`),
  changePassword: (userId:number, data: ChangePasswordModel) =>
    HttpAuth.put(ENDPOINT_API.changePassword+ `/${userId}?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`),
  editProfile: (data: UpdateUserProfileModel) =>
    HttpAuth.put(ENDPOINT_API.user + `/${data.userId}`, data),
  uploadAvatar: (userId: number, file: FormData) =>
    HttpAuth.post(`${ENDPOINT_API.uploadAvatar}/${userId}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }}),
  getUsers: (searchValue?: string) =>
    HttpAuth.get(`${ENDPOINT_API.user}`, {
      params: {
        searchValue
      }
    }),
  getSingleUser: (userId: number) =>
    HttpAuth.get(`${ENDPOINT_API.user}/${userId}`),
  getSingleUserByUsername: (username: string) =>
    HttpAuth.get(`${ENDPOINT_API.getUserByUsername}?username=${username}`),

  getMyPosts: (userId: number) =>
      HttpAuth.get(`${ENDPOINT_API.myPosts}?userId=${userId}`),
  createPost: (data: AddPostModel) =>
      HttpAuth.post(`${ENDPOINT_API.post}`, data),
  updatePost: (data: UpdatePostModel) =>
      HttpAuth.put(`${ENDPOINT_API.post}/${data?.postId}`, data),
  deletePost: (postId: number) =>
      HttpAuth.delete(`${ENDPOINT_API.post}/${postId}`),
  getFollowingPosts: (userId: number) =>
    HttpAuth.get(`${ENDPOINT_API.followingPosts}?userId=${userId}`),
  uploadPostMedia: (postId: number, files: FormData) =>
    HttpAuth.post(`${ENDPOINT_API.uploadPostMedia}/${postId}`, files, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }}),

  getFollowersOfUser: (userId: number) =>
    HttpAuth.get(`${ENDPOINT_API.getFollowers}/${userId}`),
  getFollowingsOfUser: (userId: number) =>
    HttpAuth.get(`${ENDPOINT_API.getFollowings}/${userId}`),
  follow: (data: AddFollowModel) =>
    HttpAuth.post(`${ENDPOINT_API.follow}`, data),
  unfollow: (data: any) =>
    HttpAuth.delete(`${ENDPOINT_API.follow}`, {
      params: {
        userId: data?.userId,
        followingId: data?.followingId
      }
    }),

  addComment: (data: AddCommentModel) =>
    HttpAuth.post(`${ENDPOINT_API.comment}`, data),
  updateComment: (data: UpdateCommentModel) =>
    HttpAuth.put(`${ENDPOINT_API.comment}/${data?.commentId}`, data),
  deleteComment: (commentId: number) =>
    HttpAuth.delete(`${ENDPOINT_API.comment}/${commentId}`),

  getNotification: (toUserId: number) =>
    HttpAuth.get(`${ENDPOINT_API.notification}/${toUserId}`),
  addNotification: (data: AddNotificationModel) =>
    HttpAuth.post(`${ENDPOINT_API.notification}`, data),
  updateAllNotificationOfUser: (toUserId: number) =>
    HttpAuth.put(`${ENDPOINT_API.updateAllNotificationOfUser}/${toUserId}`),
  updateNotificationOfUser: (data: UpdateNotificationModel) =>
    HttpAuth.put(`${ENDPOINT_API.notification}/${data?.toUserId}`, data),
  deleteNotification: (notifyId: number) =>
    HttpAuth.delete(`${ENDPOINT_API.notification}/${notifyId}`),

  getReactionOfPost: (postId: number) =>
    HttpAuth.get(`${ENDPOINT_API.reaction}/${postId}`),
  createReaction: (data: AddReactionModel) =>
    HttpAuth.post(`${ENDPOINT_API.reaction}`, data),
  deleteReaction: (data: any) =>
    HttpAuth.delete(`${ENDPOINT_API.reaction}`, {
      params: {
        postId: data?.postId,
        userId: data?.userId
      }
    }),
}

export default API;