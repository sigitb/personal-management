import ActionButtons from "@/components/action-button";
import { ActionCreate } from "@/components/action-create";
import { DataTable } from "@/components/Datatable";
import Modal from "@/components/modal";
import { PageHeader } from "@/components/page-header";
import { NormalSelect } from "@/components/select-all";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/Layouts/AppLayout";
import { ActionCreateItem } from "@/types";
import { BreadcrumbDataItem } from "@/types/breadcrumb";
import { ActionButton, Column, ConfigFilter, PaginationData } from "@/types/datatable";
import { router } from "@inertiajs/react";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

interface Project {
    id?: string;
    name: string;
    description: string;
    status: string;
    total_amount: number;
    created_at?: string;
}

interface Props {
    data: Project[];
    pagination: PaginationData;
    filters: Record<string, any>;
    breadcrumbs: BreadcrumbDataItem[],
    sort: { column: string; direction: 'asc' | 'desc' };
}

export default function FinanceType({ data, pagination, filters, breadcrumbs, sort }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedData, setSelectedData] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Project>({
        name: '',
        description: '',
        status: '',
        total_amount: 0,
    });
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: '',
            total_amount: 0,
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
            description: dataSelected?.description ?? '',
            status: dataSelected?.status ?? '',
            total_amount: dataSelected?.total_amount ? parseInt(dataSelected.total_amount.toString()) : 0
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
                ? "/admin-panel/project"
                : `/admin-panel/project/${formData.id}`;

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
            onClick: (id) => router.delete(`/admin-panel/project/${id}`),
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
            key: 'description',
            label: 'Description',
            sortable: false,
            pinnable: false,
        },
        {
            key: 'status_desc',
            label: 'Status',
            sortable: false,
            pinnable: false,
            render: (_, row) => <Badge className={
                row.status_desc === 'Closed' ? 'bg-red-400' : (row.status_desc === 'Running' ? 'bg-green-400' : 'bg-gray-400')
            }>{row.status_desc}</Badge>,
        },
        {
            key: 'total_amount_formatted',
            label: 'Total Amount',
            sortable: false,
            pinnable: false,
        },
         {
            key: 'created_at',
            label: 'Created At',
            sortable: false,
            pinnable: false,
            render: (_, row) => <span>{new Date(row.created_at).toLocaleDateString()}</span>,
        },
        {
            key: 'id',
            label: 'Action',
            sortable: false,
            render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
        },
    ];

    const buttonCreateitem: ActionCreateItem[] = [{
        label: 'Add Project',
        href: '/admin-panel/project/create',
        type: 'modal',
        onClick: handleOpenCreate
    }]
    const configFilters: ConfigFilter[] = [
        {
            key: "status",
            label: "Status",
            placeholder: "Pilih Status.....",
            filterType: "multiple-select",
            filterOptions: [
                { label: "Closed", value: "00" },
                { label: "Running", value: "01" },
                { label: "Mantenance", value: "02" }
            ]
        }
    ]

    return (
        <AppLayout>
            <PageHeader title='Project' description='List Project' breadcrumbs={breadcrumbs} />
            <ActionCreate items={buttonCreateitem} />
            <DataTable
                columns={columns}
                data={data}
                pagination={pagination}
                filters={filters}
                sort={sort}
                configFilter={configFilters}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                title={modalMode === 'create' ? 'Add Project' : 'Edit Project'}
                isLoading={isLoading}
                description={
                    modalMode === 'create'
                        ? 'Fill out the form below to add new data.'
                        : 'Change the data information you want to update.'
                }
                submitLabel={modalMode === 'create' ? 'Save' : 'Update'}
            >
                <div className="space-y-2">
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

                <div className="space-y-2 mt-2">
                    <Label htmlFor="name">
                        Status <span className="text-red-500">*</span>
                    </Label>
                    <NormalSelect
                        options={[
                            { label: "Closed", value: "00" },
                            { label: "Running", value: "01" },
                            { label: "Mantenance", value: "02" }
                        ]}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        placeholder="Pilih Status....."
                        value={formData.status}
                    />
                </div>
                <div className="space-y-2 mt-2">
                    <Label htmlFor="name">
                        Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Deskcription..."
                        className="rounded-[7px]"
                    />
                </div>
            </Modal>
        </AppLayout>
    );

}