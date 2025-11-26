import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfigFilter, TableFiltersProps } from '@/types/datatable';
import { MultiSelectSearch, NormalSelect, SingleSelectSearch } from '../select-all';
import { Option } from '@/types/select';
import { DatePicker, DateRangePicker } from '../datepicker';
import { useEffect, useState } from 'react';

export function TableFilters({
    configFilter,
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: TableFiltersProps) {
    const filterableColumns = configFilter || [];

    if (filterableColumns.length === 0) return null;
    interface DateRange {
        from: Date | undefined;
        to?: Date | undefined;
    }

    type FilterValue = string | number | Date | string[] | number[] | DateRange | undefined;

    const handleFilterChange = (key: string, value: FilterValue) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleFormFilter = ({
        label,
        placeholder,
        key,
        filterOptions,
        filterType,
        fetchUrl,
        dependsOn
    }: ConfigFilter) => {
        switch (filterType) {
            case "select":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <NormalSelect
                            options={filterOptions as Option[]}
                            onChange={(value) => handleFilterChange(key, value)}
                            placeholder={placeholder}
                            value={filters[key] || ""}
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
                            options={filterOptions as Option[]}
                            onChange={(value) => handleFilterChange(key, value)}
                            placeholder={placeholder}
                            value={filters[key] || ""}
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
                            options={filterOptions as Option[]}
                            onChange={(value) => handleFilterChange(key, value)}
                            placeholder={placeholder}
                            value={filters[key] || ""}
                        />
                    </div>
                );
            case "date":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <DatePicker key={key} placeholder={`pilih tanggal....`} value={filters[key] || ''} onChange={(value) => handleFilterChange(key, value)} />
                    </div>
                )
            case "date-range":
                return (
                    <div className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium">
                            {label}
                        </label>
                        <DateRangePicker key={key} placeholder={`pilih tanggal....`} value={filters[key] || ''} onChange={(value) => handleFilterChange(key, value)} />
                    </div>
                )
            case "select-dynamic":
                const parentValue = filters[dependsOn!];

                const [options, setOptions] = useState<Option[]>([]);

                useEffect(() => {
                    if (!fetchUrl || !dependsOn) return;

                    if (!parentValue) {
                        setOptions([]);
                        handleFilterChange(key, undefined);
                        return;
                    }

                    const loadOptions = async () => {
                        const res = await fetch(`${fetchUrl}/${parentValue}`);
                        const data = await res.json();
                        setOptions(data);
                    };

                    loadOptions();
                }, [parentValue]);

                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{label}</label>
                        <NormalSelect
                            options={options}
                            placeholder={placeholder}
                            value={filters[key] || ""}
                            onChange={(value) => handleFilterChange(key, value)}
                        />
                    </div>
                );
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
                            type={filterType}
                            placeholder={placeholder}
                            value={filters[key] || ""}
                            onChange={(e) => handleFilterChange(key, e.target.value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full mt-3 bg-card border border-gray-700 rounded-[7px] p-4 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
                {filterableColumns.map((col) => (
                    <div key={col.key} className="mb-2">
                        {handleFormFilter(col)}
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    onClick={onApply}
                    size="sm"
                    className='rounded-[7px]'
                >
                    Apply Filters
                </Button>
                <Button
                    onClick={onReset}
                    variant='outline'
                    size="sm"
                    className='rounded-[7px] text-primary border-primary hover:bg-primary hover:text-primary-foreground'
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}