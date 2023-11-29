import { Button, Form, Input, notification } from "antd";
import styles from "@/assets/styles/user/edit.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ChangePasswordServices } from "@/services/auth/changePassword";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMinWidthFormEditProfile } from "@/utilities/helper";

const ChangePassword = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [curWidth, setCurWidth] = useState(window.innerWidth);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const changePasswordLoadingState = useSelector((state: RootState) => state.changePassword.loading);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  useDocumentTitle("Change Password");
  
  
  useEffect(() => {
    const handleWindowResize = () => {
      setCurWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const onFinish = (values: any) => {
    const data = {
      userId: currentUser.userId,
      changePasswordModel: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }
    }
    ChangePasswordServices.changePasswordProcess(dispatch, data, onSuccess, onFail);
  };
  
  const handleValidate = (_:any, values: any) => {
    if (validateString(values.oldPassword)  && validateString(values.newPassword) && validateString(values.cfPassword))
      setIsDisabled(false);
    else 
      setIsDisabled(true);
  };

  const validateString = (value: string) => {
    if (!value || value.trim().length === 0)
      return false;
    return true;
  }

  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Success"
    });
    form.resetFields();
    setIsDisabled(true);
  }

  const onFail = (message: string) => {
    notification["error"]({
      message: message ?? "Fail"
    });
  }

  return (
    <>
      <section className={styles["wrap-edit-profile"]}>
        <h3 className={styles["title"]}>Change password</h3>
        <main className={styles["wrap-main-content"]}>
          <Form
                form={form}
                name='change-password-form'
                layout={curWidth > 768 ? 'horizontal' : 'vertical'}
                style={{ width: getMinWidthFormEditProfile(curWidth) }}
                onFinish={onFinish}
                labelCol={{ span: curWidth > 768 ? 8 : 24 }}
                wrapperCol={{ span: curWidth > 768 ? 16 : 24 }}
                disabled={changePasswordLoadingState}
                onValuesChange={handleValidate}
              >
                <Form.Item
                  name='oldPassword'
                  label="Old password"
                  style={{fontWeight: 600}}
                  rules={[{ required: true, message: 'Please input old password!' }]}
                >
                  <Input.Password placeholder='Old password'/>
                </Form.Item>

                <Form.Item
                  name='newPassword'
                  label="New password"
                  style={{fontWeight: 600}}
                  rules={[{ required: true, message: 'Please input new password!' }]}
                >
                  <Input.Password placeholder='New password'/>
                </Form.Item>

                <Form.Item
                  name='cfPassword'
                  label="Confirmation password"
                  dependencies={['newPassword']}
                  style={{fontWeight: 600}}
                  rules={[
                    { required: true, message: 'Please input confirm password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The confirm password does not match your password!'));
                      },
                    })
                  ]}
                >
                  <Input.Password placeholder='New password'/>
                </Form.Item>
                <Form.Item wrapperCol={{span: 16, offset: 8}}>
                  <Button
                    loading={changePasswordLoadingState}
                    type='primary'
                    htmlType='submit'
                    disabled={isDisabled}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
        </main>
      </section>
    </>
  )
};
export default ChangePassword;