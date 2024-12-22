import toast from '@/consts/toast';
import { useEffect } from 'react';

const useErrorToast = (error: string | null) => {
  useEffect(() => {
    const showErrorToast = async () => {
      if (error) {
        toast.show({
          message: error,
          intent: 'danger',
        });
      }
    };

    showErrorToast();
  }, [error]);
};

export default useErrorToast;
