'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
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

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@store'

// Type Imports

import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@config/i18n'

// Component Imports
// import TableFilters from './TableFilters'

// import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@shared/utils/getInitials'
import { getLocalizedUrl } from '@shared/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import {
  getTestAssessManage,
  getTestAssessManageList,
  getTestAssessManageLoader,
  deleteTestAssessManage
} from '@store/slices/testAssesSlice'

import { toast } from 'react-toastify'

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

type UserRoleType = {
  [key: string]: { icon: string; color: string }
}

type UserStatusType = {
  [key: string]: ThemeColor
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
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
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'ri-vip-crown-line', color: 'error' },
  author: { icon: 'ri-computer-line', color: 'warning' },
  editor: { icon: 'ri-edit-box-line', color: 'info' },
  maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
  subscriber: { icon: 'ri-user-3-line', color: 'primary' }
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const TestListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  // States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [testAssessList, setTestAssessList] = useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const testAssess = useSelector(getTestAssessManageList)
  const testAssessLoader = useSelector(getTestAssessManageLoader)
  const router = useRouter()

  const handleEdit = (id: number) => {
    router.push('/apps/test/create/' + id)
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = { sort_by: 'created_at', sort_order: 'desc', page, per_page: perPage }

    await dispatch(getTestAssessManage(params))

    // setLoading(false);
  }

  useEffect(() => {
    setFilteredData(testAssess.data)
  }, [testAssess])
  console.log('filteredData', filteredData)
  console.log('testAssess', testAssess)

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('srno', {
        header: 'SR No',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('test_name', {
        header: 'test Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
              <Typography variant='body2'>{row.original.test_name}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('level', {
        header: 'Level',
        cell: ({ row }) => <Typography>{row.original.level.charAt(0).toUpperCase() + row.original.level.slice(1)}</Typography>
      }),
      columnHelper.accessor('technology', {
        header: 'Technology',
        cell: ({ row }) => <Typography>{row.original.technology.name}</Typography>
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: ({ row }) => <Typography>{row.original.duration}</Typography>
      }),

      // columnHelper.accessor('role', {
      //   header: 'Role',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       <Icon
      //         className={classnames('text-[22px]', userRoleObj[row.original.role].icon)}
      //         sx={{ color: `var(--mui-palette-${userRoleObj[row.original.role].color}-main)` }}
      //       />
      //       <Typography className='capitalize' color='text.primary'>
      //         {row.original.role}
      //       </Typography>
      //     </div>
      //   )
      // }),
      // columnHelper.accessor('currentPlan', {
      //   header: 'Plan',
      //   cell: ({ row }) => (
      //     <Typography className='capitalize' color='text.primary'>
      //       {row.original.currentPlan}
      //     </Typography>
      //   )
      // }),
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         variant='tonal'
      //         label={row.original.status}
      //         size='small'
      //         color={userStatusObj[row.original.status]}
      //         className='capitalize'
      //       />
      //     </div>
      //   )
      // }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => handleDeleteClick(row.original.id)}>
              <i className='ri-delete-bin-7-line text-red-500' />
            </IconButton>
            <IconButton size='small' onClick={() => handleEdit(row.original.id)}>
              <Link href={getLocalizedUrl('/apps/candidate/create', locale as Locale)} className='flex'>
                <i className='ri-edit-line text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    manualPagination: true, // 🔥 IMPORTANT
    pageCount: testAssess?.meta?.last_page || -1,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: testAssess?.meta?.current_page - 1 || 0,
        pageSize: testAssess?.meta?.per_page || 10
      }
    },
    onPaginationChange: updater => {
      // react-table gives us either a function or value
      const newPagination = typeof updater === 'function' ? updater(table.getState().pagination) : updater

      fetchData(newPagination.pageIndex + 1, newPagination.pageSize)
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = (params: Pick<UsersType, 'name'>) => {
    const { name } = params

    // if (avatar) {return <CustomAvatar src={avatar} skin='light' size={34} />} else {
    return (
      <CustomAvatar skin='light' size={34}>
        {getInitials(name as string)}
      </CustomAvatar>
    )
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        const res = await dispatch(deleteTestAssessManage(selectedId) as any)

        // if (labelsList.data.length === 1 && page > 1) {
        //   setPage(1);
        // }
        if (res.payload?.status_code === 200) {
          toast.success(res.payload?.message ?? 'Code Assessment Deleted Successfully')
        } //else if (res.error) {toast.error(res.error?.message ?? "Network response was not ok");
     
        if(res.error){
           toast.error(res.error?.message ?? "Network response was not ok");
        }
      } finally {
        setOpenDeleteDialog(false)
        setSelectedId(null)
      }
      console.log('Deleting user with ID:', selectedId)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  const handleCreateNew = () => {
    // dispatch(clearSelectedRole()); // Clear any previously selected role
    router.push('/apps/test/create')
  }

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        {/* <TableFilters setData={setFilteredData} tableData={data} /> */}
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          {/* <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export
          </Button> */}
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search'
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={handleCreateNew} className='max-sm:is-full'>
              Add New
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
                  .rows.slice(0, table.getState().pagination.pageSize)
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
          count={testAssess?.meta?.total || 0}
          rowsPerPage={testAssess?.meta?.per_page || 10}
          page={(testAssess?.meta?.current_page || 1) - 1}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' }
          }}
          onRowsPerPageChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        />
      </Card>
      {/* <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      /> */}
    </>
  )
}

export default TestListTable

const abc = {
  _features: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  options: {
    filterFromLeafRows: false,
    maxLeafRowFilterDepth: 100,
    groupedColumnMode: 'reorder',
    paginateExpandedRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSubRowSelection: true,
    columnResizeMode: 'onEnd',
    columnResizeDirection: 'ltr',
    state: {
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: []
      },
      rowSelection: {},
      rowPinning: { top: [], bottom: [] },
      expanded: {},
      grouping: [],
      sorting: [],
      globalFilter: '',
      columnFilters: [],
      columnPinning: { left: [], right: [] },
      columnOrder: [],
      columnVisibility: {},
      pagination: { pageIndex: 0, pageSize: 10 }
    },
    renderFallbackValue: null,
    data: [
      { id: 17, name: 'zzz', email: 'nop@degeest.com' },
      { id: 18, name: 'zzaaa', email: 'cv@degeest.com' },
      { id: 15, name: 'wwww', email: 'wwww@degeest.com' },
      { id: 14, name: 'wwww', email: 'wwww@degeest.com' },
      { id: 13, name: 'wwww', email: 'wwww@degeest.com' },
      { id: 1, name: 'vihanazz', email: 'vihana@gmail.com' },
      { id: 29, name: 'tttt', email: 'superadmin@degeest.com' },
      { id: 12, name: 'qqqssss', email: 'bsssivan@degeest.com' },
      { id: 16, name: 'qqqq', email: 'qqqq@degeest.com' },
      { id: 7, name: 'qqq', email: 'superadmin@degeest.com' }
    ],
    columns: [
      { id: 'select' },
      { header: 'User', accessorKey: 'fullName' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Plan', accessorKey: 'currentPlan' },
      { header: 'Status', accessorKey: 'status' },
      { header: 'Action', enableSorting: false, accessorKey: 'action' }
    ],
    filterFns: {},
    initialState: { pagination: { pageSize: 10 } }
  },
  initialState: {
    columnSizing: {},
    columnSizingInfo: {
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      columnSizingStart: []
    },
    rowSelection: {},
    rowPinning: { top: [], bottom: [] },
    expanded: {},
    grouping: [],
    sorting: [],
    columnFilters: [],
    columnPinning: { left: [], right: [] },
    columnOrder: [],
    columnVisibility: {},
    pagination: { pageIndex: 0, pageSize: 10 }
  }
}
