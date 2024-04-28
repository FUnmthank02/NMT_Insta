import { Col, Dropdown, Flex, MenuProps, Modal, Row, notification } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '@/assets/styles/components/detailComments/styles.module.scss';
import defaultAvt from '@/assets/images/defaultAvatar.jpg';
import Image from 'next/image';
import { HeartFilled, HeartOutlined, MessageOutlined, MoreOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { memo, useEffect, useReducer, useState } from 'react';
import { MEDIA_TYPE, NOTIFICATION_TYPE, REDUCER_TYPE, ROUTE_PATH } from '@/utilities/enums';
import { getDateWithFormat, getTimeAgo, handleValidateString } from '@/utilities/helper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CommentServices } from '@/services/comment';
import { AddCommentModel, AddNotificationModel, AddReactionModel, UpdateCommentModel, UpdatePostModel } from '@/utilities/interfaces';
import { NotificationServices } from '@/services/notification';
import EmptyComponent from '../empty';
import { PostServices } from '@/services/post';
import dynamic from 'next/dynamic';
import { ReactionServices } from '@/services/reaction';
import ListReaction from '../reaction/listReaction';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // This line is important to prevent ssr error
});


const initialModalState = {
  isModalDeleteCommentOpen: false,
  isModalEditCommentOpen: false,
  isModalDeletePostOpen: false,
  isModalEditPostOpen: false,
  isModalListReactionOpen: false,
};

const modalReducer = (state: any, action: any) => {
  switch (action.type) {
    case REDUCER_TYPE.setModalDeletePost:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalEditPost:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalDeleteComment:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalEditComment:
      return { ...state, ...(action.payload || {}) };
    case REDUCER_TYPE.setModalListReaction:
      return { ...state, ...(action.payload || {}) };
    
    default:
      return state;
  }
};

const DetailComments = ({ post, handleRefresh, closeModalComment }: any) => {

  const [modalState, dispatchReducer] = useReducer(modalReducer, initialModalState);
  
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [repliesVisible, setRepliesVisible] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});
  const [inputRepliesVisible, setInputRepliesVisible] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});
  const [userIdReplied, setUserIdReplied] = useState<number>(currentUser?.userId);
  const [replyCommentId, setReplyCommentId] = useState<number>(0);
  const [parentCommentId, setParentCommentId] = useState<number>(0);
  const [detailPost, setDetailPost] = useState<any>(post);
  const [commentText, setCommentText] = useState<string>("");
  const [replyCommentText, setReplyCommentText] = useState<string>("");
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [commentSelected, setCommentSelected] = useState<any>({});
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [curWidth, setCurWidth] = useState(window.innerWidth);

  const postState = useSelector((state: RootState) => state.post);
  const commentState = useSelector((state: RootState) => state.comment);
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
    setDetailPost(post);
    setContent(post?.caption);
  }, [post])

  const toggleReplies = (commentId: number, parentCommentId: number) => {
    setRepliesVisible((prev) => ({
      ...prev,
      [parentCommentId]: {
        ...prev[parentCommentId],
        [commentId]: !prev[parentCommentId]?.[commentId],
      },
    }));
  };

  const showInputReplies = (commentId: number, parentCommentId: number) => {
    setInputRepliesVisible((prev) => ({
      ...prev,
      [parentCommentId]: {
        ...prev[parentCommentId],
        [commentId]: true,
      },
    }));
  };

  const handleReplies = (parentCmtId: number, replyCmtId: number, userIdThatReplied: number) => {
    setParentCommentId(parentCmtId);
    setReplyCommentId(replyCmtId);
    setUserIdReplied(userIdThatReplied);
    showInputReplies(parentCmtId, parentCmtId);
    
    handleSubmitComment(replyCommentText.trim(), post?.postId, parentCmtId);
  };

  const handleSubmitComment = (content: string, postId: number, parentCommentId?: number) => {
    if (content.trim() !== "") {
      // setUserIdReplied(currentUser?.userId);

      const addCommentModel: AddCommentModel = {
        content: content.trim(),
        postId: postId,
        userId: currentUser?.userId,
        parentCommentId: parentCommentId,
        createdAt: new Date()
      }
      // call service to api
      CommentServices.addCommentProcess(dispatch, addCommentModel, onSuccessComment, onFail);
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

  const onSuccessComment = (message: string) => {
    //comment success => add notification
    if (currentUser?.userId !== userIdReplied) {
      handleAddNotification(replyCommentText.trim(), userIdReplied, NOTIFICATION_TYPE.reply, post?.postId);
    } else {
      setCommentText("");
      setReplyCommentText("");
      handleRefresh();
    }
  };
  
  const onSuccessNotify = () => {
    setReplyCommentText("");
    setParentCommentId(0);
    setReplyCommentId(0);
    setUserIdReplied(0);
    handleRefresh();
  };

  const onFail = (message: string) => {
    notification['error']({
      message: message ?? 'Fail',
      duration: 2,
    });
  };

  const showModalDeleteComment = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDeleteComment, payload: { isModalDeleteCommentOpen: true } });
  };

  const handleOkModalDeleteComment = () => {
    CommentServices.deleteCommentProcess(dispatch, commentSelected?.commentId, onSuccess, onFail);
    dispatchReducer({ type: REDUCER_TYPE.setModalDeleteComment, payload: { isModalDeleteCommentOpen: false } });
  };

  const handleCancelModalDeleteComment = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDeleteComment, payload: { isModalDeleteCommentOpen: false } });
  };

  const showModalEditComment = () => {
    setEditCommentText(commentSelected?.content);
    dispatchReducer({ type: REDUCER_TYPE.setModalEditComment, payload: { isModalEditCommentOpen: true } });
  };

  const handleOkModalEditComment = () => {
    if (editCommentText.trim() !== "") {
      const updateCommentModel: UpdateCommentModel = {
        commentId: commentSelected?.commentId,
        content: editCommentText.trim(),
        postId: commentSelected?.postId,
        userId: currentUser?.userId,
        parentCommentId: commentSelected?.parentCommentId,
        createdAt: commentSelected?.createdAt
      }
      // call service to api
      CommentServices.updateCommentProcess(dispatch, updateCommentModel, onSuccess, onFail);
      setEditCommentText("");
      dispatchReducer({ type: REDUCER_TYPE.setModalEditComment, payload: { isModalEditCommentOpen: false } });
    }
  };

  const handleCancelModalEditComment = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalEditComment, payload: { isModalEditCommentOpen: false } });
  };
  const showModalDeletePost = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDeletePost, payload: { isModalDeletePostOpen: true } })
  };

  const handleOkModalDeletePost = () => {
    PostServices.deletePostProcess(dispatch, post?.postId, onSuccessDeletePost, onFail);
    dispatchReducer({ type: REDUCER_TYPE.setModalDeletePost, payload: { isModalDeletePostOpen: false } });
  };

  const onSuccessDeletePost = (message: string) => {
    notification['success']({
      message: message ?? 'Success',
      duration: 2,
    });
    closeModalComment();
    handleRefresh();
  };

  const handleCancelModalDeletePost = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalDeletePost, payload: { isModalDeletePostOpen: false } })
  };

  const showModalEditPost = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalEditPost, payload: { isModalEditPostOpen: true } });
  };

  const handleOkModalEditPost = () => {
    if (text.trim() !== "") {
      const updatePostModel: UpdatePostModel = {
        postId: post?.postId,
        caption: content,
        userId: post?.userId,
        createdAt: post?.createdAt
      }
      // call service to api
      PostServices.updatePostProcess(dispatch, updatePostModel, onSuccessEditPost, onFail);
      setText("");
      dispatchReducer({ type: REDUCER_TYPE.setModalEditPost, payload: { isModalEditPostOpen: false } });
    }
  };

  const onChangeCaption = (content: any, delta: any, source: any, editor: any) => {
    const textContent = editor.getText(content);
    setText(textContent);
    setContent(content);
  };

  const handleCancelModalEditPost = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalEditPost, payload: { isModalEditPostOpen: false } });
  };

  
  const showModalListReaction = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalListReaction, payload: { isModalListReactionOpen: true } });
  };

  const handleCancelModalListReaction = () => {
    dispatchReducer({ type: REDUCER_TYPE.setModalListReaction, payload: { isModalListReactionOpen: false } });
  };

  
  const handleDeleteReaction = () => {
    const deleteReactionModel: any = {
      postId: post?.postId,
      userId: currentUser?.userId,
    }
    ReactionServices.deleteReactionProcess(dispatch, deleteReactionModel, onSuccessDeleteReaction, onFail);
  }

  const handleReaction = () => {
    const addReactionModel: AddReactionModel = {
      postId: post?.postId,
      userId: currentUser?.userId,
      createdAt: new Date()
    }
    ReactionServices.createReactionProcess(dispatch, addReactionModel, onSuccessReaction, onFail);
  }

  const onSuccessDeleteReaction = (message: string) => {
    handleRefresh();
  };

  const onSuccessReaction = (message: string) => {
    //comment success => add notification
    if (currentUser?.userId !== post?.user?.userId) {
      handleAddNotification("", post?.user?.userId, NOTIFICATION_TYPE.reaction, post?.postId);
    } else {
      handleRefresh();
    }
  };

  const onSuccess = (message: string) => {
    notification['success']({
      message: message ?? 'Success',
      duration: 2,
    });
    handleRefresh();
  };

  const onSuccessEditPost = (message: string) => {
    notification['success']({
      message: message ?? 'Success',
      duration: 2,
    });
    setContent("");
    handleRefresh();
  };

  const items: MenuProps['items'] = [
    {
      label: <div onClick={showModalEditComment}>Edit</div>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          style={{ color: 'red' }}
          onClick={showModalDeleteComment}
        >
          Delete
        </div>
      ),
      key: '1',
    },
  ];

  const itemsForOwnerPost: MenuProps['items'] = [
    {
      label: (
        <div
          style={{ color: 'red' }}
          onClick={showModalDeleteComment}
        >
          Delete
        </div>
      ),
      key: '0',
    },
  ];
  
  const itemsPost: MenuProps['items'] = [
    {
      label: <div onClick={showModalEditPost}>Edit</div>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          style={{ color: 'red' }}
          onClick={showModalDeletePost}
        >
          Delete
        </div>
      ),
      key: '1',
    },
  ];

  const extractTextFromHtml = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <>
      <Row gutter={8}>
        {
          curWidth <= 600 &&

          <Col
            className='gutter-row'
            span={24}
          >
              <div className={styles['head-post-modal-mb']}>
                <div className={styles['head-post-modal-left-mb']}>
                  <Flex gap={10} align='center'>
                    <Image 
                      src={post?.user?.avatar || defaultAvt}
                      alt='avt'
                      width={30}
                      height={30}
                      style={{ borderRadius: '50%' }}
                    />
                    <Link href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`} className={styles['btn-username']}>
                      {post?.user?.username || 'N/A'}
                    </Link>
                  </Flex>
                  {post?.user?.userId === currentUser?.userId && (
                    <Dropdown menu={{ items: itemsPost }}
                      trigger={['click']}
                      placement='bottomRight'
                    >
                      <MoreOutlined rotate={90} style={{fontSize: 18}}/>
                    </Dropdown>
                  )}
                </div>
              </div>
          </Col>
        }
        <Col
          className='gutter-row'
          span={curWidth > 600 ? 12 : 24}
        >
          <Swiper
            navigation={true}
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination, Navigation]}
            className='mySwiper'
            style={{borderRadius: "5px"}}
          >
            {post?.media?.length > 0 &&
              post.media.map((item: any, index: number) => (
                <SwiperSlide key={index} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  {item?.mediaType === MEDIA_TYPE.image ? (
                    <Image
                      fill
                      sizes='100%'
                      src={item?.mediaUrl || defaultAvt.src}
                      alt='img'
                      
                    />
                  ) : (
                    <video
                      src={item?.mediaUrl}
                      autoPlay={false} controls height={585} width={"100%"}
                    />
                  )}
                </SwiperSlide>
              ))}
          </Swiper>
        </Col>
        <Col
          className='gutter-row'
          span={curWidth > 600 ? 12 : 24}
        >
          <div className={styles['right-side-modal']}>
            {
              curWidth > 600 &&
              <div className={styles['head-post-modal']}>
                <div className={styles['head-post-modal-left']}>
                  <Flex gap={10} align='center'>
                    <Image 
                      src={post?.user?.avatar || defaultAvt}
                      alt='avt'
                      width={30}
                      height={30}
                      style={{ borderRadius: '50%' }}
                    />
                    <Link href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`} className={styles['btn-username']}>
                      {post?.user?.username || 'N/A'}
                    </Link>
                  </Flex>
                  {post?.user?.userId === currentUser?.userId && (
                    <Dropdown menu={{ items: itemsPost }}
                      trigger={['click']}
                      placement='bottomRight'
                    >
                      <MoreOutlined rotate={90} style={{fontSize: 18}}/>
                    </Dropdown>
                  )}
                </div>
              </div>
            }

            {/* Wrap list comment and caption */}
            <div className={styles['wrap-list-comments-modal']}>
              {/* Caption */}
              <div className={`${styles['wrap-caption-modal']} ${styles['wrap-caption']}`}>
                <Image 
                  src={post?.user?.avatar || defaultAvt}
                  alt='avt'
                  width={30}
                  height={30}
                  style={{ borderRadius: '50%' }}
                />
                <div className={styles['wrap-caption-modal-content']}>
                  <div className={styles['caption']}>
                    <Link
                      href={`${ROUTE_PATH.personalUser}/${post?.user?.username}`}
                      className={styles['btn-username']}
                    >
                      {post?.user?.username || 'N/A'}
                    </Link>
                    &ensp;
                    <span>{extractTextFromHtml(post?.caption) || 'N/A'}</span>
                  </div>
                  <span className={styles['time-ago']}>{getTimeAgo(post?.createdAt)}</span>
                </div>
              </div>
              {/* Comments */}
              {post?.comments?.length > 0 ? (
                post?.comments
                  .filter((cmtz: any) => cmtz.parentCommentId === null)
                  .map((comment: any, index: number) => (
                    <div
                      className={styles['wrap-caption-modal']}
                      key={index}
                    >
                      <Image 
                        src={comment?.user?.avatar || defaultAvt}
                        alt='avt'
                        width={30}
                        height={30}
                        style={{ borderRadius: '50%' }}
                      />
                      <div className={styles['wrap-caption-modal-content']}>
                        <div className={styles['caption']}>
                          <Link
                            href={`${ROUTE_PATH.personalUser}/${comment?.user?.username}`}
                            className={styles['btn-username']}
                          >
                            {comment?.user?.username}
                          </Link>
                          &ensp;
                          <span>{comment?.content}</span>
                          
                        </div>
                        <Flex align='center'>
                          <span className={styles['time-ago']}>
                            {getTimeAgo(comment?.createdAt)}
                          </span>
                          <span
                            className={styles['reply']}
                            onClick={() => handleReplies(comment?.commentId, comment?.commentId, comment?.user?.userId)}
                          >
                            Reply
                          </span>
                          &ensp;
                          {(comment?.user?.userId === currentUser?.userId || post?.userId === currentUser?.userId) && (
                            <Dropdown menu={{ items: post?.userId === currentUser?.userId ? itemsForOwnerPost : items }}
                              trigger={['click']}
                              placement='bottomRight'
                            >
                              <MoreOutlined rotate={90} style={{fontSize: 18}} onClick={() => setCommentSelected(comment)}/>
                            </Dropdown>
                          )}
                        </Flex>
                        <div className={styles['wrap-reply-comment']}>
                          {post?.comments.some(
                            (cmt: any) => cmt.parentCommentId === comment.commentId,
                          ) && (
                            <div
                              className={styles['text-view-more-replies']}
                              onClick={() =>
                                toggleReplies(comment?.commentId, comment?.parentCommentId)
                              }
                            >
                              {repliesVisible[comment.parentCommentId]?.[comment.commentId]
                                ? 'Hide all replies'
                                : 'View all replies'}
                            </div>
                          )}

                          {/* replies comments */}
                          {post?.comments
                            .filter((cmt: any) => cmt.parentCommentId === comment.commentId)
                            .map((replyCmt: any, index: number) => (
                              <div
                                className={styles['wrap-all-replies-comment']}
                                key={index}
                              >
                                {repliesVisible[comment.parentCommentId]?.[comment.commentId] && (
                                  <div className={styles['wrap-caption-modal']}>
                                    <Image 
                                      src={replyCmt?.user?.avatar || defaultAvt}
                                      alt='avt'
                                      width={30}
                                      height={30}
                                      style={{ borderRadius: '50%' }}
                                    />
                                    <div className={styles['wrap-caption-modal-content']}>
                                      <div className={styles['caption']}>
                                        <Link
                                          href={`${ROUTE_PATH.personalUser}/${replyCmt?.user?.username}`}
                                          className={styles['btn-username']}
                                        >
                                          {replyCmt?.user?.username}
                                        </Link>
                                        &ensp;
                                        <span>{replyCmt?.content}</span>
                                      </div>
                                      <div>
                                        <span className={styles['time-ago']}>
                                          {getTimeAgo(replyCmt?.createdAt)}
                                        </span>
                                        <span
                                          className={styles['reply']}
                                          onClick={() =>
                                            handleReplies(comment?.commentId, replyCmt?.commentId, comment?.user?.userId)
                                          }
                                        >
                                          Reply
                                        </span>
                                        &ensp;
                                        {replyCmt?.user?.userId === currentUser?.userId && (
                                          <Dropdown menu={{ items }}
                                            trigger={['click']}
                                            placement='bottomRight'
                                          >
                                            <MoreOutlined rotate={90} style={{fontSize: 18}} onClick={() => setCommentSelected(replyCmt)}/>
                                          </Dropdown>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}

                          {/* Wrap input reply */}
                          {inputRepliesVisible[comment.commentId]?.[comment.commentId] && (
                            <div
                              className={`${styles['wrap-comment-action']} ${styles['wrap-reply-action']}`}
                            >
                              <textarea
                                className={styles['input-comment']}
                                placeholder='Add a comment'
                                onChange={(e) => setReplyCommentText(e.target.value)}
                                value={replyCommentText}
                              />
                              <span className={styles['btn-link']}
                                onClick={() => handleSubmitComment(replyCommentText, post?.postId, comment?.commentId)}
                                style={{cursor: (replyCommentText.trim() !== "") ? 'pointer' : 'default', color: (replyCommentText.trim() !== "") ? "#007aff" : "#56a5fa"}}
                                >Reply
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div><EmptyComponent description={"No comment"}/></div>
              )}
            </div>

            {/* section of reaction and comment icon */}
            <div className={styles['wrap-reaction-comment-icon']}>
              {post?.reactions?.some((reaction: any) => reaction.userId === currentUser?.userId) ? (
                <>
                  <HeartFilled onClick={handleDeleteReaction}
                    className='icon'
                    style={{ fontSize: '22px', color: 'red', cursor: 'pointer' }}
                  />
                  &ensp;&ensp;&ensp;
                </>
              ) : (
                <>
                  <HeartOutlined onClick={handleReaction}
                    className='icon'
                    style={{ fontSize: '22px', color: '#000', cursor: 'pointer' }}
                  />
                  &ensp;&ensp;&ensp;
                </>
              )}
              <MessageOutlined style={{ fontSize: 23, cursor: 'pointer' }} /> 
            </div>
            <div className={styles['amount-of-reactions']} onClick={showModalListReaction}>
              {post?.reactions?.length}&ensp;
              {post?.reactions?.length > 1 ? 'likes' : 'like'}
            </div>
            <div className={styles['post-created-at']}>{getDateWithFormat(post?.createdAt)}</div>

            <div className={styles['wrap-comment-action']}>
              <textarea
                className={styles['input-comment']}
                placeholder='Add a comment'
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
              />
              <span className={styles['btn-link']} onClick={() => handleSubmitComment(commentText, post?.postId, undefined)}
                style={{cursor: (commentText.trim() !== "") ? 'pointer' : 'default', color: (commentText.trim() !== "") ? "#007aff" : "#56a5fa"}}
                >Post</span>
            </div>
          </div>
        </Col>
      </Row>
        {/* modal comment */}
      <Modal
          title='Are you sure want to delete this ?'
          open={modalState.isModalDeleteCommentOpen}
          onCancel={handleCancelModalDeleteComment}
          onOk={handleOkModalDeleteComment}
          okText='Delete'
          okType='danger'
          okButtonProps={{ loading: postState.loadingDeletePost }}
          cancelButtonProps={{ disabled: postState.loadingDeletePost }}
        />
        <Modal
          open={modalState.isModalEditCommentOpen}
          onCancel={handleCancelModalEditComment}
          onOk={handleOkModalEditComment}
          okText='Update'
          okButtonProps={{ loading: commentState.isLoadingUpdate, disabled: !handleValidateString(editCommentText)}}
          cancelButtonProps={{ disabled: commentState.isLoadingUpdate }}
        >
          <div className={styles['wrap-comment-action']}>
            <textarea
              className={`${styles['input-comment']} ${styles['input-comment-edit']}`}
              placeholder='Edit your comment'
              onChange={(e) => setEditCommentText(e.target.value)}
              value={editCommentText}
              disabled={commentState.isLoadingUpdate}
            />
          </div>
        </Modal>
        {/* modal post */}
      <Modal
          title='Are you sure want to delete this ?'
          open={modalState.isModalDeletePostOpen}
          onCancel={handleCancelModalDeletePost}
          onOk={handleOkModalDeletePost}
          okText='Delete'
          okType='danger'
          okButtonProps={{ loading: postState.loadingDeletePost }}
          cancelButtonProps={{ disabled: postState.loadingDeletePost }}
        />
        <Modal
          open={modalState.isModalEditPostOpen}
          onCancel={handleCancelModalEditPost}
          onOk={handleOkModalEditPost}
          okText='Update'
          okButtonProps={{ loading: postState.loadingUpdatePost, disabled: !handleValidateString(text)}}
          cancelButtonProps={{ disabled: postState.loadingUpdatePost }}
        >
          <ReactQuill
                className={styles["wrap-caption"]}
                style={{maxHeight: 200, overflowY: "scroll", marginTop: "10px", cursor: (postState.loadingUpdatePost) ? "not-allowed" : "auto"}}
                modules={{
                  toolbar: [],
                }}
                theme='snow'
                placeholder="Edit caption"
                value={content}
                onChange={onChangeCaption}
              />
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
          <ListReaction post={post} closeModal={handleCancelModalListReaction}/>
        </Modal>
    </>
  );
};

export default memo(DetailComments);
