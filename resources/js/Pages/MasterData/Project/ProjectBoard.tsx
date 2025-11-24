import ActionButtons from "@/components/action-button";
import { ActionCreate } from "@/components/action-create";
import { DataTable } from "@/components/Datatable";
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

interface ProjectBoard {
    id?: string;
    project_id: string;
    name: string;
    project?: Project;
}

interface Project {
    id?: string;
    name: string;
}

type ProjectBoardForm = {
    id?: string;
    project_id: string;
    name: string;
};


interface Props {
    data: ProjectBoard[];
    projects: Project[];
    pagination: PaginationData;
    filters: Record<string, any>;
    breadcrumbs: BreadcrumbDataItem[],
    sort: { column: string; direction: 'asc' | 'desc' };
}

export default function ProjectBoard({ data, pagination, filters, breadcrumbs, sort, projects }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
    const [selectedData, setSelectedData] = useState<ProjectBoard | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProjectBoardForm>({
        name: '',
        project_id: '',
    });
    const resetForm = () => {
        setFormData({
            name: '',
            project_id: '',
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
            project_id: dataSelected?.project_id ?? '',
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
                ? "/admin-panel/project/board"
                : `/admin-panel/project/board/${formData.id}`;

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
            onClick: (id) => router.delete(`/admin-panel/project/board/${id}`),
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
            key: 'project_id',
            label: 'Project',
            sortable: true,
            pinnable: false,
            render: (_, row) => row.project?.name,
        },
        {
            key: 'id',
            label: 'Action',
            sortable: false,
            render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
        },
    ];

    const buttonCreateitem: ActionCreateItem[] = [{
        label: 'Add Project Board',
        href: '/admin-panel/project/board/create',
        type: 'modal',
        onClick: handleOpenCreate
    }]

    const configFilters: ConfigFilter[] = [
            {
                key: "project_id",
                label: "Project",
                placeholder: "Pilih Project.....",
                filterType: "select-search",
                filterOptions: projects.map((item) => ({ value: item.id, label: item.name })) as Option[],
            }
        ]

    return (
        <AppLayout>
            <PageHeader title='Project Board' description='List Project Board' breadcrumbs={breadcrumbs} />
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
                title={modalMode === 'create' ? 'Add Project Board' : 'Edit Project Board'}
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
                <div className="grid gap-2 mt-2">
                    <Label htmlFor="name">
                        Project <span className="text-red-500">*</span>
                    </Label>
                    <SingleSelectSearch
                        options={projects.map((item) => ({ value: item.id, label: item.name })) as Option[]}
                        onChange={(value) => setFormData({ ...formData, project_id: value })}
                        placeholder="Project..."
                        value={formData.project_id}
                    />
                </div>
            </Modal>
        </AppLayout>
    );

}