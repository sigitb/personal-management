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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { MoreHorizontal } from "lucide-react";
import { ActionButton, ActionButtonsProps } from "@/types/datatable";
import { useConfirmation } from "@/hooks/use-confirmatio";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export default function ActionButtons({ id, actions }: ActionButtonsProps) {
    const { confirmAction, requestConfirmation, clearConfirmation } = useConfirmation();

    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleActionClick = (action: ActionButton) => {
        if (action.confirm || action.confirmWithForm) {
            // reset input setiap buka dialog baru
            setFormData({});
            requestConfirmation(action);
        } else {
            action.onClick(id);
        }
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction.onClick(id, formData);
            clearConfirmation();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {actions.length <= 2 ? (
                actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    key={action.label}
                                    variant={action.variant ?? "ghost"}
                                    size="sm"
                                    className={cn(action.textColor, "rounded-[7px] opacity-80 hover:opacity-100", `hover:${action.textColor}`)}
                                    onClick={() => handleActionClick(action)}
                                >
                                    {Icon && <Icon size={16} />}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="top"
                                className="bg-primary text-white font-medium text-[11px] py-1.5"
                            >
                                {action.label}
                            </TooltipContent>
                        </Tooltip>
                    );
                })
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-[7px]">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-[7px]">
                        {actions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <DropdownMenuItem
                                    key={action.label}
                                    className={cn(action.textColor, "rounded-[7px] opacity-80 hover:opacity-95", `focus:${action.textColor}`)}
                                    onClick={() => handleActionClick(action)}
                                >
                                    {Icon && <Icon size={16} className={cn(action.textColor, "rounded-[7px] opacity-80 hover:opacity-95", `focus:${action.textColor}`)} />}
                                    {action.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {confirmAction && (
                <AlertDialog
                    open={!!confirmAction}
                    onOpenChange={clearConfirmation}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Aksi</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menjalankan aksi{" "}
                                <strong>{confirmAction.label}</strong>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* --- Dynamic Input Form --- */}
                        {confirmAction.confirmWithForm &&
                            confirmAction.inputs &&
                            confirmAction.inputs.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    {confirmAction.inputs.map((input) => (
                                        <div key={input.name}>
                                            <label className="text-sm font-medium">
                                                {input.label}
                                            </label>

                                            {/* TEXT */}
                                            {input.type === "text" && (
                                                <Input
                                                    placeholder={input.placeholder}
                                                    value={formData[input.name] || ""}
                                                    onChange={(e) =>
                                                        handleChange(input.name, e.target.value)
                                                    }
                                                    className="mt-1"
                                                />
                                            )}

                                            {/* NUMBER */}
                                            {input.type === "number" && (
                                                <Input
                                                    type="number"
                                                    placeholder={input.placeholder}
                                                    value={formData[input.name] || ""}
                                                    onChange={(e) =>
                                                        handleChange(input.name, Number(e.target.value))
                                                    }
                                                    className="mt-1"
                                                />
                                            )}

                                            {/* TEXTAREA */}
                                            {input.type === "textarea" && (
                                                <Textarea
                                                    placeholder={input.placeholder}
                                                    value={formData[input.name] || ""}
                                                    onChange={(e) =>
                                                        handleChange(input.name, e.target.value)
                                                    }
                                                    className="mt-1"
                                                />
                                            )}

                                            {/* SELECT */}
                                            {input.type === "select" && (
                                                <select
                                                    className="border rounded-md p-2 w-full mt-1"
                                                    value={formData[input.name] || ""}
                                                    onChange={(e) =>
                                                        handleChange(input.name, e.target.value)
                                                    }
                                                >
                                                    <option value="">Pilih...</option>
                                                    {input.options?.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                            {/* CHECKBOX */}
                                            {input.type === "checkbox" && (
                                                <div className="flex items-center mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[input.name] || false}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                input.name,
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <span>{input.placeholder}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm}>
                                Lanjutkan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
