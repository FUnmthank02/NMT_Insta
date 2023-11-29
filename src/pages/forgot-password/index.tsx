import { Form, Button, Input, notification } from 'antd';
import pic1 from '@/assets/images/pic1.jpg';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import styles from '@/assets/styles/authen/signin.module.scss';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/utilities/enums';
import { ForgotPasswordServices } from '@/services/auth/forgotPassword';
import { RootState } from '@/redux/store';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isForgotStateLoading = useSelector((state: RootState) => state.forgotPassword.loading);
  useDocumentTitle("Forgot Password");

  const onFinish = (values: any) => {
    ForgotPasswordServices.forgotPasswordProcess(dispatch, values.email, onSuccess, onFail);
  };

  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Check your email to get reset code"
    });
    router.push(ROUTE_PATH.validationResetCode);
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
                disabled={isForgotStateLoading}
              >
                <div className={styles['wrap-logo']}>
                  <Link href={'/'}>
                    <Image priority className={styles['logo']} src={logo} alt='logo'/>
                  </Link>
                </div>
                <div className={styles['title-form']}>Forgot Password</div>
                <Form.Item
                  name='email'
                  rules={[{ required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please input valid email!' }]}
                >
                  <Input placeholder='Email'/>
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{width: '100%', marginTop: '10px'}}
                    loading={isForgotStateLoading}
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

export default ForgotPassword;
