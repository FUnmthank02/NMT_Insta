import { database, ref } from "@/firebase/firebase";
import { RootState } from "@/redux/store";
import { ROUTE_PATH } from "@/utilities/enums";
import { Flex } from "antd";
import { off, onValue } from "firebase/database";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvt from "@/assets/images/defaultAvatar.jpg";
import styles from "@/assets/styles/message/listChat.module.scss";

const ChatList = ({listUsers, showBoxMessageMb}: any) => {
  const [chatsList, setChatsList] = useState<any>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    const chatsRef = ref(database, `chatsInfo/${currentUser?.userId}`);

    const handleSnapshot = (snapshot: any) => {
      if (snapshot.exists()) {
        const chatsData = snapshot.val();
        const chatsArray = Object.keys(chatsData);
        setChatsList(chatsArray);
      }
    };

    onValue(chatsRef, handleSnapshot);

    return () => {
      off(chatsRef, 'value', handleSnapshot);
    };
  }, [currentUser]);

  const redirectToMessageWithFriend = (toUserId?: number) => {
    router.push({
      pathname: ROUTE_PATH.message,
      query: {
        toUserId: toUserId
      }
    });
    showBoxMessageMb();
  };

  
  return (
    <div className={styles["wrap-list"]}>
      {
      chatsList.map((toUserId: number, index: number) => {
        const user = listUsers.find((item: any) => item.userId === Number(toUserId));
          return (
            <div key={index}>
              <Flex align="center" justify="flex-start" gap={20} className={styles["item-list-user"]}
                onClick={() => redirectToMessageWithFriend(user?.userId)}>
                <Image className={styles["avatar"]} src={user?.avatar || defaultAvt} alt="avatar" width={50} height={50} style={{borderRadius: "50%"}}/>
                <Flex vertical justify="center">
                  <span className={styles["username"]}>{user?.username}</span>
                  <span className={styles["name"]}>{user?.name}</span>
                </Flex>
              </Flex>
            </div>
          );
      })}
    </div>
  );
};

export default ChatList;




