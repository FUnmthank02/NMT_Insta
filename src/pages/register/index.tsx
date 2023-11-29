import { Form, Button, Input, notification } from 'antd';
import pic1 from '@/assets/images/pic1.jpg';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import styles from '@/assets/styles/authen/signin.module.scss';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterServices } from '@/services/auth/register';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/utilities/enums';
import { RootState } from '@/redux/store';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isRegisterStateLoading = useSelector((state: RootState) => state.register.loading);
  useDocumentTitle("Register");

  const onFinish = (values: any) => {
    const createUserModel = {
      username: values.username,
      email: values.email,
      password: values.password,
      name: values.name,
      phoneNumber: values.phoneNumber
    }
    RegisterServices.registerProcess(dispatch, createUserModel, onSuccess, onFail);
  };

  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Success"
    });
    router.push(ROUTE_PATH.signIn);
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
                name='register-form'
                layout='vertical'
                style={{ minWidth: 300 }}
                onFinish={onFinish}
                disabled={isRegisterStateLoading}
              >
                <div className={styles['wrap-logo']}>
                  <Link href={'/'}>
                    <Image priority className={styles['logo']} src={logo} alt='logo'/>
                  </Link>
                </div>
                <div className={styles['title-form']}>Register</div>
                <Form.Item
                  name='username'
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder='Username'/>
                </Form.Item>
                <Form.Item
                  name='email'
                  rules={[
                    {type: 'email', required: true, message: 'Please enter valid email'},
                    { required: true, message: 'Please input your email!' }]}
                >
                  <Input placeholder='Email'/>
                </Form.Item>
                <Form.Item
                  name='name'
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder='Name'/>
                </Form.Item>

                <Form.Item
                  name='password'
                  rules={[{ required: true, message: 'Please input your password!' },
                    {min: 6, message: 'Password must be at least 6 characters'}
                ]}
                >
                  <Input.Password placeholder='Password'/>
                </Form.Item>
                <Form.Item
                  name='cfPassword'
                  dependencies={['password']}
                  rules={[
                  { required: true, message: 'Please input confirm password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The confirm password does not match your password!'));
                    },
                  }),
                ]}
                >
                  <Input.Password placeholder='Confirm password'/>
                </Form.Item>
                <Form.Item
                  name='phoneNumber'
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input placeholder='Phone number'/>
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{width: '100%'}}
                    loading={isRegisterStateLoading}
                  >
                    Register
                  </Button>
                </Form.Item>
                <div className={styles['wrap-link']}>You have an account already?&ensp;
                  <Link className='link' href={"/sign-in"}>Sign In here</Link>
                </div>
              </Form>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default Register;
