import '@/assets/styles/globals.css'
import { useBeforeRender } from '@/hooks/useBeforeRender';
import { AppLayout } from '@/layout/AppLayout';
import { DefaultLayout } from '@/layout/DefaultLayout';
import MessageLayout from '@/layout/MessageLayout';
import SettingsLayout from '@/layout/SettingsLayout';
import { store } from '@/redux/store';
import { PAGE_MESSAGE_LAYOUT, PAGE_NOT_LOGIN_LIST, PAGE_SETTINGS_LAYOUT } from '@/utilities/constants';
import { ROUTE_PATH } from '@/utilities/enums';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';

const MiddleWare = ({ children }: any) => {
  const router = useRouter();
  const path = (/#!(\/.*)$/.exec(router.asPath) ?? [])[1];
  if (path) {
    router.replace(path);
  }
  const { accessToken } = useSelector((state: any) => state.auth) as any;

  const url = router.pathname;

  useBeforeRender(() => {
    if (accessToken) {
      if (PAGE_NOT_LOGIN_LIST.includes(url as ROUTE_PATH)) {
        router.push(ROUTE_PATH.home);
      } else {
        router.push(url);
      }
    } else
      router.push(ROUTE_PATH.signIn);
  }, [accessToken]);

  if (PAGE_NOT_LOGIN_LIST.includes(url as ROUTE_PATH)) {
      return <DefaultLayout>{children}</DefaultLayout>;
  } else if (PAGE_SETTINGS_LAYOUT.includes(url as ROUTE_PATH)) {
      return <AppLayout><SettingsLayout>{children}</SettingsLayout></AppLayout>;
  } else if (PAGE_MESSAGE_LAYOUT.includes(url as ROUTE_PATH)) {
      return <AppLayout><MessageLayout>{children}</MessageLayout></AppLayout>;
  } else
      return <AppLayout>{children}</AppLayout>;
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
        <title>NMT Insta</title>
      </Head>
      <Provider store={store}>
        <MiddleWare dangerouslySetInnerHtml>
          <Component {...pageProps} suppressHydrationWarning={true} />
        </MiddleWare>
      </Provider>
    </>
  );
}
