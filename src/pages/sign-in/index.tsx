import { Form, Button, Input, notification } from 'antd';
import pic1 from '@/assets/images/pic1.jpg';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import styles from '@/assets/styles/authen/signin.module.scss';
import Link from 'next/link';
import { SignInServices } from '@/services/auth/signIn';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '@/redux/store';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSignInStateLoading = useSelector((state: RootState) => state.signIn.loading);
  const [form] = Form.useForm();
  useDocumentTitle("Sign In");

  const onFinish = (values: any) => {
    const signInModel = {
      username: values.username,
      password: values.password
    }
    SignInServices.signInProcess(dispatch, signInModel, onSuccess, onFail);
  };
  
  const onSuccess = () => {
  };

  const onFail = (message: string) => {
    notification["error"]({
      message: message ?? "Fail"
    });
  };
  
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
                form={form}
                name='signin-form'
                layout='vertical'
                style={{ minWidth: 300 }}
                onFinish={onFinish}
                disabled={isSignInStateLoading}
              >
                <div className={styles['wrap-logo']}>
                  <Link href={'/'}>
                    <Image priority className={styles['logo']} src={logo} alt='logo'/>
                  </Link>
                </div>
                <div className={styles['title-form']}>Sign In</div>
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder='Username'/>
                </Form.Item>

                <Form.Item
                  name='password'
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder='Password'/>
                </Form.Item>
                <Link className='link' href='/forgot-password'>Forgot password?</Link>
                <Form.Item>
                  <Button
                    loading={isSignInStateLoading}
                    type='primary'
                    htmlType='submit'
                    style={{width: '100%', marginTop: '10px'}}
                  >
                    Sign In
                  </Button>
                </Form.Item>
                <div className={styles['wrap-link']}>You do not have any account?&ensp;
                  <Link className='link' href={"/register"}>Register here</Link>
                </div>
              </Form>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default SignIn;
