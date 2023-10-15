import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CustomNotFound = () => {
  useDocumentTitle("Page Not Found");

  return (
    <>
      <h1>Page Not Found</h1>
    </>
  );
};

export default CustomNotFound;

CustomNotFound.getLayout = function PageLayout(page: any) {
  return <>{page}</>;
};
