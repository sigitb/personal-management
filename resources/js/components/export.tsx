import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Link } from "@inertiajs/react";
import { ExportItem } from "@/types/datatable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


interface ExportDataProps {
    title: string;
    items: ExportItem[]
}
export function ExportData({ title, items }: ExportDataProps) {
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={"sm"} className="rounded-[7px] border-primary text-primary">
                    <Download className="w-4 h-4" />
                    {title}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-[7px] w-54" align="start">
                {
                    items.map((item) => (
                        <DropdownMenuItem key={item.title}>
                            <Link href={item.href}>
                                {item.title}
                            </Link>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>

    )
}