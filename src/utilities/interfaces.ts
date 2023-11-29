export interface SignInModel {
  username: string;
  password: string;
}
export interface RegisterModel {
  username: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}
export interface ChangePasswordModel {
  oldPassword: string;
  newPassword: string;
}
export interface TokenModel {
  accessToken: string;
  refreshToken: string;
}
export interface UpdateUserProfileModel {
  userId: number;
  username: string;
  email: string;
  name: string;
  password?: string;
  gender?: boolean;
  phoneNumber?: string;
  bio?: string;
  avatar?: string;
  status?: boolean;
}

export interface AddCommentModel {
  content: string;
  postId: number;
  userId: number;
  parentCommentId?: number;
  createdAt?: Date;
}

export interface UpdateCommentModel {
  commentId: number;
  content: string;
  postId: number;
  userId: number;
  parentCommentId?: number;
  createdAt?: Date;
}

export interface AddNotificationModel {
  fromUserId: number;
  toUserId: number;
  postId?: number;
  isRead: boolean;
  content?: string;
  type: string;
  createdAt?: Date;
}

export interface UpdateNotificationModel {
  notifyId: number;
  fromUserId: number;
  toUserId: number;
  postId: number;
  isRead: boolean;
  content: string;
  type: string;
  createdAt?: Date;
}

export interface AddPostModel {
  caption: string;
  userId: number;
  createdAt?: Date;
}

export interface UpdatePostModel {
  postId: number;
  caption: string;
  userId: number;
  createdAt?: Date;
}

export interface AddFollowModel {
  followerId: number;
  followingId: number;
  createdAt?: Date;
}

export interface AddReactionModel {
  postId: number;
  userId: number;
  createdAt?: Date;
}
