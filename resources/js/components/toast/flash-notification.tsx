import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ToastNotification } from './toast-notification';

export const FlashNotification: React.FC = () => {
  const { flash } = usePage<PageProps>().props;
  
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (flash?.success) {
      setNotification({
        show: true,
        type: 'success',
        title: 'Success!',
        message: flash.success,
      });
    } else if (flash?.error) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Error!',
        message: flash.error,
      });
    } else if (flash?.warning) {
      setNotification({
        show: true,
        type: 'warning',
        title: 'Warning!',
        message: flash.warning,
      });
    } else if (flash?.info) {
      setNotification({
        show: true,
        type: 'info',
        title: 'Info',
        message: flash.info,
      });
    }
  }, [flash]);

  return (
    <ToastNotification
      type={notification.type}
      title={notification.title}
      message={notification.message}
      show={notification.show}
      onClose={() => setNotification({ ...notification, show: false })}
      position="top-right"
      duration={5000}
    />
  );
};
