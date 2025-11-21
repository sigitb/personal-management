import { useState } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  show: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    setToast({
      show: true,
      type,
      title,
      message,
    });
  };

  const success = (message: string, title: string = 'Success!') => {
    showToast('success', title, message);
  };

  const error = (message: string, title: string = 'Error!') => {
    showToast('error', title, message);
  };

  const warning = (message: string, title: string = 'Warning!') => {
    showToast('warning', title, message);
  };

  const info = (message: string, title: string = 'Info') => {
    showToast('info', title, message);
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    hideToast,
  };
};