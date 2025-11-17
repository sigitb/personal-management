
// import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, LucideIcon, Pencil, Trash } from 'lucide-react';
import ActionButtons from '@/components/action-button';
import AppLayout from '@/Layouts/AppLayout';
import { DataTable } from '@/components/Datatable';
import { Column, PaginationData } from '@/types/datatable';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
}


interface Props {
    users: User[];
    pagination: PaginationData;
    filters: Record<string, any>;
    sort: { column: string; direction: 'asc' | 'desc' };
}

type ActionButton = {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    confirm?: boolean;
};
export default function Index({ users,pagination, filters, sort }: Props) {
    const actions: ActionButton[] = [
        {
            label: "Edit",
            icon: Pencil,
            onClick: () => alert("Edit clicked!"),
        },
        {
            label: "Lihat",
            icon: Eye,
            onClick: () => alert("View clicked!"),
        },
        {
            label: "Hapus",
            icon: Trash,
            confirm: true,
            variant: "destructive",
            onClick: () => alert("Data dihapus!"),
        },
    ];

    const columns: Column[] = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            pinnable: true,
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            filterable: true,
            filterType: 'text',
            pinnable: true,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            filterable: true,
            filterType: 'text',
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            filterable: true,
            filterType: 'date',
            render: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'id as actions',
            label: 'Action',
            sortable: false,
            filterable: false,
            render: (value: string) => {
                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <AppLayout>
            <>
                <Card className='shadow-lg'>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={users}
                            pagination={pagination}
                            filters={filters}
                            sort={sort}
                        />
                    </CardContent>
                </Card>
            </>
        </AppLayout>
    );
}