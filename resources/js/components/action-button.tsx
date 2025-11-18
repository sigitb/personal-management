// components/action-buttons/ActionButtons.tsx
"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";
import { ActionButton, ActionButtonsProps } from "@/types/datatable";
import { useConfirmation } from "@/hooks/use-confirmatio";

export default function ActionButtons({ id, actions }: ActionButtonsProps) {
    const { confirmAction, requestConfirmation, clearConfirmation } = useConfirmation();

    const handleActionClick = (action: ActionButton) => {
        if (action.confirm) {
            requestConfirmation(action);
        } else {
            action.onClick(id);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {actions.length <= 2 ? (
                actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Button
                            key={action.label}
                            variant={action.variant ?? "default"}
                            size="sm"
                            onClick={() => handleActionClick(action)}
                        >
                            {Icon && <Icon size={16} className="mr-1" />}
                            {action.label}
                        </Button>
                    );
                })
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {actions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <DropdownMenuItem
                                    key={action.label}
                                    onClick={() => handleActionClick(action)}
                                >
                                    {Icon && <Icon size={16} className="mr-2" />}
                                    {action.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {confirmAction && (
                <AlertDialog open={!!confirmAction} onOpenChange={clearConfirmation}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Aksi</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menjalankan aksi{" "}
                                <strong>{confirmAction.label}</strong>? Tindakan ini mungkin tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    confirmAction.onClick(id);
                                    clearConfirmation();
                                }}
                            >
                                Lanjutkan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
