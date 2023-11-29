import { Flex, Form, Input, notification } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/assets/styles/search/styles.module.scss';
import { memo, useEffect, useState } from 'react';
import defaultAvt from '@/assets/images/defaultAvatar.jpg';
import { UserServices } from '@/services/user';
import { useDispatch } from 'react-redux';
import { ROUTE_PATH } from '@/utilities/enums';

const SearchComponent = ({ closeSearch, isResetSeach }: any) => {
  const [listSearch, setListSearch] = useState<any>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isResetSeach) {
      hanleResetField();
      setIsSearching(false);
    }
  }, [isResetSeach])

  const handleSearch = (changedValues: any) => {
    UserServices.getUsersProcess(dispatch, changedValues.search, onSuccess, onFail);
  };

  const handleCheckSearching = (e: any) => {
    if (e.target.value === "") setIsSearching(false);
    else setIsSearching(true);
  };

  const onSuccess = (data: any) => {
    setListSearch(data);
  };

  const onFail = (message: string) => {
    notification['error']({
      message: message || 'Fail',
    });
  };

  const hanleResetField = () => {
    form.resetFields();
  }

  const handleClose = () => {
    hanleResetField();
    closeSearch();
  }

  return (
    <>
      <Form
        form={form}
        name='signin-form'
        layout='vertical'
        style={{ minWidth: 300 }}
        onValuesChange={handleSearch}
      >
        <Form.Item name='search'>
          <Input
            placeholder='Search'
            allowClear
            onChange={handleCheckSearching}
          />
        </Form.Item>
      </Form>
      <div className={styles['wrap-list-search']}>
        {
          isSearching ? 
          <>
            {listSearch?.length > 0 ? (
              listSearch.map((item: any, index: number) => (
                <div
                  key={index}
                  className={styles['items']}
                >
                  <Link
                    href={`${ROUTE_PATH.personalUser}/${item?.username}`}
                    className={styles['link']}
                    onClick={handleClose}
                  >
                    <Image
                      priority
                      className={styles['avatar']}
                      src={item?.avatar || defaultAvt}
                      alt='avt'
                      width={40}
                      height={40}
                    />
                    <Flex vertical gap={7}>
                      <span className={styles['username']}>{item?.username}</span>
                      <span className={styles['name']}>{item?.name}</span>
                    </Flex>
                  </Link>
                </div>
              ))
            ) : (
              <div>No result found.</div>
            )}
          </> :
          <></>
        }

      </div>
    </>
  );
};

export default memo(SearchComponent);
