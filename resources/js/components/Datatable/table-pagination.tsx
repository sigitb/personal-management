import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PaginationData } from '@/types/datatable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: string) => void;
}

export function TablePagination({
    pagination,
    onPageChange,
    onPerPageChange,
}: TablePaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
            {/* Left side - Rows per page */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Rows per page:
                    </span>
                    <Select
                        value={pagination.per_page.toString()}
                        onValueChange={onPerPageChange}
                    >
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
                </div>
                <span className="text-sm text-muted-foreground">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                </span>
            </div>

            {/* Right side - Page navigation */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm whitespace-nowrap px-2 font-medium">
                    Page {pagination.current_page} of {pagination.last_page}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}