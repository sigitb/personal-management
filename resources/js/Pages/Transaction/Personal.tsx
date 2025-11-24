import ActionButtons from "@/components/action-button";
import { ActionCreate } from "@/components/action-create";
import { DataTable } from "@/components/Datatable";
import { DatePicker } from "@/components/datepicker";
import Modal from "@/components/modal";
import { PageHeader } from "@/components/page-header";
import { SingleSelectSearch } from "@/components/select-all";
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

interface FinancePersonal {
    id?: string;
    notes: string;
    finance_type_id: string;
    finance_category_id: string;
    amount: number;
    finance_transaction_date: Date | null;
    finance_type: FinanceType;
    finance_category: FinanceCategory;
}

interface FinanceType {
    id?: string;
    name: string;
}

interface FinanceCategory {
    id?: string;
    name: string;
}

type FormFinancePersonal = {
    id?: string;
    notes: string;
    finance_type_id: string;
    finance_category_id: string;
    amount: number;
    finance_transaction_date: Date | null;
}

interface Props {
    financeType: FinanceType[],
    financeCategory: FinanceCategory[],
    data: FinancePersonal[];
    pagination: PaginationData;
    filters: Record<string, any>;
    breadcrumbs: BreadcrumbDataItem[],
    sort: { column: string; direction: 'asc' | 'desc' };
}

export default function FinancePersonal({ data, pagination, filters, breadcrumbs, sort, financeCategory, financeType }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedData, setSelectedData] = useState<FinancePersonal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormFinancePersonal>({
        notes: '',
        amount: 0,
        finance_category_id: '',
        finance_transaction_date: null,
        finance_type_id: '',
    });
    const resetForm = () => {
        setFormData({
            notes: '',
            amount: 0,
            finance_category_id: '',
            finance_transaction_date: new Date(),
            finance_type_id: '',
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
            notes: dataSelected?.notes ?? '',
            amount: dataSelected?.amount ?? 0,
            finance_category_id: dataSelected?.finance_category_id ?? '',
            finance_transaction_date: dataSelected?.finance_transaction_date ?? null,
            finance_type_id: dataSelected?.finance_type_id ?? '',
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
                ? "/admin-panel/transaction/personal"
                : `/admin-panel/transaction/personal/${formData.id}`;

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
            onClick: (id) => router.delete(`/admin-panel/transaction/personal/${id}`),
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
            label: 'Note',
            sortable: true,
            pinnable: false,
        },
        {
            key: 'finance_category_id',
            label: 'Category',
            sortable: false,
            pinnable: false,
            render: (_, row) => row.finance_category?.name
        },
        {
            key: 'finance_type_id',
            label: 'Type',
            sortable: false,
            pinnable: false,
            render: (_, row) => row.finance_type?.name
        },
        {
            key: 'amount_formatted',
            label: 'Amount',
            sortable: true,
            pinnable: false,
        },
        {
            key: 'finance_transaction_date',
            label: 'Transaction Date',
            sortable: true,
            pinnable: false,
            render: (_, row) => new Date(row.finance_transaction_date).toLocaleDateString()
        },
        {
            key: 'id',
            label: 'Action',
            sortable: false,
            render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
        },
    ];

    const buttonCreateitem: ActionCreateItem[] = [{
        label: 'Add Finance personal',
        href: '/admin-panel/transaction/personal/create',
        type: 'modal',
        onClick: handleOpenCreate
    }]

    const configFilters: ConfigFilter[] = [
        {
            key: "finance_type_id",
            label: "Type",
            placeholder: "Pilih Type.....",
            filterType: "multiple-select",
            filterOptions: financeType.map((item) => ({ value: item.id, label: item.name })) as Option[],
        },
        {
            key: "finance_category_id",
            label: "Category",
            placeholder: "Pilih Category.....",
            filterType: "multiple-select",
            filterOptions: financeCategory.map((item) => ({ value: item.id, label: item.name })) as Option[],
        }

    ]

    return (
        <AppLayout>
            <PageHeader title='Finance personal' description='List Finance personal' breadcrumbs={breadcrumbs} />
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
                title={modalMode === 'create' ? 'Add Finance personal' : 'Edit Finance personal'}
                isLoading={isLoading}
                description={
                    modalMode === 'create'
                        ? 'Fill out the form below to add new data.'
                        : 'Change the data information you want to update.'
                }
                submitLabel={modalMode === 'create' ? 'Save' : 'Update'}
            >
                <div className="grid gap-2">
                    <Label htmlFor="notes">
                        Notes <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Notes..."
                        className="rounded-[7px]"
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="type">
                        Type <span className="text-red-500">*</span>
                    </Label>
                    <SingleSelectSearch
                        options={financeType.map((item) => ({ value: item.id, label: item.name })) as Option[]}
                        onChange={(value) => setFormData({ ...formData, finance_type_id: value })}
                        placeholder="Pilih Type..."
                        value={formData.finance_type_id}
                    />
                </div>
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                    </Label>
                    <SingleSelectSearch
                        options={financeCategory.map((item) => ({ value: item.id, label: item.name })) as Option[]}
                        onChange={(value) => setFormData({ ...formData, finance_category_id: value })}
                        placeholder="Pilih Type..."
                        value={formData.finance_category_id}
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
                    <DatePicker key={'finance_transaction_date'} placeholder={`pilih tanggal....`} value={formData.finance_transaction_date ? new Date(formData.finance_transaction_date) : new Date()} onChange={(value) => setFormData({...formData, finance_transaction_date: value ?  new Date(value) : new Date()})} />
                </div>
            </Modal>
        </AppLayout>
    );

}