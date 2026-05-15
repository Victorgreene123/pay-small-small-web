'use client';

import { useState, useCallback } from 'react';
import { AlertType } from '@/components/CustomAlert';

interface AlertState {
  message: string;
  type: AlertType;
  isOpen: boolean;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    type: 'info',
    isOpen: false,
  });

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({
      message,
      type,
      isOpen: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};
