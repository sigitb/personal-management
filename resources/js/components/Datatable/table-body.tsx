import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TableBodyContentProps } from '@/types/datatable';


export function TableBodyContent({
    columns,
    data,
    pinnedColumns,
    getPinnedLeft,
}: TableBodyContentProps) {
    if (data.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <p className="text-lg font-medium">No data available</p>
                            <p className="text-sm">Try adjusting your filters</p>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }

    return (
        <TableBody>
            {data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                    {columns.map((col) => {
                        const isPinned = pinnedColumns.includes(col.key);
                        const leftPosition = isPinned ? getPinnedLeft(col.key) : 0;

                        return (
                            <TableCell
                                key={col.key}
                                className={`
                  ${isPinned ? 'sticky bg-background z-10' : ''}
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
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
}