import { TableHead, TableRow } from '@/components/ui/table';
import { Column } from '@/types/datatable';
import { ChevronDown, ChevronUp, ChevronsUpDown, Pin, PinOff } from 'lucide-react';

interface TableHeaderRowProps {
    columns: Column[];
    sortConfig: { column: string; direction: 'asc' | 'desc' };
    pinnedColumns: string[];
    columnWidths: Record<string, number>;
    onSort: (columnKey: string) => void;
    onTogglePin: (columnKey: string) => void;
    headerRefs: React.MutableRefObject<Record<string, HTMLTableCellElement | null>>;
    getPinnedLeft: (columnKey: string) => number;
}

export function TableHeaderRow({
    columns,
    sortConfig,
    pinnedColumns,
    columnWidths,
    onSort,
    onTogglePin,
    headerRefs,
    getPinnedLeft,
}: TableHeaderRowProps) {
    return (
        <TableRow>
            {columns.map((col) => {
                const isPinned = pinnedColumns.includes(col.key);
                const leftPosition = isPinned ? getPinnedLeft(col.key) : 0;

                return (
                    <TableHead
                        key={col.key}
                        ref={(el) => {
                            headerRefs.current[col.key] = el;
                        }}
                        className={`
              ${isPinned ? 'sticky bg-background z-20' : 'bg-background'}
              transition-all duration-200
            `}
                        style={
                            isPinned
                                ? {
                                    left: `${leftPosition}px`,
                                    boxShadow: '4px 0 8px -2px rgba(0,0,0,0.15)',
                                    borderRight: '1px solid hsl(var(--border))',
                                }
                                : {}
                        }
                    >
                        <div className="flex items-center gap-2 whitespace-nowrap min-w-fit">
                            <span className="font-semibold">{col.label}</span>
                            <div className="flex items-center gap-1">
                                {col.sortable && (
                                    <button
                                        onClick={() => onSort(col.key)}
                                        className="hover:bg-muted p-1 rounded transition-colors"
                                        title="Sort column"
                                    >
                                        {sortConfig.column === col.key ? (
                                            sortConfig.direction === 'asc' ? (
                                                <ChevronUp className="h-4 w-4 text-primary" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-primary" />
                                            )
                                        ) : (
                                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                )}
                                {col.pinnable && (
                                    <button
                                        onClick={() => onTogglePin(col.key)}
                                        className="hover:bg-muted p-1 rounded transition-colors"
                                        title={isPinned ? 'Unpin column' : 'Pin column'}
                                    >
                                        {isPinned ? (
                                            <PinOff className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Pin className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </TableHead>
                );
            })}
        </TableRow>
    );
}