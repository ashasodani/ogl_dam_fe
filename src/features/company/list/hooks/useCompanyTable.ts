'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { AppDispatch } from '@store'
import {
  getCompanyManage,
  getCompanyManageList,
  getCompanyManageLoader,
  deleteCompanyManage,
  getCountryListManages,
  getCountryListManage,
  createCompanyManage
} from '@store/slices/companySlice'

export const useCompanyTable = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const companyManage = useSelector(getCompanyManageList)
  const companyLoader = useSelector(getCompanyManageLoader)
  const countryList = useSelector(getCountryListManages)
  console.log('countryList', countryList)
  const router = useRouter()

  const fetchData = async (page = 1, perPage = 10, search = globalFilter) => {
    const params = { sort_by: 'name', sort_order: 'desc', page, per_page: perPage }
    if (search) {
      params.search = search
    }
    await dispatch(getCompanyManage(params))
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  useEffect(() => {
    setFilteredData(companyManage?.data || [])
  }, [companyManage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(1, 10, globalFilter)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [globalFilter])

  const handleEdit = (id: number) => {
    router.push('/apps/candidate/create/' + id)
  }

  const handleView = (id: number) => {
    router.push('/apps/candidate/view/' + id)
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        const res = await dispatch(deleteCompanyManage(selectedId) as any)
        if (res.payload?.status_code === 200) {
          toast.success(res.payload?.message ?? 'Deleted Successfully')
        }
        if (res.error) {
          toast.error(res.error?.message ?? 'Network error')
        }
      } finally {
        setOpenDeleteDialog(false)
        setSelectedId(null)
      }
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  const handleClickOpen = () => {
     const params = { sort_by: 'name', sort_order: 'desc'}
    dispatch(getCountryListManage(params))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (data: any) => {
    debugger;
    try {
      const res = await dispatch(createCompanyManage(data) as any)
      if (res.payload?.status_code === 200) {
        toast.success(res.payload?.message ?? 'Company created successfully')
        setOpen(false)
        fetchData()
      }
      if (res.error) {
        toast.error(res.error?.message ?? 'Network error')
      }
    } catch (error) {
      toast.error('Failed to create company')
    }
  }

  return {
    openDeleteDialog,
    selectedId,
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
  }
}