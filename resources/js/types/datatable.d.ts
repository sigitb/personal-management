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


type ActionButton = {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    confirm?: boolean;
};

export interface TablePaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: string) => void;
}

export interface TableBodyContentProps {
    columns: Column[];
    data: T[];
    pinnedColumns: string[];
    getPinnedLeft: (columnKey: string) => number;
}

export interface TableHeaderRowProps {
    columns: Column[];
    sortConfig: { column: string; direction: 'asc' | 'desc' };
    pinnedColumns: string[];
    columnWidths: Record<string, number>;
    onSort: (columnKey: string) => void;
    onTogglePin: (columnKey: string) => void;
    headerRefs: React.MutableRefObject<Record<string, HTMLTableCellElement | null>>;
    getPinnedLeft: (columnKey: string) => number;
}

interface TableFiltersProps {
    columns: Column[];
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onApply: () => void;
    onReset: () => void;
}