import ActionButtons from "@/components/action-button";
import { ActionCreate } from "@/components/action-create";
import { DataTable } from "@/components/Datatable";
import { DatePicker } from "@/components/datepicker";
import Modal from "@/components/modal";
import { PageHeader } from "@/components/page-header";
import { NormalSelect, SingleSelectSearch } from "@/components/select-all";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/Layouts/AppLayout";
import { ActionCreateItem } from "@/types";
import { BreadcrumbDataItem } from "@/types/breadcrumb";
import { ActionButton, Column, ConfigFilter, PaginationData } from "@/types/datatable";
import { Option } from "@/types/select";
import { router } from "@inertiajs/react";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

interface TransactionProject {
    id?: string;
    notes?:string;
    project_id: string;
    type: string;
    amount: number;
    project_payment_date: Date | null;
    project: Project;
}

interface Project {
    id?: string;
    name: string;
}

type FormTransactionProject = {
    id?: string;
    notes?:string;
    project_id: string;
    type: string;
    amount: number;
    project_payment_date: Date | null;
}

interface Props {
    projects: Project[],
    data: TransactionProject[];
    pagination: PaginationData;
    filters: Record<string, any>;
    breadcrumbs: BreadcrumbDataItem[],
    sort: { column: string; direction: 'asc' | 'desc' };
}

export default function TransactionProject({ data, pagination, filters, breadcrumbs, sort, projects }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedData, setSelectedData] = useState<TransactionProject | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormTransactionProject>({
        project_id: '',
        amount: 0,
        type: '',
        project_payment_date: null
    });
    const resetForm = () => {
        setFormData({
            project_id: '',
            amount: 0,
            type: '',
            project_payment_date: new Date()
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
            project_id:selectedData?.project_id ?? '',
            amount: selectedData?.amount ?? 0,
            type: selectedData?.type ?? '',
            project_payment_date: selectedData?.project_payment_date ?? new Date(),
            notes:selectedData?.notes ?? '',
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
                ? "/admin-panel/transaction/project"
                : `/admin-panel/transaction/project/${formData.id}`;

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
            label: "Hapus",
            icon: Trash2,
            textColor: "text-red-400",
            confirm: true,
            onClick: (id) => router.delete(`/admin-panel/transaction/project/${id}`),
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
            key: 'notes',
            label: 'Notes',
            sortable: false,
            pinnable: false,
            render: (_, row) => row.notes ?? '-'
        },
        {
            key: 'type',
            label: 'Type',
            sortable: false,
            pinnable: false,
            render: (_, row) => row.type_desc
        },
        {
            key: 'project_id',
            label: 'Project',
            sortable: false,
            pinnable: false,
            render: (_, row) => row.project?.name
        },
        {
            key: 'amount_formatted',
            label: 'Amount',
            sortable: true,
            pinnable: false,
        },
        {
            key: 'project_payment_date',
            label: 'Transaction Date',
            sortable: true,
            pinnable: false,
            render: (_, row) => new Date(row.project_payment_date).toLocaleDateString()
        },
        {
            key: 'id',
            label: 'Action',
            sortable: false,
            render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
        },
    ];

    const buttonCreateitem: ActionCreateItem[] = [{
        label: 'Add Finance Project',
        href: '/admin-panel/transaction/project/create',
        type: 'modal',
        onClick: handleOpenCreate
    }]

    const configFilters: ConfigFilter[] = [
        {
            key: "type",
            label: "Type",
            placeholder: "Pilih Type.....",
            filterType: "select",
            filterOptions: [
                {label: 'Payment', value: '00'},
                {label: 'Additional', value: '01'}
            ],
        },
        {
            key: "project_id",
            label: "Project",
            placeholder: "Pilih Project.....",
            filterType: "select-search",
            filterOptions: projects.map((item) => ({ value: item.id, label: item.name })) as Option[],
        },
        {
            key: "transaction_date",
            label: "Transaction Date",
            placeholder: "Transaction Date.....",
            filterType: "date-range",
        }

    ]

    return (
        <AppLayout>
            <PageHeader title='Finance Project' description='List Finance Project' breadcrumbs={breadcrumbs} />
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
                title={modalMode === 'create' ? 'Add Finance Project' : 'Edit Finance Project'}
                isLoading={isLoading}
                description={
                    modalMode === 'create'
                        ? 'Fill out the form below to add new data.'
                        : 'Change the data information you want to update.'
                }
                submitLabel={modalMode === 'create' ? 'Save' : 'Update'}
            >
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="amount">
                        Notes
                    </Label>
                    <Input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Notes..."
                        className="rounded-[7px]"
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="type">
                        Project <span className="text-red-500">*</span>
                    </Label>
                    <SingleSelectSearch
                        options={projects.map((item) => ({ value: item.id, label: item.name })) as Option[]}
                        onChange={(value) => setFormData({ ...formData, project_id: value })}
                        placeholder="Pilih Project..."
                        value={formData.project_id}
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="category">
                        Type <span className="text-red-500">*</span>
                    </Label>
                    <NormalSelect
                        options={[
                            {label: 'Payment', value: '00'},
                            {label: 'Additional', value: '01'}
                        ]}
                        onChange={(value) => setFormData({ ...formData, type: value })}
                        placeholder="Pilih Type..."
                        value={formData.type}
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="amount">
                        Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        value={Number(formData.amount)}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0, })}
                        placeholder="Amount..."
                        className="rounded-[7px]"
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="finance_transaction_date">
                        Transaction Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker key={'project_payment_date'} placeholder={`pilih tanggal....`} value={formData.project_payment_date ? new Date(formData.project_payment_date) : new Date()} onChange={(value) => setFormData({ ...formData, project_payment_date: value ? new Date(value) : new Date() })} />
                </div>
            </Modal>
        </AppLayout>
    );

}