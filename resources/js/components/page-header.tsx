import { PageHeaderProps } from "@/types";
import { Breadcrumbs } from "./breadcrumbs";

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="item-center">
                <p className='text-[23px] font-semibold'>{title}</p>
                <p className='text-[13px] text-muted-foreground'>{description}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </div>
    )
}