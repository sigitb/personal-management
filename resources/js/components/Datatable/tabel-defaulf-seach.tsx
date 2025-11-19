import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface DefaultSearchProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onApply: () => void;
}

export function DefaultSearch({ filters, onFiltersChange, onApply }: DefaultSearchProps) {
    const [search, setSearch] = useState(filters['search']);

    const handleFilterChange = (key: string, value: string) => {
        setSearch(value);
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <>
            <div className="relative w-64">
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                    type='text'
                    placeholder='Search...'
                    value={search}
                    className='w-full pl-9 rounded-[7px]'
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
            </div>

            <Button onClick={onApply} size='sm' className='rounded-[7px]'>
                <Search className='w-4 h-4 mr1.5' />
                Search
            </Button>
        </>
    )
}
