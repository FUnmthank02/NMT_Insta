import { memo, useEffect, useState } from "react";
import { Button, Flex, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { handleValidateString } from "@/utilities/helper";
import styles from "@/assets/styles/components/follow/styles.module.scss";
import { ROUTE_PATH } from "@/utilities/enums";

const { Search } = Input;

const ListFollowing = ({ followings, closeModal }: any) => {
  const [listFollowing, setListFollowing] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setListFollowing(followings);
  }, [followings]);

  const handleSearchFollowing = (value: string) => {
    if (handleValidateString(value)) {
      setLoading(true);
      const filterList = followings.filter((item: any) => 
      (item?.following?.username.includes(value)) || (item?.following?.name.includes(value)));
      setListFollowing(filterList);
      setLoading(false);
    } else {
      setListFollowing(followings);
    }
  };

  return (
    <>
      <div>
        <Search placeholder="Search" allowClear onChange={(e) => handleSearchFollowing(e.target.value)}
         style={{ width: "100%" }} loading={isLoading}/>
        <div className={styles["wrap-list"]}>
          {
            listFollowing?.length > 0 ?
            listFollowing.map((item: any, index: number) => (
            <>
              <Flex justify="space-between" align="center" className={styles["wrap-item"]} key={index}>
                <Flex align="center" gap={10}>
                  <Image src={item?.following?.avatar} alt="avatar" width={40} height={40} style={{borderRadius: "50%"}}/>
                  <Flex vertical>
                    <Link href={`${ROUTE_PATH.personalUser}/${item?.following?.username}`} 
                    style={{color: "#000", fontWeight: 600}} onClick={() => closeModal()}
                    >{item?.following?.username}</Link>
                    <span>{item?.following?.name}</span>
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

export default memo(ListFollowing);