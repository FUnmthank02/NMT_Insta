import { Flex, Spin } from "antd"
import { memo } from "react";

const LoadingComponent = (props: any) => {
  return (
    <>
      <Flex justify="center" align="center" style={{height: "100vh"}}>
          <Spin size={props.size} />
      </Flex>
    </>
  )
}

export default memo(LoadingComponent);