import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { TablePaginationProps } from "@/types/datatable";

export function TablePagination({
    pagination,
    onPageChange,
}: TablePaginationProps) {

    const { current_page, last_page } = pagination;

    // ---- Generate pages with ellipsis ----
    const generatePages = () => {
        const pages: (number | "...")[] = [];

        const first = 1;
        const last = last_page;
        const current = current_page;
        pages.push(first);

        if (current > first + 1) {
            pages.push("...");
        }

        if (current !== first && current !== last) {
            pages.push(current);
        }

        if (current < last - 1) {
            pages.push("...");
        }

        if (last !== first) {
            pages.push(last);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* Left side info */}
            <div className="text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} entries
            </div>

            {/* Right side pagination */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Pagination>
                    <PaginationContent className="text-sm">

                        {/* Previous button */}
                        <PaginationItem className="text-sm">
                            <PaginationPrevious
                                onClick={() => current_page > 1 && onPageChange(current_page - 1)}
                                className={cn(
                                    "rounded-[7px] hover:text-primary",
                                    current_page === 1 && "pointer-events-none opacity-50"
                                )}
                            />
                        </PaginationItem>

                        {/* Page numbers + ellipsis */}
                        {pages.map((page, i) => (
                            <PaginationItem key={i} className="text-sm">
                                {page === "..." ? (
                                    <span className="px-2 text-muted-foreground select-none">…</span>
                                ) : (
                                    <PaginationLink
                                        onClick={() => onPageChange(page)}
                                        isActive={page === current_page}
                                        className={cn(
                                            "rounded-[7px] size-7 hover:text-primary",
                                            page === current_page &&
                                            "bg-primary text-white hover:bg-primary hover:text-white"
                                        )}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        {/* Next button */}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => current_page < last_page && onPageChange(current_page + 1)}
                                className={cn(
                                    "rounded-[7px] hover:text-primary text-sm",
                                    current_page === last_page && "pointer-events-none opacity-50"
                                )}
                            />
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
