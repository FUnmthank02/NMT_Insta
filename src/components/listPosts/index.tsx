import Image from 'next/image';
import DetailComments from '../detailComments';
import defaultAvt from '@/assets/images/defaultAvatar.jpg';
import styles from '@/assets/styles/components/listPosts/listPosts.module.scss';
import { Col, Modal, Row } from 'antd';
import { memo, useEffect, useState } from 'react';
import { HeartFilled, MessageFilled } from '@ant-design/icons';
import { MEDIA_TYPE } from '@/utilities/enums';

const ListPosts = ({ posts, refresh }: any) => {
  const [isModalCommentOpen, setIsModalCommentOpen] = useState<boolean>(false);
  const [postSelected, setPostSelected] = useState<any>([]);

  useEffect(() => {
    const post = posts.find((p:any) => p?.postId === postSelected?.postId);
    if (post) {
      setPostSelected(post);
    }
  }, [posts]);

  const showModalComment = (post: any) => {
    setPostSelected(post);
    setIsModalCommentOpen(true);
  };

  const handleCancelModalComment = () => {
    setIsModalCommentOpen(false);
  };

  const handleRefresh = () => {
    refresh();
  }

  return (
    <>
      <Row
        gutter={[16, 16]}
        className={styles['posts-main-wrap-posts']}
      >
        {/* loop */}
        {
          posts?.length > 0 && posts
          .slice()
          .sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }).map((post: any, index: number) => (
            <Col
              className='gutter-row'
              span={8} key={index}
            >
              <div className={styles['posts-main-post']} onClick={() => showModalComment(post)}>
                {
                  post?.media[0]?.mediaType === MEDIA_TYPE.image ?
                  <Image
                    className={styles['posts-main-post-media']}
                    src={post?.media[0]?.mediaUrl || defaultAvt}
                    alt='post'
                    width={313}
                    style={{width: '100% !important'}}
                    height={313}
                  /> :
                  <video className={styles['posts-main-post-media']} src={post?.media[0]?.mediaUrl} 
                  autoPlay={false} width={313} height={313} />
                }
                <div className={styles['wrap-hidden-infor-post-overlay']}></div>
                <div className={styles['wrap-hidden-infor-post']}>
                    <HeartFilled style={{ fontSize: 20, color: "#fff" }} />&ensp;
                    <span className={styles['wrap-hidden-infor-post-text']}>{post?.reactions?.length}</span>
                    &ensp;&ensp;&ensp;
                    <MessageFilled style={{ fontSize: 19, color: "#fff" }} />&ensp;
                    <span className={styles['wrap-hidden-infor-post-text']}>{post?.comments?.length}</span>
                  </div>
              </div>
            </Col>
          ))
        }
        
      </Row>
      <Modal
        open={isModalCommentOpen}
        onCancel={handleCancelModalComment}
        footer={null}
        width={1100}
        style={{ top: '75px' }}
        closeIcon={null}
      >
        <DetailComments post={postSelected} handleRefresh={handleRefresh} closeModalComment={handleCancelModalComment}/>
      </Modal>
    </>
  );
};

export default memo(ListPosts);
