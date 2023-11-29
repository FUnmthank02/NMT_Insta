import styles from '@/assets/styles/Home.module.scss';
import Image from 'next/image';
import defaultAvt from '@/assets/images/defaultAvatar.jpg';
import { HeartFilled, HeartOutlined, MessageOutlined, MoreOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useReducer, useState } from 'react';
import { Col, Dropdown, Flex, MenuProps, Modal, Row, notification } from 'antd';
import DetailComments from '@/components/detailComments';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { PostServices } from '@/services/post';
import { getLocalStorage, getTimeAgo } from '@/utilities/helper';
import STORAGE from '@/utilities/storage';
import { MEDIA_TYPE, NOTIFICATION_TYPE, REDUCER_TYPE, ROUTE_PATH } from '@/utilities/enums';
import { RootState } from '@/redux/store';
import LoadingComponent from '@/components/loading';
import { CommentServices } from '@/services/comment';
import { AddCommentModel, AddNotificationModel, AddReactionModel } from '@/utilities/interfaces';
import { ReactionServices } from '@/services/reaction';
import { NotificationServices } from '@/services/notification';
import ListReaction from '@/components/reaction/listReaction';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import EmptyComponent from '@/components/empty';

const initialModalState = {
  isModalCommentOpen: false,
  isModalEditOpen: false,
  isModalDeleteOpen: false,
  isModalListReactionOpen: false,
};

const modalReducer = (state: any, action: any) => {
  switch (action.type) {
    case REDUCER_TYPE.setModalComment:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalEdit:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalDelete:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalListReaction:
      return { ...state, ...(action.payload || {}) };
    default:
      return state;
  }
};

export default function Home() {
  useDocumentTitle("Home");
  const [modalState, dispatchReducer] = useReducer(modalReducer, initialModalState);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>([]);
  const [postSelected, setPostSelected] = useState<any>({});
  const [commentText, setCommentText] = useState<string>("");
  const [curWidth, setCurWidth] = useState(window.innerWidth);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const postState = useSelector((state: RootState) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleWindowResize = () => {
      setCurWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  useEffect(() => {
    const userId = getLocalStorage(STORAGE.userId);
    PostServices.getFollowingPostsProcess(dispatch, userId, onSuccessFetchPost, onFail);
  }, [refresh]);

  const onSuccessFetchPost = (listPosts: any) => {
    setPosts(listPosts);
    const post = listPosts.find((p:any) => p?.postId === postSelected?.postId);
    if (post) {
      setPostSelected(post);
    }
  };

  const onFail = (message: string) => {
    notification['error']({
      message: message ?? 'Fail',
      duration: 2,
    });
  };

  const showModalDelete = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDelete, payload: { isModalDeleteOpen: true } });
  };

  const handleOkModalDelete = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDelete, payload: { isModalDeleteOpen: false } });
  };

  const handleCancelModalDelete = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDelete, payload: { isModalDeleteOpen: false } });
  };

  const showModalEdit = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalEdit, payload: { isModalEditOpen: true } });
  };

  const handleOkModalEdit = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalEdit, payload: { isModalEditOpen: false } });
  };

  const handleCancelModalEdit = () => {
    // setIsModalEditOpen(false);
    dispatchReducer({ type: REDUCER_TYPE.setModalEdit, payload: { isModalEditOpen: false } });
  };

  const showModalListReaction = (post: any) => {
    setPostSelected(post);
    dispatchReducer({ type: REDUCER_TYPE.setModalListReaction, payload: { isModalListReactionOpen: true } });
  };

  const handleCancelModalListReaction = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalListReaction, payload: { isModalListReactionOpen: false } });
  };

  const showModalComment = (post: any) => {
    setPostSelected(post);
    dispatchReducer({ type: REDUCER_TYPE.setModalComment, payload: { isModalCommentOpen: true } });
  };

  const handleCancelModalComment = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalComment, payload: { isModalCommentOpen: false } });
  };

  const handleSubmitComment = (postId: number, parentCommentId?: number) => {
    if (commentText.trim() !== "") {
      const addCommentModel: AddCommentModel = {
        content: commentText.trim(),
        postId: postId,
        userId: currentUser?.userId,
        parentCommentId: parentCommentId,
        createdAt: new Date()
      }
      CommentServices.addCommentProcess(dispatch, addCommentModel, onSuccessComment, onFail);
      handleSetCommentText("");
    }
  };
  
  const onSuccessComment = (message: string) => {
    handleRefresh();
  };
  
  const onSuccess = (message: string) => {
    notification['success']({
      message: message ?? 'Success',
    });
    handleRefresh();
  };

  const handleSetCommentText = (text: string) => {
    setCommentText(text);
  }

  const handleRefresh = () => {
    setRefresh(!refresh);
  }

  const handleDeleteReaction = (post: any) => {
    const deleteReactionModel: any = {
      postId: post?.postId,
      userId: currentUser?.userId,
    }
    ReactionServices.deleteReactionProcess(dispatch, deleteReactionModel, onSuccess, onFail);
  }

  const handleReaction = (post: any) => {
    setPostSelected(post);
    const addReactionModel: AddReactionModel = {
      postId: post?.postId,
      userId: currentUser?.userId,
      createdAt: new Date()
    }
    ReactionServices.createReactionProcess(dispatch, addReactionModel, onSuccessReaction, onFail);
  }

  const onSuccessReaction = (message: string) => {
    //reaction success => add notification
    if (currentUser?.userId !== postSelected?.user?.userId) {
      handleAddNotification("", postSelected?.user?.userId, NOTIFICATION_TYPE.reaction, postSelected?.postId);
    } else {
      handleRefresh();
    }
  };

  const handleAddNotification = (content: string, toUserId: number, type: string, postId: number) => {
    const addNotificationModel: AddNotificationModel = {
      content: content.trim().length > 0 ? content : undefined,
      postId: postId,
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

  const items: MenuProps['items'] = [
    {
      label: <span onClick={showModalEdit}>Edit</span>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <span
          style={{ color: 'red' }}
          onClick={showModalDelete}
        >
          Delete
        </span>
      ),
      key: '1',
    },
  ];

  return (
    <>
      <main>
        <Row gutter={16}>
          <Col
            className='gutter-row'
            span={curWidth > 768 ? 10 : 24}
            offset={curWidth > 768 ? 5 : 0}
          >
            {
              postState?.loadingGetFollowingPosts ? <LoadingComponent size='large' /> :

              <div className={styles['main-content']}>
                <div className={styles['wrap-list-post']}>
                  {posts?.length > 0 ? (
                    posts.map((post: any, index: number) => (
                      <div
                        className={styles['post']}
                        key={index}
                      >
                        <Flex
                          justify='space-between'
                          align='center'
                          className={styles['post-head']}
                        >
                          <Flex
                            align='center'
                            gap={10}
                          >
                            <Image
                              src={post?.user?.avatar || defaultAvt}
                              alt='avt'
                              width={30}
                              height={30}
                              style={{ borderRadius: '50%' }}
                            />
                            <Link
                              href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`}
                              className={styles['post-head-name']}
                            >
                              {post?.user?.username || 'N/A'}
                            </Link>
                            <span className={styles['post-head-time-ago']}>
                              • {getTimeAgo(post?.createdAt)} •
                            </span>
                          </Flex>
                          {post?.userId === currentUser?.userId && (
                            <Dropdown
                              menu={{ items }}
                              trigger={['click']}
                              placement='bottomRight'
                            >
                              <MoreOutlined rotate={90} style={{fontSize: 18}}/>
                            </Dropdown>
                          )}
                        </Flex>
                        <div className={styles['post-content']}>
                          <Swiper
                            navigation={true}
                            pagination={{
                              dynamicBullets: true,
                            }}
                            modules={[Pagination, Navigation]}
                            className='mySwiper'
                            style={{ border: '1px solid #d5d5d5', borderRadius: '6px' }}
                          >
                            {post?.media?.length > 0 &&
                              post.media.map((item: any, index: number) => (
                                <SwiperSlide key={index}>
                                  {item?.mediaType === MEDIA_TYPE.image ? (
                                    <img
                                      src={item?.mediaUrl || defaultAvt.src}
                                      alt='img'
                                    />
                                  ) : (
                                    <video
                                      src={item?.mediaUrl}
                                      autoPlay={false}
                                    ></video>
                                  )}
                                </SwiperSlide>
                              ))}
                          </Swiper>
                          <div className={styles['wrap-reaction-comment-icon']}>
                            {post?.reactions?.some(
                              (reaction: any) => reaction.userId === currentUser?.userId,
                            ) ? (
                              <>
                                <HeartFilled  onClick={() => handleDeleteReaction(post)}
                                  className='icon'
                                  style={{ fontSize: '22px', color: 'red', cursor: 'pointer' }}
                                />
                                &ensp;&ensp;&ensp;
                              </>
                            ) : (
                              <>
                                <HeartOutlined onClick={() => handleReaction(post)}
                                  className='icon'
                                  style={{ fontSize: '22px', color: '#000', cursor: 'pointer' }}
                                />
                                &ensp;&ensp;&ensp;
                              </>
                            )}
                            <MessageOutlined
                              className='icon'
                              style={{ fontSize: '22px', color: '#000', cursor: 'pointer' }}
                            />
                          </div>
                          <div className={styles['amount-of-reactions']} onClick={() => showModalListReaction(post)}>
                            {post?.reactions?.length}&ensp;
                            {post?.reactions?.length > 1 ? 'likes' : 'like'}
                          </div>
                          <div className={styles['wrap-caption']}>
                            <Link
                              href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`}
                              className={styles['post-owner']}
                            >
                              {post?.user?.username || 'N/A'}
                            </Link>
                            &ensp;
                            <span className={styles['caption']}>{post?.caption || 'N/A'}</span>
                          </div>
                          {post?.comments?.length > 1 && (
                            <div
                              className={styles['view-all-comments']}
                              onClick={() => showModalComment(post)}
                            >
                              View all comments
                            </div>
                          )}
                          {post?.comments?.length > 0 && (
                            <div className={styles['wrap-comments']}>
                              <Link
                                href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`}
                                className={styles['post-owner']}
                              >
                                {post?.comments[0]?.user?.username || 'N/A'}
                              </Link>
                              &ensp;
                              <span className={styles['caption']}>
                                {post?.comments[0]?.content || 'N/A'}
                              </span>
                            </div>
                          )}
                          <div className={styles['wrap-comment-action']}>
                            <textarea
                              className={styles['input-comment']}
                              placeholder='Add a comment'
                              onChange={(e) => handleSetCommentText(e.target.value)}
                            />
                            <span className={styles['btn-link']} onClick={() => handleSubmitComment(post?.postId, undefined)}
                              style={{cursor: (commentText.trim() !== "") ? 'pointer' : 'default', color: (commentText.trim() !== "") ? "#007aff" : "#56a5fa"}}
                              >Post</span>
                          </div>
                          {index !== posts?.length - 1 && <hr />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div><EmptyComponent description={"There is no post"}/></div>
                  )}
                </div>
              </div>
            }

          </Col>
        </Row>
        <Modal
          title='Are you sure want to delete this ?'
          open={modalState.isModalDeleteOpen}
          onCancel={handleCancelModalDelete}
          onOk={handleOkModalDelete}
          okText='Delete'
          okType='danger'
        />
        <Modal
          open={modalState.isModalEditOpen}
          onCancel={handleCancelModalEdit}
          onOk={handleOkModalEdit}
          okText='Update'
        />
        <Modal
          open={modalState.isModalCommentOpen}
          onCancel={handleCancelModalComment}
          style={{ top: '75px' }}
          footer={null}
          width={1100}
          closeIcon={null}
        >
          <DetailComments post={postSelected} handleRefresh={handleRefresh} closeModalComment={handleCancelModalComment}/>
        </Modal>
        <Modal
          open={modalState.isModalListReactionOpen}
          onCancel={handleCancelModalListReaction}
          style={{ top: '75px' }}
          title={<div style={{textAlign: "center", paddingBottom: 20, borderBottom: "1px solid #d5d5d5" }}>Reactions</div>}
          footer={null}
          width={400}
          closeIcon={null}
        >
          <ListReaction post={postSelected} closeModal={handleCancelModalListReaction}/>
        </Modal>
      </main>
    </>
  );
}
