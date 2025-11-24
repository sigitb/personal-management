import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MultiSelectSearchProps, NormalSelectProps, SingleSelectSearchProps } from '@/types/select';

// 1. Multiple Select dengan Search
export function MultiSelectSearch({
  options,
  placeholder = "Select items...",
  value,
  onChange,
  className = "",
}: MultiSelectSearchProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value ?? []);

  // ✅ Sync internal state with external value
  useEffect(() => {
    setSelectedValues(value ?? []);
  }, [value]);

  // ✅ Faster label lookup
  const optionMap = useMemo(
    () => Object.fromEntries(options.map((o) => [o.value, o.label])),
    [options]
  );

  const handleSelect = (selectedValue: string) => {
    const newValues = selectedValues.includes(selectedValue)
      ? selectedValues.filter((item) => item !== selectedValue)
      : [...selectedValues, selectedValue];

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValues = selectedValues.filter((item) => item !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={`w-full border-gray-700 rounded-[7px] justify-between h-auto min-h-10 ${className}`}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => (
                <Badge key={val} variant="secondary" className="mr-1 pr-1">
                  {optionMap[val]}
                  <span
                    className="ml-1 rounded-full hover:bg-gray-300 cursor-pointer inline-flex items-center justify-center w-4 h-4"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => handleRemove(val, e)}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No item found.</CommandEmpty>

          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${selectedValues.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                    }`}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// 2. Single Select dengan Search
export function SingleSelectSearch({
  options,
  placeholder = "Select item...",
  value: controlledValue,
  onChange,
  className = "",
}: SingleSelectSearchProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(controlledValue || "");

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    onChange?.(newValue);
    setOpen(false);
  };

  useEffect(() => {
    setValue(controlledValue ?? "");
  }, [controlledValue]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full rounded-[7px] border-gray-700 justify-between ${className}`}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-[7px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${value === option.value ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// 3. Select Normal (tanpa search)
export function NormalSelect({
  options,
  placeholder = "Select item...",
  value: controlledValue,
  onChange,
  className = "",
}: NormalSelectProps) {
  const [value, setValue] = useState<string>(controlledValue || "");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={`w-full rounded-[7px] ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className='rounded-[7px]'>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


