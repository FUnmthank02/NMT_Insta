import { memo, useEffect, useState } from "react";
import { Button, Flex, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { handleValidateString } from "@/utilities/helper";
import styles from "@/assets/styles/components/follow/styles.module.scss";
import { ROUTE_PATH } from "@/utilities/enums";

const { Search } = Input;

const ListFollower = ({ followers, closeModal }: any) => {
  const [listFollower, setListFollower] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setListFollower(followers);
  }, [followers]);

  const handleSearchFollower = (value: string) => {
    if (handleValidateString(value)) {
      setLoading(true);
      const filterList = followers.filter((item: any) => 
      (item?.followerNavigation?.username.includes(value)) || (item?.followerNavigation?.name.includes(value)));
      setListFollower(filterList);
      setLoading(false);
    } else {
      setListFollower(followers);
    }
  };

  return (
    <>
      <div>
        <Search placeholder="Search" allowClear onChange={(e) => handleSearchFollower(e.target.value)}
         style={{ width: "100%" }} loading={isLoading}/>
        <div className={styles["wrap-list"]}>
          {
            listFollower?.length > 0 ?
            listFollower.map((item: any, index: number) => (
            <>
              <Flex justify="space-between" align="center" className={styles["wrap-item"]} key={index}>
                <Flex align="center" gap={10}>
                  <Image src={item?.followerNavigation?.avatar} alt="avatar" width={40} height={40} style={{borderRadius: "50%"}}/>
                  <Flex vertical>
                    <Link href={`${ROUTE_PATH.personalUser}/${item?.followerNavigation?.username}`} 
                    style={{color: "#000", fontWeight: 600}} onClick={() => closeModal()}
                    >{item?.followerNavigation?.username}</Link>
                    <span>{item?.followerNavigation?.name}</span>
                  </Flex>
                </Flex>
              </Flex>
            </>
            ))
            :
            <Flex justify="center">No results found.</Flex>
          }
        </div>
      </div>
    </>
  )
}

export default memo(ListFollower);