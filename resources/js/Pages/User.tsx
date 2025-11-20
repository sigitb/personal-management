
// import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Eye, Pencil, Plus, SquarePen, Trash, Trash2 } from 'lucide-react';
import ActionButtons from '@/components/action-button';
import AppLayout from '@/Layouts/AppLayout';
import { DataTable } from '@/components/Datatable';
import { ActionButton, Column, ConfigFilter, PaginationData } from '@/types/datatable';
import { Link, router } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbDataItem } from '@/types/breadcrumb';

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
  permission: [],
  breadcrumbs: BreadcrumbDataItem[],
  url_create: string,
  sort: { column: string; direction: 'asc' | 'desc' };
}


export default function Index({ users, pagination, filters, sort, permission, url_create, breadcrumbs }: Props) {
  const actions: ActionButton[] = [
    {
      label: "Edit",
      icon: SquarePen,
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
      icon: Trash2,
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
    // {
    //   key: "email",
    //   label: "Email",
    //   placeholder: "Email.....",
    //   filterType: "text"
    // },
    // {
    //   key: "name",
    //   label: "Name",
    //   placeholder: "Name.....",
    //   filterType: "text"
    // },
    // {
    //   key: "date",
    //   label: "Tanggal",
    //   placeholder: "date.....",
    //   filterType: "date"
    // },
    // {
    //   key: "date-range",
    //   label: "Tanggal range",
    //   placeholder: "date.....",
    //   filterType: "date-range"
    // },
    // {
    //   key: "status",
    //   label: "Status",
    //   placeholder: "Pilih Status.....",
    //   filterType: "multiple-select",
    //   filterOptions: [
    //     { label: "test", value: "test" },
    //     { label: "test1", value: "test1" },
    //     { label: "test2", value: "test2" }
    //   ]
    // },
    // {
    //   key: "status-te",
    //   label: "Status te",
    //   placeholder: "Pilih Status.....",
    //   filterType: "select",
    //   filterOptions: [
    //     { label: "test", value: "test" },
    //     { label: "test1", value: "test1" },
    //     { label: "test2", value: "test2" }
    //   ]
    // },
    // {
    //   key: "status-re",
    //   label: "Status re",
    //   placeholder: "Pilih Status.....",
    //   filterType: "select-search",
    //   filterOptions: [
    //     { label: "test", value: "test" },
    //     { label: "test1", value: "test1" },
    //     { label: "test2", value: "test2" }
    //   ]
    // },
  ]

  return (
    <AppLayout>
      <>
        <Card className='mb-2 py-2'>
          <CardContent className='px-3 py-1'>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="">
                <p className='text-2xl font-semibold mb-2'>User</p>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button variant={'default'} className='rounded-[7px]' size={"sm"}>
                  <Link href={url_create} className='flex gap-2'> <Plus className='h-4 w-4' /> Tambah Data </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataTable
          columns={columns}
          data={users}
          pagination={pagination}
          filters={filters}
          sort={sort}
          // withImport={true}
          // withExport={[
          //   {title:"test", href:"test"}
          // ]}
          // configFilter={configFilters}
        />
      </>
    </AppLayout>
  );
}