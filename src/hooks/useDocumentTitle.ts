import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
