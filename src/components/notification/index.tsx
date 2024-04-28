import Image from 'next/image';
import styles from '@/assets/styles/components/notification/styles.module.scss';
import { memo, useEffect, useState } from 'react';
import defaultAvt from '@/assets/images/defaultAvatar.jpg';
import { MEDIA_TYPE, NOTIFICATION_TYPE, ROUTE_PATH } from '@/utilities/enums';
import { getContentNotificationOfType, getTimeAgo } from '@/utilities/helper';
import { NotificationServices } from '@/services/notification';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Dropdown, Flex, MenuProps, Modal, notification } from 'antd';
import Empty from '../empty';
import { CheckOutlined, MoreOutlined } from '@ant-design/icons';
import { UpdateNotificationModel } from '@/utilities/interfaces';
import DetailComments from '../detailComments';
import { useRouter } from 'next/router';

const NotificationComponent = ({ closeNotify }: any) => {
  const [listNotification, setListNotification] = useState<any>([]);
  const [postSelected, setPostSelected] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isModalDetailPostOpen, setIsModalDetailPostOpen] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    NotificationServices.getNotificationProcess(dispatch, currentUser?.userId, onSuccess, onFail);
  }, [refresh]);

  const onSuccess = (data: any) => {
    setListNotification(data);
  };

  const onFail = (message: string) => {
    notification['error']({
      message: message || 'Fail',
    });
  };

  const handleMarkAllAsRead = () => {
    NotificationServices.updateAllNotificationProcess(dispatch, currentUser?.userId, onSuccessUpdateAll, onFail);
  };

  const onSuccessUpdateAll = () => {
    handleRefresh();
  };
  
  const onSuccessUpdateSingleNotify = () => {
    handleRefresh();
    // closeNotify();
    // showModalDetailPost();
  };

  const handleClickViewItem = (notification: any) => {
    if (!notification?.isRead) {
      const updateNotifyModel: UpdateNotificationModel = {
        notifyId: notification?.notifyId,
        fromUserId: notification?.fromUserId,
        toUserId: notification?.toUserId,
        postId: notification?.postId,
        isRead: true,
        content: notification?.content,
        type: notification?.type,
        createdAt:  notification?.createdAt
      }
      NotificationServices.updateNotificationProcess(dispatch, updateNotifyModel, onSuccessUpdateSingleNotify, onFail);
    }
    closeNotify();
    if (notification?.postId) {
      setPostSelected(notification?.post);
      showModalDetailPost();
    } else {
      router.push(`${ROUTE_PATH.personalUser}/${notification?.fromUser?.username}`);
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleCancelModalDetailPost = () => {
    setIsModalDetailPostOpen(false);
  };

  const showModalDetailPost = () => {
    setIsModalDetailPostOpen(true);
  };

  const items: MenuProps['items'] = [
    {
      label: <Flex style={{zIndex: 1000000}} align='center' onClick={handleMarkAllAsRead}>
        <CheckOutlined style={{ fontSize: 16 }}/>&ensp;Mark all as read</Flex>,
      key: '0',
    },
  ];

  return (
    <>
      <div className={styles['wrap-list-search']}>
      
        {listNotification?.length > 0 && (
          <Flex justify='flex-end' style={{marginBottom: 20}}>
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement='bottomRight'
            >
              <MoreOutlined
                rotate={90}
                style={{ fontSize: 25 }}
              />
            </Dropdown>
          
          </Flex>
        )}
        {listNotification?.length > 0 ? (
          listNotification.map((item: any, index: number) => (
            <div
              key={index}
              className={styles['items']}
              style={{background: item?.isRead ? "#f9f9f9" : "#e1e1e1"}}
            >
              <div
                className={styles['link']}
                onClick={() => handleClickViewItem(item)}
              >
                <Flex
                  gap={15}
                  align='center'
                >
                  <Image
                    priority
                    className={styles['avatar']}
                    src={item?.fromUser?.avatar || defaultAvt}
                    alt='avt'
                    width={40}
                    height={40}
                  />
                  <div className={styles['wrap-content-item']}>
                    <b>{item?.fromUser?.username || 'N/A'}</b>&ensp;
                    {getContentNotificationOfType(item?.type)}
                    {item?.type !== NOTIFICATION_TYPE.follow && ' '}
                    {item?.content}
                    &ensp;
                    <div className={styles['item-createdAt']}>{getTimeAgo(item?.createdAt)}</div>
                  </div>
                </Flex>
                {item?.type !== NOTIFICATION_TYPE.follow && (
                  <>
                    {item?.post?.media[0]?.mediaType === MEDIA_TYPE.image ? (
                      <Image
                        priority
                        src={item?.post?.media[0].mediaUrl || defaultAvt}
                        alt='avt'
                        width={40}
                        height={40}
                        style={{ borderRadius: '5px' }}
                      />
                    ) : (
                      <video
                        src={item?.post?.media[0].mediaUrl}
                        autoPlay={false}
                        muted
                        controls={false}
                        style={{ borderRadius: '5px' }}
                        height={40}
                        width={40}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>
            <Empty description={'No notification'} />
          </div>
        )}
        <Modal
          open={isModalDetailPostOpen}
          onCancel={handleCancelModalDetailPost}
          style={{ top: '75px' }}
          footer={null}
          width={1100}
          closeIcon={null}
        >
          <DetailComments post={postSelected} handleRefresh={handleRefresh} closeModalComment={handleCancelModalDetailPost}/>
        </Modal>
      </div>
    </>
  );
};

export default memo(NotificationComponent);
