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
import { ActionButton, ActionButtonsProps, ActionInputField } from "@/types/datatable";
import { useConfirmation } from "@/hooks/use-confirmatio";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { MultiSelectSearch, NormalSelect, SingleSelectSearch } from "./select-all";
import { Option } from "@/types/select";
import { DatePicker, DateRangePicker } from "./datepicker";

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

    const handleFormAction = ({ label,
        placeholder,
        key,
        type,
        options }: ActionInputField) => {
        switch (type) {
            case "select":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <NormalSelect
                            options={options as Option[]}
                            onChange={(value) => handleChange(key, value)}
                            placeholder={placeholder}
                        />
                    </div>
                );
            case "multiple-select":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <MultiSelectSearch
                            options={options as Option[]}
                            onChange={(value) => handleChange(key, value)}
                            placeholder={placeholder}
                        />
                    </div>
                );
            case "select-search":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <SingleSelectSearch
                            options={options as Option[]}
                            onChange={(value) => handleChange(key, value)}
                            placeholder={placeholder}
                        />
                    </div>
                );
            case "date":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <DatePicker key={key} placeholder={`pilih tanggal....`} onChange={(value) => handleChange(key, value)} />
                    </div>
                )
            case "date-range":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <DateRangePicker key={key} placeholder={`pilih tanggal....`} onChange={(value) => handleChange(key, value)} />
                    </div>
                )

            case "number":
            case "text":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <Input
                            className='rounded-[7px]'
                            size={10}
                            id={key}
                            type={type}
                            placeholder={placeholder}
                            onChange={(e) => handleChange(key, e.target.value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <div className="flex items-center gap-1">
            {actions.length <= 4 ? (
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
                                    className="rounded-[7px]"
                                    onClick={() => handleActionClick(action)}
                                >
                                    {Icon && <Icon size={16} className="rounded-[7px]" />}
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
                                        <div key={input.key} className="mb-2">
                                            {handleFormAction(input)}
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
