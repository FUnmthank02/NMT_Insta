import Image from "next/image";
import avt from "@/assets/images/defaultAvatar.jpg";
import { Button, Form, Input, Modal, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { IMAGE_TYPES } from "@/utilities/enums";
import { FILE_MAX_SIZE, OPTIONS_GENDER } from "@/utilities/constants";
import styles from "@/assets/styles/user/edit.module.scss";
import { UserServices } from "@/services/user";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMinWidthFormEditProfile } from "@/utilities/helper";

const EditProfile = () => {
  useDocumentTitle("Edit Profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [curWidth, setCurWidth] = useState(window.innerWidth);

  const [defaultValuesForm, setDefaultValuesForm] = useState<any>({
    userId: 0,
    email: "",
    name: "",
    gender: undefined,
    phoneNumber: undefined,
    bio: undefined
  });
  
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const editProfileLoadingState = useSelector((state: RootState) => state.editProfile.loading);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      email: currentUser.email,
      name: currentUser.name,
      gender: currentUser.gender,
      phoneNumber: currentUser.phoneNumber,
      bio: currentUser.bio,
    });

    setDefaultValuesForm({
      userId: currentUser.userId,
      email: currentUser.email,
      name: currentUser.name,
      gender: currentUser.gender,
      phoneNumber: currentUser.phoneNumber,
      bio: currentUser.bio
    });
  }, [currentUser]);
  
  useEffect(() => {
    const handleWindowResize = () => {
      setCurWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleValidateFile = (e: any) => {
    const file = e.target.files[0];
    const validTypes = Object.values(IMAGE_TYPES);
    if (!validTypes.includes(file.type)) {
      notification["error"]({
        message: "File's type must be JPEG/PNG/JPG!"
      });
    } else if ((file.size / 1024 / 1024) >= FILE_MAX_SIZE.image) {
      notification["error"]({
        message: "File's size must be smaller than 5MB!"
      });
    } else {
      handleUploadImage(file);
    }
  };

  const handleUploadImage = (file: File) => {
    const data = {
      userId: currentUser.userId,
      file
    }
    UserServices.uploadAvatarProcess(dispatch, data, onSuccess, onFail);
  };

  const onFinish = (values: any) => {
    const data = {
      userId: currentUser.userId,
      username: currentUser.username,
      email: values.email,
      name: values.name,
      password: undefined,
      gender: values.gender,
      phoneNumber: values.phoneNumber,
      bio: values.bio,
      avatar: currentUser.avatar,
      status: currentUser.status
    }
    UserServices.editProfileProcess(dispatch, data, onSuccess, onFail);
  };

  const handleCheckChange = (_:any, values: any) => {
    const curValues:any = {
      userId: currentUser.userId,
      email: values.email || undefined,
      name: values.name || undefined,
      gender: values.gender || undefined,
      phoneNumber: values.phoneNumber || undefined,
      bio: values.bio || undefined
    }
    
    const isEquals = Object.entries(defaultValuesForm).every(([key, value]) => {
      return (curValues as {[key: string]: any})[key] === value;
    });
    setIsDisabled(isEquals);
  };
  
  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Success"
    });
  }

  const onFail = (message: string) => {
    notification["error"]({
      message: message ?? "Fail"
    });
  }

  return (
    <>
      <section className={styles["wrap-edit-profile"]}>
        <h3 className={styles["title"]}>Edit profile</h3>
        <main className={styles["wrap-main-content"]}>

          <Modal style={{textAlign: "center"}} title="Change Profile Photo" open={isModalOpen} footer={null} onCancel={handleCancel} closeIcon={false}>
              <div className={styles["btn-upload-photo"]}>
                <label htmlFor="uploadFile" onClick={handleCancel}>Upload photo</label>
                <input type="file" id="uploadFile" multiple={false} hidden onChange={handleValidateFile}/>
              </div>
              <hr />
              <div className={styles["btn-cancel-photo"]} onClick={handleCancel}>Cancel</div>
          </Modal>

          <Form
                form={form}
                name='edit-profile-form'
                layout='horizontal'
                style={{ width: getMinWidthFormEditProfile(curWidth)}}
                onFinish={onFinish}
                onValuesChange={handleCheckChange}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                disabled={editProfileLoadingState}
              >
                <Form.Item
                  wrapperCol={{span: curWidth > 768 ? 16 : 24, offset: curWidth >= 600 ? 6 : 0}}
                >
                  <div style={{display: "flex", gap: "10px"}}>
                      <Image className={styles["avatar"]} priority width={40} height={40} src={currentUser?.avatar || avt} alt="avt" />
                      <div>
                        <p className={styles["name"]}>{currentUser?.username}</p>
                        <p className={styles["text-change-profile-photo"]} onClick={showModal}>Change profile photo</p>
                      </div>
                    </div>
                </Form.Item>
                <Form.Item
                  name='email'
                  label="Email"
                  style={{fontWeight: 600}}
                  rules={[{ required: true, message: 'Please input your email!' },
                { type: "email", message: "Please enter valid email"}]}
                >
                  <Input placeholder='Email' disabled/>
                </Form.Item>

                <Form.Item
                  name='name'
                  label="Name"
                  style={{fontWeight: 600}}
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder='Name'/>
                </Form.Item>
                <Form.Item
                  name='phoneNumber'
                  label="Phone number"
                  style={{fontWeight: 600}}
                >
                  <Input placeholder='Phone number'/>
                </Form.Item>
                <Form.Item
                  name='bio'
                  label="Bio"
                  style={{fontWeight: 600}}
                >
                  <Input.TextArea placeholder='Bio' rows={curWidth > 600 ? 4 : 2}/>
                </Form.Item>
                <Form.Item
                  name='gender'
                  label="Gender"
                  style={{fontWeight: 600}}
                >
                  <Select options={OPTIONS_GENDER}/>
                </Form.Item>
                <Form.Item wrapperCol={{span: 16, offset: 8}}>
                  <Button
                    loading={editProfileLoadingState}
                    type='primary'
                    htmlType='submit'
                    disabled={isDisabled}
                  >
                    Update
                  </Button>
                </Form.Item>
              </Form>
        </main>
      </section>
    </>
  )
};

export default EditProfile;