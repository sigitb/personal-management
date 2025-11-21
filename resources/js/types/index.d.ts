import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface FlashData {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

export interface PageProps extends InertiaPageProps {
  auth: {
    user: User | null;
  };
  flash: FlashData;
}
