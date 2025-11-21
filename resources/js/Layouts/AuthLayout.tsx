import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { FlashNotification } from '@/components/toast/flash-notification';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <>
      <FlashNotification />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-slate-950 to-slate-900 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl mx-auto flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-2">
              {title}
            </h1>
            <p className="text-sm  text-slate-400">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;