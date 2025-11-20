import { BreadcrumbDataItem } from "./breadcrumb";
import { Option } from "./select";

export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
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
    configFilter?: ConfigFilter[];
    withImport?: boolean;
    withExport?: ExportItem[];
    sort?: { column: string; direction: 'asc' | 'desc' };
    urlCreate?:string;
    breadcrumbs:BreadcrumbDataItem[];
    title:string;
}


export type ActionButton = {
    label: string;
    onClick: (id: string | number, data?: Record<string, any>) => void
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    confirm?: boolean;
    confirmWithForm?: boolean;
    textColor?: string;
    inputs?: ActionInputField[];
};

export interface ActionButtonsProps {
    id: number | string;
    actions: ActionButton[];
}

export interface TablePaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
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
export interface ConfigFilter {
    key: string;
    label: string;
    placeholder?: string;
    filterType?: "text" | "number" | "select" | "multiple-select" | "select-search" | "date" | "date-range";
    filterOptions?: Option[];
}

export interface TableFiltersProps {
    configFilter?: ConfigFilter[];
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    onApply: () => void;
    onReset: () => void;
}

export interface ActionInputField {
    key: string;                         // key
    label: string;                        // label di form
    type: "text" | "textarea" | "number" | "select" | "checkbox" | "multiple-select" | "select-search" | "date" | 'date-range';
    placeholder?: string;
    options?: Option[] // untuk select
}

export interface ExportItem {
    title: string;
    href: string;
}

