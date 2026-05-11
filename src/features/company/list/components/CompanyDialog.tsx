'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Box,
  Avatar,
  FormHelperText,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'

import type { AppDispatch } from '@store'
import {
  createCompanyManage
} from '@store/slices/companySlice'

interface Country {
  id: number
  country_name: string
}

interface CompanyDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  countryList?: Country[] // Updated to use Country type
}

const CompanyDialog = ({ open, onClose, onSubmit, countryList = [] }: CompanyDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      country_id: [],
      import_file: null
    }
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleFormSubmit = async (data: any) => {
    debugger;
    try {
       
         const post = {
       
         country_id: data.countries.map((country: Country) => country.id),
       
        import_file: data.xcelfile // file
      }
      const form_data = new FormData()

      // Loop over post object
      for (const key in post) {
        const value = post[key]

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
      const response: any = await dispatch(createCompanyManage(form_data))
            if (response?.payload?.status) {
              toast.success(response?.payload?.message)
    
              reset()
               handleClose()
            } else if (!response?.status) {
              toast.error(response.error.message)
            }

     // await onSubmit(data)
     
    } catch (error) {
      toast.error('Failed to create company')
    } finally {
      setIsLoading(false)
    }
  }
  console.log("sss",countryList)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Add New Company</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name='countries'
            control={control}
            rules={{ required: 'Please select at least one country' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={countryList}
                getOptionLabel={(option: Country) => option?.country_name || ''} // Added type and null check
                isOptionEqualToValue={(option: Country, value: Country) => option?.id === value?.id} // Added types and null check
                onChange={(_, value) => field.onChange(value)}
                renderTags={(value: Country[], getTagProps) =>
                  value.map((option: Country, index) => (
                    <Chip
                      variant='outlined'
                      label={option.country_name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Country'
                    margin='normal'
                    error={!!errors.countries}
                    helperText={errors.countries?.message}
                  />
                )}
              />
            )}
          />
          
          <Controller
            name='xcelfile'
            control={control}
            rules={{ required: 'Please upload an image' }}
            render={({ field }) => (
              <Box display='flex' flexDirection='column' gap={2} mt={2}>
                <Button 
                  variant='outlined' 
                  component='label' 
                  fullWidth 
                  color={errors.image ? 'error' : 'primary'}
                >
                  Upload Master Sheet
                  <input
                    hidden
                    type='file'
                    onChange={e => field.onChange(e.target.files?.[0] || null)}
                  />
                </Button>

                {field.value && (
                  <Typography variant='body2' color='text.secondary'>
                    {field.value.name}
                  </Typography>
                )}

                {/* {field.value && (
                  <Box display='flex' justifyContent='center'>
                    <Avatar
                      src={URL.createObjectURL(field.value)}
                      alt='Company Logo Preview'
                      sx={{ width: 80, height: 80 }}
                    />
                  </Box>
                )} */}
                
                {errors.image && (
                  <FormHelperText error>{errors.image.message}</FormHelperText>
                )}
              </Box>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CompanyDialog
