'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography
} from '@mui/material'
import { Close, Add, Delete } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { createCountry, editCountry, fetchCountry } from '@/store/slices/countrySlice'
import type { AppDispatch } from '@/store'

interface CountryModalProps {
  open: boolean
  handleClose: () => void
  data?: any // For edit mode
}

const CountryModal = ({ open, handleClose, data }: CountryModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [countryNames, setCountryNames] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)

  const isEdit = !!data

  useEffect(() => {
    if (data) {
      setCountryNames([data.country_name])
    } else {
      setCountryNames([''])
    }
  }, [data, open])

  const handleAddInput = () => {
    setCountryNames([...countryNames, ''])
  }

  const handleRemoveInput = (index: number) => {
    const newNames = countryNames.filter((_, i) => i !== index)
    setCountryNames(newNames.length ? newNames : [''])
  }

  const handleInputChange = (index: number, value: string) => {
    const newNames = [...countryNames]
    newNames[index] = value
    setCountryNames(newNames)
  }

  const handleSubmit = async () => {
    const validNames = countryNames.filter(name => name.trim() !== '')

    if (validNames.length === 0) {
      toast.error('Please enter at least one country name')
      return
    }

    setLoading(true)

    try {
      if (isEdit) {
        const result = await dispatch(
          editCountry({
            id: data.id,
            country_name: validNames[0]
          })
        ).unwrap()

        if (result.status) {
          toast.success('Country updated successfully')
          handleClose()
          dispatch(fetchCountry({}))
        } else {
          toast.error(result.message || 'Failed to update country')
        }
      } else {
        const result = await dispatch(
          createCountry({
            country_name: validNames
          })
        ).unwrap()

        if (result.status) {
          toast.success('Countries created successfully')
          handleClose()
          dispatch(fetchCountry({}))
        } else {
          toast.error(result.message || 'Failed to create countries')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>{isEdit ? 'Edit Country' : 'Add Countries'}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display='flex' flexDirection='column' gap={4} py={2}>
          {countryNames.map((name, index) => (
            <Box key={index} display='flex' gap={2} alignItems='center'>
              <TextField
                fullWidth
                label='Country Name'
                placeholder='Enter country name'
                value={name}
                onChange={e => handleInputChange(index, e.target.value)}
                variant='outlined'
                size='small'
              />
              {!isEdit && (
                <IconButton color='error' onClick={() => handleRemoveInput(index)} disabled={countryNames.length === 1}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          {!isEdit && (
            <Button startIcon={<Add />} onClick={handleAddInput} variant='outlined' color='primary' sx={{ alignSelf: 'start' }}>
              Add More
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary' disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CountryModal
