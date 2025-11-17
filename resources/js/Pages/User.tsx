import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/datatable';
// import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, LucideIcon, Pencil, Trash } from 'lucide-react';
import ActionButtons from '@/components/action-button';
import AppLayout from '@/Layouts/AppLayout';
import { BreadcrumbItem } from '@/types/breadcrumb';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
}

interface PaginatedData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    users: PaginatedData;
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
export default function Index({ users, filters, sort }: Props) {
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
                        data={users.data}
                        pagination={{
                            current_page: users.current_page,
                            last_page: users.last_page,
                            per_page: users.per_page,
                            total: users.total,
                            from: users.from,
                            to: users.to,
                        }}
                        filters={filters}
                        sort={sort}
                    />
                </CardContent>
            </Card>
            </>
        </AppLayout>
    );
}