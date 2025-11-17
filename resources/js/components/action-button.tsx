"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type ActionButton = {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    confirm?: boolean;
};

interface ActionButtonsProps {
    actions: ActionButton[];
}

export default function ActionButtons({ actions }: ActionButtonsProps) {
    const [confirmAction, setConfirmAction] = useState<ActionButton | null>(null);

    const visibleButtons = actions.slice(0, 2);
    const extraButtons = actions.slice(2);

    const handleActionClick = (action: ActionButton) => {
        if (action.confirm) {
            setConfirmAction(action);
        } else {
            action.onClick();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {
                actions.length <= 2 ? (
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
                )
            }

            {/* Modal konfirmasi untuk aksi yang butuh konfirmasi */}
            {confirmAction && (
                <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Aksi</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah kamu yakin ingin melakukan aksi{" "}
                                <strong>{confirmAction.label}</strong>?
                                Tindakan ini mungkin tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    confirmAction.onClick();
                                    setConfirmAction(null);
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
