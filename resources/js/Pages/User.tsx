
// import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Trash } from 'lucide-react';
import ActionButtons from '@/components/action-button';
import AppLayout from '@/Layouts/AppLayout';
import { DataTable } from '@/components/Datatable';
import { ActionButton, Column, ConfigFilter, PaginationData } from '@/types/datatable';
import { router } from "@inertiajs/react";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}


interface Props {
  users: User[];
  pagination: PaginationData;
  filters: Record<string, any>;
  sort: { column: string; direction: 'asc' | 'desc' };
}


export default function Index({ users, pagination, filters, sort }: Props) {
  const actions: ActionButton[] = [
    {
      label: "Edit",
      icon: Pencil,
      textColor: "text-green-400",
      onClick: (id) => router.get(`/users/${id}/edit`),
    },
    {
      label: "Lihat",
      icon: Eye,
      textColor: "text-cyan-400",
      onClick: (id) => router.get(`/users/${id}`),
    },
    {
      label: "Hapus",
      icon: Trash,
      textColor: "text-red-400",
      confirm: true,
      onClick: (id) => router.delete(`/users/${id}`),
      // confirmWithForm: true,
      // inputs: [
      //   {
      //     name: "status",
      //     label: "Status Baru",
      //     type: "select",
      //     options: [
      //       { label: "Menunggu", value: "pending" },
      //       { label: "Diproses", value: "processing" },
      //       { label: "Selesai", value: "done" },
      //     ],
      //   },
      //   {
      //     name: "note",
      //     label: "Catatan",
      //     type: "textarea",
      //     placeholder: "Masukkan catatan...",
      //   },
      // ]
    },
  ];

  const columns: Column[] = [
    {
      key: 'no',
      label: 'No',
      sortable: false,
      pinnable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      pinnable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'id',
      label: 'Action',
      sortable: false,
      render: (_, row) => <ActionButtons id={row.id} actions={actions} />,
    },
  ];

  const configFilters: ConfigFilter[] = [
    {
      key: "email",
      label: "Email",
      placeholder: "Email.....",
      filterType: "text"
    },
    {
      key: "name",
      label: "Name",
      placeholder: "Name.....",
      filterType: "text"
    },
    {
      key: "date",
      label: "Tanggal",
      placeholder: "date.....",
      filterType: "date"
    },
    {
      key: "date-range",
      label: "Tanggal range",
      placeholder: "date.....",
      filterType: "date-range"
    },
    {
      key: "status",
      label: "Status",
      placeholder: "Pilih Status.....",
      filterType: "multiple-select",
      filterOptions: [
        { label: "test", value: "test" },
        { label: "test1", value: "test1" },
        { label: "test2", value: "test2" }
      ]
    },
    {
      key: "status-te",
      label: "Status te",
      placeholder: "Pilih Status.....",
      filterType: "select",
      filterOptions: [
        { label: "test", value: "test" },
        { label: "test1", value: "test1" },
        { label: "test2", value: "test2" }
      ]
    },
    {
      key: "status-re",
      label: "Status re",
      placeholder: "Pilih Status.....",
      filterType: "select-search",
      filterOptions: [
        { label: "test", value: "test" },
        { label: "test1", value: "test1" },
        { label: "test2", value: "test2" }
      ]
    },
  ]

  return (
    <AppLayout>
      <>
        <DataTable
          columns={columns}
          data={users}
          pagination={pagination}
          filters={filters}
          sort={sort}
          configFilter={configFilters}
        />
      </>
    </AppLayout>
  );
}