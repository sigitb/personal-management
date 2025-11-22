import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { BreadcrumbDataItem } from './breadcrumb';

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

export interface ButtonCreateProps{
  href?: string;
  type: 'redirect' | 'modal';
  onClick?: () => void;
}

export interface PageHeaderProps{
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbDataItem[];
}

export interface ActionCrateProps{
  items: ActionCreateItem[]
}
export interface ActionCreateItem{
  label: string;
  icon?: LucideIcon;
  href?: string;
  type: 'redirect' | 'modal' | 'import';
  onClick?: () => void;
}

export interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}