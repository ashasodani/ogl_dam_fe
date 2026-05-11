'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  Divider,
  Button,
  TextField,
  Typography,
  IconButton,
  TablePagination
} from '@mui/material'
import { styled } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@config/i18n'

import LoadingScreen from '@shared/components/LoadingScreen'
import { getLocalizedUrl } from '@shared/utils/i18n'
import tableStyles from '@core/styles/table.module.css'

import CompanyDialog from './components/CompanyDialog'
import DeleteDialog from './components/DeleteDialog'
import { useCompanyTable } from './hooks/useCompanyTable'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  const {
    openDeleteDialog,
    open,
    rowSelection,
    filteredData,
    globalFilter,
    companyManage,
    companyLoader,
    countryList,
    setRowSelection,
    setGlobalFilter,
    handleEdit,
    handleView,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClickOpen,
    handleClose,
    handleSubmit,
    fetchData
  } = useCompanyTable()

  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('srno', {
        header: 'SR No',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.index + 1}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('Company Name', {
        header: 'Question Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
           <div className='flex flex-col'>
            
              <Typography variant='body2'>
                {row.original.company_name?.length > 60 ? `${row.original.company_name.substring(0, 60)}...` : row.original.company_name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('port', {
        header: 'Technology',
        cell: ({ row }) => <Typography>{row.original.port_name}</Typography>
      }),
     
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDeleteClick(row.original.id)}>
              <i className='ri-delete-bin-7-line text-red-500' />
            </IconButton>
            <IconButton size='small' onClick={() => handleView(row.original.id)}>
              <Link href={getLocalizedUrl('/apps/candidate/view', locale as Locale)} className='flex'>
                <i className='ri-eye-line text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [filteredData, locale, handleDeleteClick, handleView]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    manualPagination: true,
    pageCount: companyManage?.meta?.last_page || -1,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: (companyManage?.meta?.current_page || 1) - 1,
        pageSize: companyManage?.meta?.per_page || 10
      }
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (companyLoader) {
    return <LoadingScreen message='Loading candidates...' />
  }

  return (
    <>
      <CompanyDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        countryList={countryList || []}
      />
      
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message='Are you sure you want to delete this company? This action cannot be undone.'
      />

      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={handleClickOpen} className='max-sm:is-full'>
              Add
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table?.getFilteredRowModel()?.rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={companyManage?.meta?.total || 0}
          rowsPerPage={companyManage?.meta?.per_page || 10}
          page={(companyManage?.meta?.current_page || 1) - 1}
          onPageChange={(_, page) => {
            fetchData(page + 1, companyManage?.meta?.per_page || 10, globalFilter)
          }}
          onRowsPerPageChange={(event) => {
            fetchData(1, parseInt(event.target.value, 10), globalFilter)
          }}
        />
      </Card>
    </>
  )
}

export default UserListTable