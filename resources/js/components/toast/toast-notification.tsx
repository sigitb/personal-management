import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
    type: NotificationType;
    title: string;
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

const iconMap = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
};

const colorMap = {
    success: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50',
    error: 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50',
    info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50',
};

const positionMap = {
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
    type,
    title,
    message,
    show,
    onClose,
    duration = 5000,
    position = 'top-right',
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);
                return () => clearTimeout(timer);
            }
        }
    }, [show, duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!show) return null;

    return (
        <div
            className={`fixed ${positionMap[position]} z-100 transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
        >
            <Alert
                className={`${colorMap[type]} border-l-4 shadow-lg min-w-[350px] max-w-md rounded-2xl p-4 flex items-start gap-4`}
            >
                <div className="text-xl mt-1 flex-shrink-0">{iconMap[type]}</div>


                <div className="flex-1 space-y-1 leading-tight">
                    <AlertTitle className="font-semibold text-base">{title}</AlertTitle>
                    <AlertDescription className="text-sm opacity-90">{message}</AlertDescription>
                </div>


                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0"
                    onClick={handleClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </Alert>
        </div>
    );
};