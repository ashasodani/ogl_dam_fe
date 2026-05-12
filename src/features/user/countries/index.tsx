'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Box,
  TablePagination
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCountry,
  deleteCountry,
  getCountryList,
  getCountryLoader,
  getCountryTotal
} from '@/store/slices/countrySlice'
import type { AppDispatch } from '@/store'
import CountryModal from './CountryModal'
import { toast } from 'react-toastify'

const Countries = () => {
  const dispatch = useDispatch<AppDispatch>()
  const countries = useSelector(getCountryList)
  const total = useSelector(getCountryTotal)
  const loading = useSelector(getCountryLoader)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<any>(null)

  // Pagination states
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    dispatch(
      fetchCountry({
        page: page + 1,
        limit: rowsPerPage
      })
    )
  }, [dispatch, page, rowsPerPage])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenAdd = () => {
    setSelectedCountry(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (country: any) => {
    setSelectedCountry(country)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        const result = await dispatch(deleteCountry(id)).unwrap()
        if (result.status) {
          toast.success('Country deleted successfully')
          dispatch(fetchCountry({ page: page + 1, limit: rowsPerPage }))
        } else {
          toast.error(result.message || 'Failed to delete country')
        }
      } catch (error: any) {
        toast.error(error.message || 'An error occurred')
      }
    }
  }

  return (
    <Box display='flex' flexDirection='column' gap={6}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4'>Countries</Typography>
        <Button variant='contained' startIcon={<Add />} onClick={handleOpenAdd}>
          Add Country
        </Button>
      </Box>

      <Card>
        <CardHeader title='Country List' />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Country Name</TableCell>
                <TableCell>Sheet Name</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : countries?.length > 0 ? (
                countries.map((country: any, index: number) => (
                  <TableRow key={country.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{country.country_name}</TableCell>
                    <TableCell>{country.sheet_name}</TableCell>
                    <TableCell align='right'>
                      <IconButton color='primary' onClick={() => handleOpenEdit(country)}>
                        <Edit />
                      </IconButton>
                      <IconButton color='error' onClick={() => handleDelete(country.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    No countries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <CountryModal
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false)
          setSelectedCountry(null)
        }}
        data={selectedCountry}
      />
    </Box>
  )
}

export default Countries
