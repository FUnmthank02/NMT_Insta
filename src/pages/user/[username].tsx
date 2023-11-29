import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import defaultAvt from "@/assets/images/defaultAvatar.jpg";
import { Button, Dropdown, MenuProps, Modal, Space, notification } from "antd";
import styles from "@/assets/styles/user/personalUser.module.scss";
import { DownOutlined, TableOutlined } from "@ant-design/icons";
import ListPosts from "@/components/listPosts";
import { UserServices } from "@/services/user";
import { useDispatch, useSelector } from "react-redux";
import { PostServices } from "@/services/post";
import { RootState } from "@/redux/store";
import { FollowServices } from "@/services/follow";
import ListFollowing from "@/components/follow/listFollowing";
import ListFollower from "@/components/follow/listFollower";
import { NOTIFICATION_TYPE, REDUCER_TYPE, ROUTE_PATH } from "@/utilities/enums";
import { AddFollowModel, AddNotificationModel } from "@/utilities/interfaces";
import { NotificationServices } from "@/services/notification";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const initialModalState = {
  isModalFollowingOpen: false,
  isModalFollowerOpen: false,
  isModalConfirmUnfollowOpen: false,
};

const modalReducer = (state: any, action: any) => {
  switch (action.type) {
    case REDUCER_TYPE.setModalFollowing:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalFollower:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalConfirmUnfollow:
      return { ...state, ...(action.payload || {}) };
    
    default:
      return state;
  }
};

const PersonalAccount = () => {
  useDocumentTitle("Personal User");
  const dispatch = useDispatch();
  const router = useRouter();

  const [modalState, dispatchReducer] = useReducer(modalReducer, initialModalState);

  const [user, setUser] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>([]);
  const [followers, setFollowers] = useState<any>([]);
  const [followings, setFollowings] = useState<any>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const followState = useSelector((state: RootState) => state.follow);

  useEffect(() => {
    if (router?.query?.username) {
      const username = router.query?.username;
      UserServices.getSingleUserByUsernameProcess(dispatch, username, onSuccessGetSingleUser, onFail)
    } else
      router.push("/*/");
  }, [router?.query, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSuccessGetSingleUser = (userRes: any) => {
    setUser(userRes);
    getPostsOfUser(userRes?.userId);
    getFollowersOfUser(userRes?.userId);
    getFollowingsOfUser(userRes?.userId);
  }

  const handleRefresh = () => {
    setRefresh(!refresh);
  }
  
  const getFollowersOfUser = (userId: number) => {
    FollowServices.getFollowersProcess(dispatch, userId, onSuccessFollower, onFail);
  }
  const getFollowingsOfUser = (userId: number) => {
    FollowServices.getFollowingsProcess(dispatch, userId, onSuccessFollowing, onFail);
  }
  const getPostsOfUser = (userId: number) => {
    PostServices.getMyPostsProcess(dispatch, userId, onSuccessPost, onFail);
  }

  const handleUnFollow = () => {
    const unfollowModel: any = {
      userId: currentUser?.userId,
      followingId: user?.userId,
    }
    FollowServices.deleteFollowProcess(dispatch, unfollowModel, onSuccess, onFail);
  }

  const handleFollow = () => {
    const addFollowModel: AddFollowModel = {
      followerId: currentUser?.userId,
      followingId: user?.userId,
      createdAt: new Date()
    }
    FollowServices.createFollowProcess(dispatch, addFollowModel, onSuccessFollow, onFail);
  }

  
  const onSuccessFollow = () => {
    //follow success => add notification
    handleAddNotification(user?.userId, NOTIFICATION_TYPE.follow);
  };

  const handleAddNotification = (toUserId: number, type: string) => {
    const addNotificationModel: AddNotificationModel = {
      content: undefined,
      postId: undefined,
      fromUserId: currentUser?.userId,
      toUserId: toUserId,
      type: type,
      isRead: false,
      createdAt: new Date()
    }
    // call service to api
    NotificationServices.addNotificationProcess(dispatch, addNotificationModel, onSuccessNotify, onFail);
  };
  
  const onSuccessNotify = () => {
    handleRefresh();
  };


  const onSuccessPost = (posts: any) => {
    setPosts(posts);
  }
  const onSuccessFollower = (followers: any) => {
    setFollowers(followers);
  }
  const onSuccessFollowing = (followings: any) => {
    setFollowings(followings);
  }

  const onSuccess = () => {
    handleRefresh();
  }

  const onFail = (message: string) => {
    notification["error"]({
      message: message ?? "Fail"
    });
  }

  const showModalFollowing = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalFollowing, payload: { isModalFollowingOpen: true } });

  };

  const handleCancelModalFollowing = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalFollowing, payload: { isModalFollowingOpen: false } });

  };

  const showModalFollower = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalFollower, payload: { isModalFollowerOpen: true } });

  };

  const handleCancelModalFollower = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalFollower, payload: { isModalFollowerOpen: false } });

  };

  const showModalConfirmUnfollow = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalConfirmUnfollow, payload: { isModalConfirmUnfollowOpen: true } });

  };

  const handleCancelModalConfirmUnfollow = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalConfirmUnfollow, payload: { isModalConfirmUnfollowOpen: false } });

  };

  const handleOkModalConfirmUnfollow = () => {
    handleUnFollow();
    dispatchReducer({ type: REDUCER_TYPE.setModalConfirmUnfollow, payload: { isModalConfirmUnfollowOpen: false } });

  };

  const items: MenuProps['items'] = [
    {
      label: <div onClick={showModalConfirmUnfollow}>Unfollow</div>,
      key: '1'
    }
  ];

  return (
    <>
      <main className={styles["main"]}>
        <section className={styles["infor-main"]}>
          <Image className={styles["avatar"]} src={user?.avatar || defaultAvt} alt="avatar" width={150} height={150}/>
          <div className={styles["infor-main-content"]}>
            <div className={styles["infor-head"]}>
              <span className={styles["infor-head-username"]}>{router?.query?.username}</span>
              {
                (currentUser?.userId !== user?.userId) ?
                ((followers?.length > 0 && followers.find((follower: any) => follower.followerId === currentUser.userId)) ?
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Button type="default" loading={followState.isLoadingDelete}>
                    <Space>
                      Following
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
                :
                <Button type="primary" className={styles["infor-head-btn"]} onClick={handleFollow} 
                  loading={followState.isLoadingAdd}>Follow</Button>
                )
                :
                <>
                &ensp;
                {
                  currentUser?.userId === user?.userId ?
                  <Button type="default" onClick={() => router.push(ROUTE_PATH.editProfile)}>Edit</Button> :
                  <Button type="default" className={styles["infor-head-btn"]} onClick={() => router.push(ROUTE_PATH.editProfile)}>Message</Button>
                }
                </>

              }
            </div>
            <div className={styles["infor-second"]}>
              <span className={styles["infor-second-item"]}><span className={styles["infor-second-amount"]}>{posts?.length}</span>&ensp;posts</span>
              <span className={styles["infor-second-item"]} style={{cursor: "pointer"}} onClick={showModalFollower}><span className={styles["infor-second-amount"]}>{followers?.length}</span>&ensp;followers</span>
              <span className={styles["infor-second-item"]} style={{cursor: "pointer"}}  onClick={showModalFollowing}><span className={styles["infor-second-amount"]}>{followings?.length}</span>&ensp;following</span>
            </div>
            <div className={styles["infor-third"]}>
              <span className={styles["infor-third-name"]}>{user?.name}</span>
            </div>
            {
              user?.bio &&
              <div className={styles["infor-fourth"]}>
                <span className={styles["infor-fourth-bio"]}>{user.bio}</span>
              </div>
            }
          </div>
        </section>
        <hr />
        <section className={styles["posts-main"]}>
          <div className={styles["posts-main-category"]}>
            <div className={styles["posts-main-category-post"]}>
              <TableOutlined style={{fontSize: "15px", color: "#000"}} />&ensp;POSTS
            </div>
            <ListPosts posts={posts} refresh={handleRefresh}/>
          </div>
        </section>
        <Modal
          open={modalState.isModalFollowingOpen}
          onCancel={handleCancelModalFollowing}
          style={{ top: '75px' }}
          footer={null}
          width={400}
          closeIcon={null}
          title={<div style={{textAlign: "center", paddingBottom: 20, borderBottom: "1px solid #d5d5d5" }}>Followings</div>}
        >
          <ListFollowing followings={followings} closeModal={handleCancelModalFollowing}/>
        </Modal>
        <Modal
          open={modalState.isModalFollowerOpen}
          onCancel={handleCancelModalFollower}
          style={{ top: '75px' }}
          footer={null}
          width={400}
          closeIcon={null}
          title={<div style={{textAlign: "center", paddingBottom: 20, borderBottom: "1px solid #d5d5d5" }}>Followers</div>}
        >
          <ListFollower followers={followers}  closeModal={handleCancelModalFollower}/>
        </Modal>
        <Modal
          open={modalState.isModalConfirmUnfollowOpen}
          onCancel={handleCancelModalConfirmUnfollow}
          onOk={handleOkModalConfirmUnfollow}
          style={{ top: '75px' }}
          width={400}
          closeIcon={null}
          title={"Are you sure want to unfollow ?"}
        />
      </main>
    </>
  )
};

export default PersonalAccount;