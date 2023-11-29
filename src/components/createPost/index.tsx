import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { memo, useEffect, useState } from 'react';
import styles from '@/assets/styles/components/createPost/styles.module.scss';
import { IMAGE_TYPES, VIDEO_TYPES } from '@/utilities/enums';
import { Button, Col, Flex, Row, notification } from 'antd';
import { FILE_MAX_SIZE } from '@/utilities/constants';
import Image from 'next/image';
import defaultAvt from "@/assets/images/defaultAvatar.jpg"
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { getMaxHeightTextCreatePost, handleValidateString } from '@/utilities/helper';
import { AddPostModel } from '@/utilities/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PostServices } from '@/services/post';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, // This line is important to prevent ssr error
});

const modules = {
  toolbar: [], // Empty array to hide all toolbar options
};
const CreatePost = ({IsSelecting, toggleSelecting, closeModalCreate}: any) => {
  const [previewList, setPreviewList] = useState<string[]>([]);
  const [mediaFileList, setMediaFileList] = useState<any>([]);
  const [IsSelectingMedia, setSelectingMedia] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [text, setText] = useState<string>("");
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
    setSelectingMedia(IsSelecting);
    setContent("");
  }, [IsSelecting]);

  const handleChange = (e: any) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setMediaFileList(filesArray);
    if (handleValidateFile(filesArray)) {
      const previewArray: string[] = [];
  
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === "string") {
            previewArray.push(reader.result);
            if (previewArray.length === files.length) {
              setPreviewList(previewArray);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }

      setSelectingMedia(false);
      toggleSelecting();
    }
  };

  const handleValidateFile = (listFile: any): boolean => {
    const validImageTypes = Object.values(IMAGE_TYPES);
    const validVideoTypes = Object.values(VIDEO_TYPES);
    listFile.forEach((file: any) => {
      if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
        notification["error"]({
          message: "File's type must be JPEG/PNG/JPG! or MP4/AVI"
        });
        return false;
      } else if (validImageTypes.includes(file.type) &&(file.size / 1024 / 1024) >= FILE_MAX_SIZE.image) {
        notification["error"]({
          message: "File image's size must be smaller than 5MB!"
        });
        return false;
      } else if (validVideoTypes.includes(file.type) &&(file.size / 1024 / 1024) >= FILE_MAX_SIZE.video) {
        notification["error"]({
          message: "File video's size must be smaller than 50MB!"
        });
        return false;
      } 
    });
    return true;
  };

  const onChangeCaption = (content: any, delta: any, source: any, editor: any) => {
    const textContent = editor.getText(content);
    setText(textContent);
    setContent(content);
  };

  const handleSubmitPost = () => {
    const addPostModel: AddPostModel = {
      caption: content,
      userId: currentUser?.userId,
      createdAt: new Date()
    }
    PostServices.createPostProcess(dispatch, addPostModel, onSuccessPost, onFail);
  };

  const onSuccessPost = (postId: number) => {
    // call api upload media
    const data = {
      postId: postId,
      files: mediaFileList
    }
    PostServices.uploadPostMediaProcess(dispatch, data, onSuccessMedia, onFail);
  };

  const onSuccessMedia = () => {
    notification['success']({
      message: 'Created post successfully',
      duration: 2,
    });
    setContent("");
    setText("");
    setPreviewList([]);
    setMediaFileList([]);
    closeModalCreate();
  };

  const onFail = (message: string) => {
    notification['error']({
      message: message ?? 'Fail',
      duration: 2,
    });
  };

  return (
    <>
    {
      IsSelectingMedia &&
      <div className={styles["wrap-upload-photo"]}>
        <div className={styles["description-upload-photo"]}>Upload photos and videos here</div>
        <div className={styles["btn-upload-photo"]}>
            <label htmlFor="uploadFile">Select from computer</label>
            <input type="file" id="uploadFile" multiple hidden onChange={handleChange}/>
        </div>
      </div>
    }
    {
      !IsSelectingMedia &&
      <Row gutter={8}>
        <Col
          className='gutter-row'
          span={curWidth > 768 ? 15  : 24}
        >
          <Swiper
            navigation
            pagination={{ dynamicBullets: true }}
            className='mySwiper'
            modules={[Pagination, Navigation]}
            style={{boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 2px", borderRadius: "5px"}}
          >
            {previewList.map((item: any, index: number) => (
              <SwiperSlide key={index} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                {
                  item?.includes("data:image") ?
                  <Image className={styles["image-preview"]} src={item} alt='img' height={curWidth > 600 ? 585 : 242} width={100}/> :
                  <video src={item} autoPlay={false} controls height={curWidth > 600 ? 585 : 242} width={"100%"}/>
                }
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
        <Col
          className='gutter-row'
          span={curWidth > 768 ? 9 : 24}
        >
          <div className={styles["wrap-post-content-create"]}>
              <div className={styles["wrap-post-owner"]}>
                <Image src={currentUser?.avatar || defaultAvt} alt='avt' width={30} height={30} style={{borderRadius: "50%"}}/>
                <span className={styles["wrap-post-owner-name"]}>{currentUser?.username}</span>
              </div>
              <ReactQuill
                className={styles["wrap-caption"]}
                style={{maxHeight: getMaxHeightTextCreatePost(curWidth), overflowY: "scroll", margin: "10px 0 40px", cursor: (postState.loadingCreatePost || postState.loadingUploadPostMedia) ? "not-allowed" : "auto"}}
                modules={modules}
                theme='snow'
                placeholder="Write a caption"
                value={content}
                onChange={onChangeCaption}
              />
              
                <div className={styles["wrap-btn-post"]}>
                  <Button type='primary' disabled={!handleValidateString(text)}
                    onClick={handleSubmitPost}
                    loading={postState.loadingCreatePost || postState.loadingUploadPostMedia}
                    >Post</Button>
                </div>
          </div>
        </Col>
      </Row>
    }
    </>
  );
};

export default memo(CreatePost);
