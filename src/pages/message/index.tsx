import { database } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { ref, onValue, off, push, get, set } from 'firebase/database';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MessageOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from "antd";
import { getTimeFromTimestamp, handleValidateString } from "@/utilities/helper";
import styles from "@/assets/styles/message/styles.module.scss";
import Image from "next/image";
import defaultAvt from "@/assets/images/defaultAvatar.jpg";
import waveImg from "@/assets/images/wave-hand.png";
import { ROUTE_PATH } from "@/utilities/enums";
import Loading from "@/components/loading";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Message = ({listUsers}: any) => {
  useDocumentTitle("Message");
  const [messages, setMessages] = useState<any>([]);
  const [otherUser, setOtherUser] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSending, setSening] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const { query: { toUserId } } = router;

  useEffect(() => {
    if (toUserId) {
      setLoading(true);
      handleGetOtherUser();
      let first = currentUser?.userId;
      let second = toUserId;
      if (handleCompareNumber(currentUser?.userId, Number(toUserId))){
        first = toUserId;
        second = currentUser?.userId;
      }
      const chatRef = ref(database, `chats/${first}-${second}`);
  
      const handleSnapshot = (snapshot: any) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          const messagesArray = Object.values(messagesData);
          setMessages(messagesArray);
        }
        setLoading(false);
      };
  
      onValue(chatRef, handleSnapshot);
      return () => {
        off(chatRef, 'value', handleSnapshot);
      };
    }
  }, [currentUser?.userId, toUserId]);

  const handleCompareNumber = (firstN: number, secondN: number) => {
    return firstN < secondN;
  }
  const handleGetOtherUser = () => {
    const userFound = listUsers.find((item: any) => item?.userId === Number(toUserId));
    if (userFound) 
      setOtherUser(userFound);
    else 
      setOtherUser({});
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      setSening(true);
      const chatInfoRef = ref(database, `chatsInfo/${currentUser?.userId}/${toUserId}`);
      const chatInfoRef1 = ref(database, `chatsInfo/${toUserId}/${currentUser?.userId}`);
      get(chatInfoRef).then((snapshot) => {
        if (!snapshot.exists()) {
          // If the entry doesn't exist, create it
          set(chatInfoRef, true);
        }
      });
      get(chatInfoRef1).then((snapshot) => {
        if (!snapshot.exists()) {
          // If the entry doesn't exist, create it
          set(chatInfoRef1, true);
        }
      });

      let first = currentUser?.userId;
      let second = toUserId;
      if (handleCompareNumber(currentUser?.userId, Number(toUserId))){
        first = toUserId;
        second = currentUser?.userId;
      }
      
      const chatRef = ref(database, `chats/${first}-${second}`);
      push(chatRef, {
        text: newMessage,
        sender: currentUser?.userId,
        timestamp: Date.now(),
      });
      setNewMessage('');
      setSening(false);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Flex vertical className={styles["wrap-message-box"]}>
      {
        toUserId ?
        <>
          {
            isLoading ? <Loading size="large" /> :
            <>
            
                <Flex align="center" justify="space-between" className={styles["message-head"]}>
                  <Flex align="center" gap={10} justify="flex-start" className={styles["message-head-left"]}
                    onClick={() => router.push(`${ROUTE_PATH.personalUser}/${otherUser?.username}`)}>
                    <Image className={styles["head-avatar"]} src={otherUser?.avatar || defaultAvt} alt="avatar" width={40} height={40} />
                    <span className={styles["head-name"]}>{otherUser?.username}</span>
                  </Flex>
                </Flex>
            
              <Flex vertical flex={1} className={styles["wrap-content-message"]}>
                {
                  messages?.length > 0 ?
                  messages.map((message: any) => {
                    const user = listUsers.find((item: any) => item.userId === Number(message?.sender));
                    
                    return (
                    <div key={message.timestamp}>
                      {
                        currentUser?.userId === Number(message?.sender) ?
                        <>
                          <Flex align="center" justify="flex-end" gap={20} className={styles["wrap-item"]}>
                            <Tooltip placement="left" title={getTimeFromTimestamp(message.timestamp)} arrow={false}>
                              <div className={styles["wrap-text-owner"]}>
                                {message?.text}
                              </div>
                            </Tooltip>
                          </Flex>
                        </>
                        :
                        (<>
                          
                              <Flex align="center" justify="flex-start" gap={20} key={message.timestamp} className={styles["wrap-item"]}>
                                <Tooltip placement="left" title={user?.username} arrow={false}>
                                  <Image className={styles["head-avatar"]} src={user?.avatar || defaultAvt} alt="avatar" width={30} height={30} />
                                </Tooltip>
                                <Tooltip placement="left" title={getTimeFromTimestamp(message.timestamp)} arrow={false}>
                                  <div className={styles["wrap-text"]}>
                                    {message?.text}
                                  </div>
                                </Tooltip>
                              </Flex>
                            
                        </>)
                        
                      }
                    </div>
                  )}) :
                  <Flex align="center" justify="center" style={{height: "100%"}}>
                    <Image src={waveImg} alt="wave" width={60} height={60}/>
                    <div>Say hello to each other</div>
                  </Flex>
                }
              </Flex>
              <Flex className={styles["wrap-input"]}>
                <textarea
                  className={styles["input-box"]}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message..."
                  rows={1}
                  disabled={isSending}
                />
                <span className={styles["btn-send"]} onClick={handleSendMessage}
                style={{cursor: (handleValidateString(newMessage) || !isSending)  ? "pointer" : "not-allowed" }}
                >Send</span>
              </Flex>
            </>
          }
        </>
        :
        <>
          <Flex justify="center" align="center" flex={1} style={{height: "100%"}} vertical>
            <MessageOutlined style={{fontSize: 80, marginBottom: 20}}/>
            <p style={{fontSize: "20px"}}>Send messages to your friends.</p>
          </Flex>
        </>
      }
    </Flex>
  );
};

export default Message;