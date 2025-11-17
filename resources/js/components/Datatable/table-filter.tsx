import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X } from 'lucide-react';
import { Column } from '@/types/datatable';


interface TableFiltersProps {
    columns: Column[];
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onApply: () => void;
    onReset: () => void;
}

export function TableFilters({
    columns,
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: TableFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const filterableColumns = columns.filter((col) => col.filterable);
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    if (filterableColumns.length === 0) return null;

    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Reset
                    </Button>
                )}
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                    {filterableColumns.map((col) => (
                        <div key={col.key} className="space-y-2">
                            <label className="text-sm font-medium">{col.label}</label>
                            {col.filterType === 'select' && col.filterOptions ? (
                                <Select
                                    value={filters[col.key] || ''}
                                    onValueChange={(value) => handleFilterChange(col.key, value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={`Filter ${col.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All</SelectItem>
                                        {col.filterOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    type={col.filterType || 'text'}
                                    placeholder={`Filter ${col.label}`}
                                    value={filters[col.key] || ''}
                                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                    className="w-full"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex items-end">
                        <Button onClick={onApply} className="w-full">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}