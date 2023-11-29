import { Form, Button, Input, notification } from 'antd';
import pic1 from '@/assets/images/pic1.jpg';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import styles from '@/assets/styles/authen/signin.module.scss';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ForgotPasswordServices } from '@/services/auth/forgotPassword';
import { ROUTE_PATH } from '@/utilities/enums';
import { SignInServices } from '@/services/auth/signIn';
import { RootState } from '@/redux/store';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isResetStateLoading = useSelector((state: RootState) => state.resetPassword.loading);
  useDocumentTitle("Reset Password");

  const onFinish = (values: any) => {
    ForgotPasswordServices.resetPasswordProcess(dispatch, values.newPassword, onSuccess, onFail);
  };

  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Success"
    });
    // log out
    SignInServices.logOutProcess(dispatch);
    router.push(ROUTE_PATH.signIn);
  }

  const onFail = (message: string) => {
    notification["error"]({
      message: message ?? "Fail"
    });
  }
  
  return (
    <>
      <section className={styles['container']}>
        <main className={styles['wrap-main']}>
          <div className={styles['wrap-left']}>
            <Image priority className={styles['login-image']}
              src={pic1}
              alt='image'
            />
          </div>
          <div className={styles['wrap-right']}>
            <div className={styles['wrap-form']}>
              <Form
                name='forgot-password-form'
                layout='vertical'
                style={{ minWidth: 300 }}
                onFinish={onFinish}
                disabled={isResetStateLoading}
              >
                <div className={styles['wrap-logo']}>
                  <Link href={'/'}>
                    <Image priority className={styles['logo']} src={logo} alt='logo'/>
                  </Link>
                </div>
                <div className={styles['title-form']}>Reset Password</div>
                <Form.Item
                  name='newPassword'
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder='New password'/>
                </Form.Item>

                <Form.Item
                  name='cfPassword'
                  dependencies={['newPassword']}
                  rules={[
                  { required: true, message: 'Please input confirm password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The confirm password does not match your password!'));
                    },
                  }),
                ]}
                >
                  <Input.Password placeholder='Confirm password'/>
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{width: '100%', marginTop: '10px'}}
                    loading={isResetStateLoading}
                  >
                    Submit
                  </Button>
                </Form.Item>
                <div className={styles['wrap-link']}>Back to&ensp;
                  <Link className='link' href={"/sign-in"}>Sign in here</Link>
                </div>
              </Form>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default ResetPassword;
