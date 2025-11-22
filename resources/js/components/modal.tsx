import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataModalProps } from '@/types';


export default function Modal({ isOpen,
    onClose,
    onSubmit,
    title,
    description,
    children,
    submitLabel = 'Simpan',
    cancelLabel = 'Batal',
    isLoading = false, }: DataModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[7px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="py-4">{children}</div>

                <DialogFooter>
                    <Button type="button" variant="outline" className='rounded-[7px] text-primary hover:bg-primary border-primary' onClick={onClose} disabled={isLoading}>
                        {cancelLabel}
                    </Button>
                    <Button onClick={onSubmit} disabled={isLoading} className='rounded-[7px]'>
                        {isLoading ? 'Menyimpan...' : submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}