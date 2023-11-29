import { Empty, Flex } from "antd"
import { memo } from "react";

const EmptyComponent = ({description}: any) => {
  return (
    <>
      <Flex justify="center" align="center">
        <Empty description={description}/>
      </Flex>
    </>
  )
}
export default memo(EmptyComponent);