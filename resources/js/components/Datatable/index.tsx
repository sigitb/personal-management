import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Column, DataTableProps } from '@/types/datatable';
import { Table, TableHeader } from '../ui/table';
import { TableHeaderRow } from './table-header';
import { TableBodyContent } from './table-body';
import { TablePagination } from './table-pagination';
import { TableFilters } from './table-filter';
import { Card, CardContent } from '../ui/card';


export function DataTable({
    columns,
    configFilter,
    data,
    pagination,
    filters = {},
    sort,
}: DataTableProps) {
    const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);
    const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [sortConfig, setSortConfig] = useState(
        sort || { column: '', direction: 'asc' as const }
    );
    const headerRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Measure column widths
    useEffect(() => {
        const measureWidths = () => {
            const widths: Record<string, number> = {};
            Object.entries(headerRefs.current).forEach(([key, ref]) => {
                if (ref) {
                    widths[key] = ref.offsetWidth;
                }
            });
            setColumnWidths(widths);
        };

        const timer = setTimeout(measureWidths, 100);
        return () => clearTimeout(timer);
    }, [columns, data, pinnedColumns]);

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

    // Navigate with filters and sort
    const navigate = (params: Record<string, any>) => {
        router.get(window.location.pathname, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Apply filters
    const applyFilters = () => {
        navigate({
            ...localFilters,
            sort_by: sortConfig.column,
            sort_direction: sortConfig.direction,
            page: 1,
        });
    };

    // Reset filters
    const resetFilters = () => {
        setLocalFilters({});
        navigate({
            sort_by: sortConfig.column,
            sort_direction: sortConfig.direction,
            page: 1,
        });
    };

    // Handle sort
    const handleSort = (columnKey: string) => {
        const newDirection =
            sortConfig.column === columnKey && sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc';

        setSortConfig({ column: columnKey, direction: newDirection });

        navigate({
            ...localFilters,
            sort_by: columnKey,
            sort_direction: newDirection,
            page: pagination.current_page,
        });
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        navigate({
            ...localFilters,
            sort_by: sortConfig.column,
            sort_direction: sortConfig.direction,
            page,
        });
    };

    // Handle per page change
    const handlePerPageChange = (perPage: string) => {
        navigate({
            ...localFilters,
            sort_by: sortConfig.column,
            sort_direction: sortConfig.direction,
            per_page: perPage,
            page: 1,
        });
    };

    // Toggle pin column
    const togglePinColumn = (columnKey: string) => {
        setPinnedColumns((prev) =>
            prev.includes(columnKey)
                ? prev.filter((k) => k !== columnKey)
                : [...prev, columnKey]
        );
    };

    // Sort columns: pinned first, then regular
    const sortedColumns = [
        ...(pinnedColumns
            .map((key) => columns.find((col) => col.key === key))
            .filter(Boolean) as Column[]),
        ...columns.filter((col) => !pinnedColumns.includes(col.key)),
    ];

    return (
        <Card>
            <CardContent>
                <div className="space-y-4 w-full">
                    {/* Filters */}
                    {/* <TableFilters
                        configFilter={configFilter}
                        filters={localFilters}
                        onFiltersChange={setLocalFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                    /> */}

                    {/* Table */}
                    <div
                        ref={tableContainerRef}
                        className="rounded-xl border overflow-x-auto relative w-full"
                        style={{ maxWidth: '100%' }}
                    >
                        <Table className="relative">
                            <TableHeader>
                                <TableHeaderRow
                                    columns={sortedColumns}
                                    sortConfig={sortConfig}
                                    pinnedColumns={pinnedColumns}
                                    columnWidths={columnWidths}
                                    onSort={handleSort}
                                    onTogglePin={togglePinColumn}
                                    headerRefs={headerRefs}
                                    getPinnedLeft={getPinnedLeft}
                                />
                            </TableHeader>
                            <TableBodyContent
                                columns={sortedColumns}
                                data={data}
                                pinnedColumns={pinnedColumns}
                                getPinnedLeft={getPinnedLeft}
                            />
                        </Table>
                    </div>

                    {/* Pagination */}
                    <TablePagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
