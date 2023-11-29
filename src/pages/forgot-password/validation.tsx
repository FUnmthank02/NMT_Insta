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
import { RootState } from '@/redux/store';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const Validation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isValidateStateLoading = useSelector((state: RootState) => state.validateResetCode.loading);
  useDocumentTitle("Validate Reset Code");

  const onFinish = (values: any) => {
    ForgotPasswordServices.validateResetCodeProcess(dispatch, values.resetCode, onSuccess, onFail);
  };

  const onSuccess = (message: string) => {
    notification["success"]({
      message: message ?? "Reset code is correct",
    });
    router.push(ROUTE_PATH.resetPassword);
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
                name='validation-reset-code-form'
                layout='vertical'
                style={{ minWidth: 300 }}
                onFinish={onFinish}
                disabled={isValidateStateLoading}
              >
                <div className={styles['wrap-logo']}>
                  <Link href={'/'}>
                    <Image priority className={styles['logo']} src={logo} alt='logo'/>
                  </Link>
                </div>
                <div className={styles['title-form']}>Reset Code Validation</div>
                <Form.Item
                  name='resetCode'
                  rules={[{ required: true, message: 'Please input reset code!' }]}
                >
                  <Input placeholder='Reset code'/>
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{width: '100%', marginTop: '10px'}}
                    loading={isValidateStateLoading}
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

export default Validation;
