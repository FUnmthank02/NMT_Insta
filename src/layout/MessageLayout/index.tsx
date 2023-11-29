import styles from "@/assets/styles/layout/messageLayout.module.scss";
import ChatList from "@/components/message/listChat";
import { UserServices } from "@/services/user";
import { Drawer, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const MessageLayout = ({children}: any) => {
  const [listUsers, setListUsers] = useState<any>([]);
  const [curWidth, setCurWidth] = useState(window.innerWidth);
  const [openBoxMessage, setOpenBoxMessage] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    UserServices.getUsersProcess(dispatch, "", onSuccess, onFail);
    const handleWindowResize = () => {
      setCurWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const onSuccess = (data: any) => {
    setListUsers(data);
  }

  const onFail = (message: string) => {
    notification["error"]({
      message: message || "Fail"
    });
  }

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        listUsers,
      } as any);
    }
    return child;
  });

  const showDrawerBoxMessage = () => {
    setOpenBoxMessage(true);
  };
  
  const onCloseBoxMessage = () => {
    setOpenBoxMessage(false);
  };

  return (
    <>
      <section className={styles['wrap-main']}>
        <aside className={styles['aside']}>
          <h3 className={styles['title']}>Messages</h3>
          <ChatList listUsers={listUsers} showBoxMessageMb={showDrawerBoxMessage}/>
        </aside>
        {
          curWidth > 600 ?
          <main className={styles['wrap-content']} style={{flex: 1}}>
            {enhancedChildren}
          </main>
          :
          <Drawer title="Message box" placement="right" onClose={onCloseBoxMessage} open={openBoxMessage} width={"100%"} zIndex={10001}>
            <main className={styles['wrap-content']} style={{flex: 1}}>
              {enhancedChildren}
            </main>
          </Drawer>
        }
      </section>
    </>
  )
};

export default MessageLayout;