import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ROUTE_PATH } from "@/utilities/enums";
import { Flex } from "antd";
import Link from "next/link";
import styles from "@/assets/styles/components/notFoundPage/styles.module.scss";

const CustomNotFound = () => {
  useDocumentTitle("Page Not Found");

  return (
    <>
      <Flex align="center" justify="center" vertical style={{height: "100vh", width: "100%"}}>
        <h1 className={styles["heading-404"]}>404</h1>
        <p className={styles["text-not-found"]}>Not Found</p>
        <p className={styles["main-text"]}>Sorry, this page isn't available.</p>
        <Link href={ROUTE_PATH.home} className={styles["link-go-back"]}>Go back to NMT - Insta</Link>
      </Flex>
    </>
  );
};

export default CustomNotFound;

CustomNotFound.getLayout = function PageLayout(page: any) {
  return <>{page}</>;
};
