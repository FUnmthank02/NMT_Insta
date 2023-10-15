import '@/assets/styles/globals.css'
import { useBeforeRender } from '@/hooks/useBeforeRender';
import { AppLayout } from '@/layout/AppLayout';
import { DefaultLayout } from '@/layout/DefaultLayout';
import { store } from '@/redux/store';
import { ROUTE_PATH } from '@/utilities/enums';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

const MiddleWare = ({ children }: any) => {
  const router = useRouter();
  const path = (/#!(\/.*)$/.exec(router.asPath) ?? [])[1];
  if (path) {
    router.replace(path);
  }
  // const { accessToken } = useSelector((state: any) => state.auth) as any;
  const accessToken = 'yasdRWAsdaw231AS4asGTYUKASNVCs';
  const PAGE_NOT_LOGIN = [
    ROUTE_PATH.login,
    ROUTE_PATH.register,
    ROUTE_PATH.forgotPassword,
  ];
  const url = router.pathname;

  useBeforeRender(() => {
    if (accessToken) {
      if (PAGE_NOT_LOGIN.includes(url as ROUTE_PATH)) {
        router.push(ROUTE_PATH.home);
      } else {
        router.push(url);
      }
    }
  }, [accessToken]);

  if (
    (accessToken && PAGE_NOT_LOGIN.includes(url as ROUTE_PATH)) ||
    !accessToken
  ) {
    return <DefaultLayout>{children}</DefaultLayout>;
  } else if (accessToken) {
    return <AppLayout>{children}</AppLayout>;
  } else return <></>;
};

export default function App({ Component, pageProps }: any) {
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) return <></>;

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="mask-icon" href="/favicon.ico" color="#5bbad5" />
        <title>Document</title>
      </Head>
      <Provider store={store}>
        <MiddleWare dangerouslySetInnerHtml>
          <Component {...pageProps} suppressHydrationWarning={true} />
        </MiddleWare>
      </Provider>
    </>
  );
}
