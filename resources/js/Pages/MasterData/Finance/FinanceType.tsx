import ActionButtons from "@/components/action-button";
import { ActionCreate } from "@/components/action-create";
import { DataTable } from "@/components/Datatable";
import Modal from "@/components/modal";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/Layouts/AppLayout";
import { ActionCreateItem } from "@/types";
import { BreadcrumbDataItem } from "@/types/breadcrumb";
import { ActionButton, Column, PaginationData } from "@/types/datatable";
import { router } from "@inertiajs/react";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

interface FinanceType {
    id?: string;
    name: string;
}

interface Props {
    data: FinanceType[];
    pagination: PaginationData;
    filters: Record<string, any>;
    breadcrumbs: BreadcrumbDataItem[],
    sort: { column: string; direction: 'asc' | 'desc' };
}

export default function FinanceType({ data, pagination, filters, breadcrumbs, sort }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedData, setSelectedData] = useState<FinanceType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FinanceType>({
        name: '',
    });
    const resetForm = () => {
        setFormData({
            name: ''
        });
    };

    const handleOpenCreate = () => {
        setModalMode('create');        
        setSelectedData(null);
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenUpdate = (id: string) => {
        setModalMode('update');
        const dataSelected = data.find((item) => item.id === id);
        setSelectedData(dataSelected ?? null);
        setFormData({
            name: dataSelected?.name ?? '',
            id: dataSelected?.id ?? '',
        });
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = () => {
        setIsLoading(true);

        const url =
            modalMode === "create"
                ? "/admin-panel/finance/type"
                : `/admin-panel/finance/type/${formData.id}`;

        const method = modalMode === "create" ? "post" : "put";

        router[method](url, { ...formData }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                handleClose();
            },
            onFinish: () => {
                setIsLoading(false);
                handleClose();
            },
        });
    };

    const actions: ActionButton[] = [
        {
            label: "Edit",
            icon: SquarePen,
            textColor: "text-green-400",
            onClick: (id) => handleOpenUpdate(id as string),
        },
        {
            label: "Hapus",
            icon: Trash2,
            textColor: "text-red-400",
            confirm: true,
            onClick: (id) => router.delete(`/admin-panel/finance/type/${id}`),
        },
    ];

    const columns: Column[] = [
        {
            key: 'no',
            label: 'No',
            sortable: false,
            pinnable: false,
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            pinnable: false,
        },
        {
            key: 'id',
            label: 'Action',
            sortable: false,
            render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
        },
    ];

    const buttonCreateitem: ActionCreateItem[] = [{
        label: 'Add Finance Type',
        href: '/admin-panel/finance/type/create',
        type: 'modal',
        onClick: handleOpenCreate
    }]

    return (
        <AppLayout>
            <PageHeader title='User' description='List Data User' breadcrumbs={breadcrumbs} />
            <ActionCreate items={buttonCreateitem} />
            <DataTable
                columns={columns}
                data={data}
                pagination={pagination}
                filters={filters}
                sort={sort}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                title={modalMode === 'create' ? 'Add Finance Type' : 'Edit Finance Type'}
                isLoading={isLoading}
                description={
                    modalMode === 'create'
                        ? 'Fill out the form below to add new data.'
                        : 'Change the data information you want to update.'
                }
                submitLabel={modalMode === 'create' ? 'Save' : 'Update'}
            >
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name..."
                        className="rounded-[7px]"
                    />
                </div>
            </Modal>
        </AppLayout>
    );

}