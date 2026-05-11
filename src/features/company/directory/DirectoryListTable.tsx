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
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports

import { rankItem } from '@tanstack/match-sorter-utils'

import type { FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

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

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@store'

// Type Imports

import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'

// import AddUserDrawer from './AddUserDrawer'

import CustomAvatar from '@core/components/mui/Avatar'
import LoadingScreen from '@shared/components/LoadingScreen'

// Util Imports
import { getInitials } from '@shared/utils/getInitials'



// Style Imports

import { getCompanyManage, getCompanyManageList, getCompanyManageLoader } from '@store/slices/companySlice'

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

const DirectoryListTable = () => {
  // States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [orderBy, setOrderBy] = useState('country-city')

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [companyManageList, setCompany] = useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const companyManage = useSelector(getCompanyManageList)
  const companyLoader = useSelector(getCompanyManageLoader)
  const router = useRouter()

  const handleView = (id: number) => {
    router.push('/apps/candidate/view/' + id)
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = { sort_by: 'name', sort_order: 'desc', order_by: orderBy }

    await dispatch(getCompanyManage(params))

    // setLoading(false);
  }

  useEffect(() => {
    const dataArray = Array.isArray(companyManage.data) ? companyManage.data : companyManage.data || []
    if (orderBy === 'company-name') {
      const formatted = Object.keys(dataArray).map(letter => ({
        country_name: letter,
        companies: dataArray[letter]?.companies || []
      }))

      setFilteredData(formatted)
    }
     else {
      setData(dataArray)
      setFilteredData(dataArray)
    }

    if (companyManage?.data) {
    }
  }, [companyManage])

  console.log('filteredData', filteredData)
  console.log('candidateManage', companyManage.data)

  // Hooks
  const { lang: locale } = useParams()

  const getAvatar = (params: Pick<UsersType, 'name'>) => {
    const { name } = params

    // if (avatar) {return <CustomAvatar src={avatar} skin='light' size={34} />} else {
    return (
      <CustomAvatar skin='light' size={34}>
        {getInitials(name as string)}
      </CustomAvatar>
    )
  }

   const table = useReactTable({
      data: filteredData,
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

    
  

  /**
   * Sets the selectedId to id and opens the delete dialog.
   * @param {number} id - The id of the candidate to delete.
   */

  // if (companyLoader) {
  //   return <LoadingScreen message='Loading candidates...' />
  // }

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' sx={{ textAlign: 'center' }} />
        <TableFilters
          setData={setFilteredData}
         
          tableData={Array.isArray(companyManage?.data) ? companyManage.data : companyManage?.data?.data || []}
          
onFilterSubmit={async filters => {
  setOrderBy(filters.order_by)
  await dispatch(getCompanyManage(filters))
}}                      
        />
        <Divider />
        {/* Removed unused search section */}
        <List sx={{ width: '100%', bgcolor: 'background.paper', minHeight: '200px' }}>
          {companyLoader ? (
            <div style={{ height: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingScreen message='Loading companies...' />
            </div>
          ) : filteredData?.length === 0 ? (
            <ListItem>
              <ListItemText primary='No data available' sx={{ textAlign: 'center' }} />
            </ListItem>
          ) : (
            filteredData.map((countryItem, countryIndex) => (
              <li key={countryIndex} style={{ listStyle: 'none', padding: '0 24px' }}>
                {/* Country Header */}
                <ListItemText
                  primary={countryItem.country_name}
                  primaryTypographyProps={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    sx: { mt: 4, mb: 2, color: 'primary.main' }
                  }}
                />

                {/* Company List */}
                <List sx={{ width: '100%', pl: 4 }}>
                  {countryItem?.companies?.length ? (
                    countryItem.companies.map((company, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <div className='flex items-center gap-3 w-full'>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#000', flexShrink: 0 }} />
                          <ListItemText
                            primary={`${company.port_name} - ${company.company_name}`}
                            primaryTypographyProps={{
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              color: 'primary.main',
                              sx: {
                                '&:hover': {
                                  color: 'primary.dark',
                                  cursor: 'pointer'
                                }
                              }
                            }}
                          />
                        </div>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText
                        primary='No companies available'
                        primaryTypographyProps={{ color: 'text.disabled', fontSize: '0.85rem' }}
                      />
                    </ListItem>
                  )}
                </List>
              </li>
            ))
          )}
        </List>{' '}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={companyManage?.meta?.total || 0}
          rowsPerPage={companyManage?.meta?.per_page || 10}
          page={(companyManage?.meta?.current_page || 1) - 1}
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
    </>
  )
}

export default DirectoryListTable
