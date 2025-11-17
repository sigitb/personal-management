export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    filterType?: 'text' | 'select' | 'date';
    filterOptions?: { value: string; label: string }[];
    pinnable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface DataTableProps {
    columns: Column[];
    data: T[];
    pagination: PaginationData;
    filters?: Record<string, any>;
    sort?: { column: string; direction: 'asc' | 'desc' };
}