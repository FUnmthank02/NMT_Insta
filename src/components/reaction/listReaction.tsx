import { memo, useEffect, useState } from "react";
import { Flex } from "antd";
import Image from "next/image";
import Link from "next/link";
import styles from "@/assets/styles/components/follow/styles.module.scss";
import { ROUTE_PATH } from "@/utilities/enums";

const ListReaction = ({ post, closeModal }: any) => {
  const [listReaction, setListReaction] = useState<any>([]);

  useEffect(() => {
    setListReaction(post?.reactions);
  }, [post?.reactions]);

  return (
    <>
      <div>
        <div className={styles["wrap-list"]}>
          {
            listReaction?.length > 0 ?
            listReaction.map((item: any, index: number) => (
            <>
              <Flex justify="space-between" align="center" className={styles["wrap-item"]} key={index}>
                <Flex align="center" gap={10}>
                  <Image src={item?.user?.avatar} alt="avatar" width={40} height={40} style={{borderRadius: "50%"}}/>
                  <Flex vertical>
                    <Link href={`${ROUTE_PATH.personalUser}/${item?.user?.username}`} 
                    style={{color: "#000", fontWeight: 600}} onClick={() => closeModal()}
                    >{item?.user?.username}</Link>
                    <span>{item?.user?.name}</span>
                  </Flex>
                </Flex>
              </Flex>
            </>
            ))
            :
            <Flex justify="center">No reaction.</Flex>
          }
        </div>
      </div>
    </>
  )
}

export default memo(ListReaction);