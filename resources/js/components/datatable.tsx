// components/DataTable.tsx
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, ChevronsUpDown, Pin, PinOff } from 'lucide-react';

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

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  pagination: PaginationData;
  filters?: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
}

export function DataTable({ columns, data, pagination, filters = {}, sort }: DataTableProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [sortConfig, setSortConfig] = useState(sort || { column: '', direction: 'asc' as const });
  const headerRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  // Measure column widths
  useEffect(() => {
    const widths: Record<string, number> = {};
    Object.entries(headerRefs.current).forEach(([key, ref]) => {
      if (ref) {
        widths[key] = ref.offsetWidth;
      }
    });
    setColumnWidths(widths);
  }, [columns, data]);

  // Calculate left position for pinned columns
  const getPinnedLeft = (columnKey: string): number => {
    const index = pinnedColumns.indexOf(columnKey);
    if (index === -1) return 0;
    
    let left = 0;
    for (let i = 0; i < index; i++) {
      left += columnWidths[pinnedColumns[i]] || 0;
    }
    return left;
  };

  // Apply filters to backend
  const applyFilters = () => {
    router.get(
      window.location.pathname,
      {
        ...localFilters,
        sort_by: sortConfig.column,
        sort_direction: sortConfig.direction,
        page: 1,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Handle sort
  const handleSort = (columnKey: string) => {
    const newDirection =
      sortConfig.column === columnKey && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    setSortConfig({ column: columnKey, direction: newDirection });

    router.get(
      window.location.pathname,
      {
        ...localFilters,
        sort_by: columnKey,
        sort_direction: newDirection,
        page: pagination.current_page,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      {
        ...localFilters,
        sort_by: sortConfig.column,
        sort_direction: sortConfig.direction,
        page,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Handle per page change
  const handlePerPageChange = (perPage: string) => {
    router.get(
      window.location.pathname,
      {
        ...localFilters,
        sort_by: sortConfig.column,
        sort_direction: sortConfig.direction,
        per_page: perPage,
        page: 1,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Toggle pin column
  const togglePinColumn = (columnKey: string) => {
    setPinnedColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((k) => k !== columnKey) : [...prev, columnKey]
    );
  };

  // Sort columns: pinned first (in order), then regular
  const sortedColumns = [
    ...pinnedColumns.map((key) => columns.find((col) => col.key === key)).filter(Boolean) as Column[],
    ...columns.filter((col) => !pinnedColumns.includes(col.key)),
  ];

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4">
        {columns
          .filter((col) => col.filterable)
          .map((col) => (
            <div key={col.key} className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">{col.label}</label>
              {col.filterType === 'select' && col.filterOptions ? (
                <Select
                  value={localFilters[col.key] || ''}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({ ...prev, [col.key]: value }))
                  }
                >
                  <SelectTrigger>
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
                  value={localFilters[col.key] || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        {columns.some((col) => col.filterable) && (
          <div className="flex items-end">
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto relative">
        <Table>
          <TableHeader>
            <TableRow>
              {sortedColumns.map((col) => {
                const isPinned = pinnedColumns.includes(col.key);
                const leftPosition = isPinned ? getPinnedLeft(col.key) : 0;
                
                return (
                  <TableHead
                    key={col.key}
                    ref={(el) => {
                      headerRefs.current[col.key] = el;
                    }}
                    className={isPinned ? 'sticky bg-background z-10' : ''}
                    style={isPinned ? { 
                      left: `${leftPosition}px`,
                      boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)'
                    } : {}}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span>{col.label}</span>
                      {col.sortable && (
                        <button
                          onClick={() => handleSort(col.key)}
                          className="hover:bg-muted p-1 rounded"
                        >
                          {sortConfig.column === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {col.pinnable && (
                        <button
                          onClick={() => togglePinColumn(col.key)}
                          className="hover:bg-muted p-1 rounded"
                        >
                          {isPinned ? (
                            <PinOff className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Pin className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {sortedColumns.map((col) => {
                    const isPinned = pinnedColumns.includes(col.key);
                    const leftPosition = isPinned ? getPinnedLeft(col.key) : 0;
                    
                    return (
                      <TableCell
                        key={col.key}
                        className={isPinned ? 'sticky bg-background z-10' : ''}
                        style={isPinned ? { 
                          left: `${leftPosition}px`,
                          boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)'
                        } : {}}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={pagination.per_page.toString()} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}