import React, { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from "react-day-picker"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

// Types
// interface DateRange {
//     from: Date | undefined;
//     to?: Date | undefined;
// }

interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (date: DateRange | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

// Utility function untuk format tanggal
function formatDate(input: any): string {
    if (!input) return "";
  
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return "";
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
// Single Date Picker dengan Calendar
export function DatePicker({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    className = "",
    disabled = false,
}: DatePickerProps) {
    const [date, setDate] = useState<Date | undefined>(value);
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        onChange?.(selectedDate);
        setOpen(false);
    };

    useEffect(() => {
        setDate(value);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={`w-full justify-start text-left rounded-[7px] font-normal ${!date && "text-muted-foreground"
                        } ${className}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                />
            </PopoverContent>
        </Popover>
    );
}

// Date Range Picker dengan Calendar
export function DateRangePicker({
    value,
    onChange,
    placeholder = "Pilih rentang tanggal",
    className = "",
    disabled = false,
}: DateRangePickerProps) {
    const [range, setRange] = useState<DateRange | undefined>(value);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        setRange(value);
    }, [value]);


    const handleSelect = (selected: any) => {
        console.log(selected);
        
        setRange(selected);
        onChange?.(selected);


        // Auto close hanya jika kedua tanggal lengkap
        if (selected?.from != selected?.to ) {
            setTimeout(() => setOpen(false), 150);
        }
    };


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={`w-full justify-start text-left rounded-[7px] font-normal truncate ${!range?.from ? "text-muted-foreground" : ""
                        } ${className}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {range?.from ? (
                        range.to ? (
                            `${formatDate(range.from)} - ${formatDate(range.to)}`
                        ) : (
                            <span className="text-amber-600">Pilih tanggal akhir...</span>
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>


            <PopoverContent
                align="start"
                className="p-0 w-auto md:w-auto sm:w-[90vw] rounded-[7px]"
                onInteractOutside={(e) => {
                    if (range?.from && !range?.to) e.preventDefault();
                }}
            >
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 2}
                    defaultMonth={range?.from || new Date()}
                />
            </PopoverContent>
        </Popover>
    );
}