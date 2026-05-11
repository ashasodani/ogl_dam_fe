'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'

import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Checkbox from '@mui/material/Checkbox'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import { editCandidateManage } from '@store/slices/candidateSlice'
import type { AppDispatch } from '@/store'

type EditUserInfoData = {
  firstName?: string
  lastName?: string
  userName?: string
  billingEmail?: string
  status?: string
  taxId?: string
  contact?: string
  level?: string
  language?: string[]
  country?: string
  useAsBillingAddress?: boolean
}

type FormValues = {
  firstName: string
  lastName: string
  email: string
  level: string
  status: string
}

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: EditUserInfoData
  id?: string
  onSave?: (data: any) => void
}

const initialData: EditUserInfoProps['data'] = {
  firstName: 'Oliver',
  lastName: 'Queen',
  userName: 'oliverQueen',
  billingEmail: 'oliverQueen@gmail.com',
  status: 'status',
  taxId: 'Tax-8894',
  contact: '+ 1 609 933 4422',
  level: 'basic',
  language: ['english'],
  country: 'US',
  useAsBillingAddress: true
}

const levels = ['Easy', 'Medium', 'Hard']

const status = ['Status', 'Active', 'Inactive', 'Suspended']

const EditUserInfo = ({ open, setOpen, data, id, onSave }: EditUserInfoProps) => {
  // States
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      email: data?.billingEmail || '',
      level: data?.level || '',
      status: data?.status || ''
    }
  })

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.billingEmail || '',
        level: data.level || '',
        status: data.status || ''
      })
    }
  }, [data, reset])

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      const updateData = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        level: values.level,
        status: values.status
      }
      const form_data = new FormData()

      // Loop over post object
      for (const key in updateData) {
        const value = updateData[key]

        if (value instanceof File) {
          // ✅ Append files directly
          form_data.append(key, value)
        } else if (Array.isArray(value)) {
          // ✅ Handle arrays (like technology_ids)
          value.forEach(v => form_data.append(`${key}[]`, v))
        } else if (value !== undefined && value !== null) {
          // ✅ Append normal values
          form_data.append(key, value.toString())
        }
      }

      const response: any = await dispatch(editCandidateManage(form_data))

      if (response?.payload?.success) {
        toast.success(response?.payload?.message || 'Candidate updated successfully')
        onSave?.(values)
        handleClose()
      } else {
        toast.error(response?.payload?.message || 'Failed to update candidate')
      }
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Edit User Information</div>
        <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pbe-6 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    placeholder='johnDoe@email.com'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='level'
                control={control}
                rules={{ required: 'Level is required' }}
                render={({ field }) => (
                  <FormControl error={!!errors.level}>
                    <Typography>Level</Typography>
                    <RadioGroup row {...field}>
                      {levels.map(level => (
                        <FormControlLabel key={level} value={level.toLowerCase()} control={<Radio />} label={level} />
                      ))}
                    </RadioGroup>
                    {errors.level && (
                      <Typography color='error' variant='caption'>
                        {errors.level.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='status'
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label='Status'>
                      {status.map((statusItem, index) => (
                        <MenuItem key={index} value={statusItem.toLowerCase().replace(/\s+/g, '-')}>
                          {statusItem}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.status && (
                      <Typography color='error' variant='caption'>
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Submit'}
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserInfo
