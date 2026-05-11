'use client'

import * as React from 'react'
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
import { FormControlLabel } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'

import { useDispatch, useSelector } from 'react-redux'

import InputAdornment from '@mui/material/InputAdornment'

import OutlinedInput from '@mui/material/OutlinedInput'

import ListItemText from '@mui/material/ListItemText'
import type { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'

import { useDropzone } from 'react-dropzone'

import { getRoleList, viewRole } from '@store/slices/roleSlice'

import {
  getStateList,
  viewState,
  getTechnologyList,
  viewTechnology,
  getCityList,
  getTestList,
  viewCity,
  viewTest
} from '@store/slices/resourceSlice'

type FileProp = {
  name: string
  type: string
  size: number
}

// Styled Component Imports
import AppReactDatepicker from '@shared/libs/styles/AppReactDatepicker'
import radio from '@/@core/theme/overrides/radio'
import { createCandidateManage,assignCandidateTest } from '@store/slices/candidateSlice'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  dob: Date | null | undefined
  role: string
  textarea: string
  radio: boolean
  checkbox: boolean
  technology: string[]
  test: string[]
  state: string
  city: string
  image: File | null
  resume: File | null
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

type EditUserInfoData = {
  firstName?: string
  lastName?: string
  userName?: string
  billingEmail?: string
  status?: string
  taxId?: string
  contact?: string
  language?: string[]
  country?: string
  useAsBillingAddress?: boolean
}

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: EditUserInfoData
}

// Vars
const initialData: EditUserInfoProps['data'] = {
  firstName: 'Oliver',
  lastName: 'Queen',
  userName: 'oliverQueen',
  billingEmail: 'oliverQueen@gmail.com',
  status: 'status',
  taxId: 'Tax-8894',
  contact: '+ 1 609 933 4422',
  language: ['english'],
  country: 'US',
  useAsBillingAddress: true
}

const status = ['Status', 'Active', 'Inactive', 'Suspended']

const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

const countries = ['Select Country', 'France', 'Russia', 'China', 'UK', 'US']

const AddTest = ({ open, setOpen, data, id}: EditUserInfoProps) => {
  

  const dispatch = useDispatch<AppDispatch>()
  const test = useSelector(getTestList)
  const technologies = useSelector(getTechnologyList)

  const [technologiesState, setTechnologiesState] = useState<any[]>([])

  const [testState, setTestState] = useState<any[]>([])

  const [selectedTechnology, setSelectedTechnology] = useState('')
  const [selectedTests, setSelectedTests] = useState('')
  const [userData, setUserData] = useState<EditUserInfoProps['data']>(data || initialData)

  const handleClose = () => {
    setOpen(false)
    setUserData(data || initialData)
  }

  useEffect(() => {
    fetchTechnologies()
  }, [])

  useEffect(() => {
    if (technologies?.length) setTechnologiesState(technologies)
  }, [technologies])

  useEffect(() => {
    if (test?.length) setTestState(test)
  }, [test])

  const fetchTechnologies = async () => {
    await dispatch(viewTechnology())
  }

  const handleTechnologyChange = async (ids: string[]) => {
    setSelectedTechnology(ids.join(',')) // optional
    setSelectedTests('')

    if (ids?.length) {
      await dispatch(viewTest({ technologyIds: ids })) // pass IDs array
    }
  }

  const onSubmit = async (values: FormValues) => {

      try {
        const post = {
          candidate_id: id,
          tech_id: values.technology,
          assessment_id: values.test,
        }
  
        // const form_data = new FormData()
  
        // // Loop over post object
        // for (const key in post) {
        //   const value = post[key]
  
        //   if (value instanceof File) {
        //     // ✅ Append files directly
        //     form_data.append(key, value)
        //   } else if (Array.isArray(value)) {
        //     // ✅ Handle arrays (like technology_ids)
        //     value.forEach(v => form_data.append(`${key}[]`, v))
        //   } else if (value !== undefined && value !== null) {
        //     // ✅ Append normal values
        //     form_data.append(key, value.toString())
        //   }
        // }
  
        // Dispatch
        const response: any = await dispatch(assignCandidateTest(post))
  
        if (response?.payload?.success) {
          toast.success(response?.payload?.message)
           setOpen(false)
          reset()
        }
      } catch (error: any) {
        toast.error(error?.message)
      }
    }

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      technology: [],
      test: []
    }
  })

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Assign New test</div>
        <Typography component='span' className='flex flex-col text-center'>
          Assign More test to the candidate from the available test list
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pbe-6 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id='demo-multiple-checkbox-label' error={Boolean(errors.technology)}>
                  Technology
                </InputLabel>
                <Controller
                  name='technology'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      labelId='demo-multiple-checkbox-label'
                      id='demo-multiple-checkbox'
                      {...field}
                      error={Boolean(errors.technology)}
                      multiple
                      value={field.value || []}
                      onChange={e => {
                        const selectedIds = e.target.value as string[]

                        field.onChange(selectedIds) // update RHF form state
                        handleTechnologyChange(selectedIds) // trigger your API fetch
                      }}
                      input={<OutlinedInput label='Technology' />}
                      renderValue={selected =>
                        technologiesState
                          .filter(tech => selected.includes(tech.id))
                          .map(tech => tech.name)
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      {technologiesState?.map(technology => (
                        <MenuItem key={technology.id} value={technology.id}>
                          <Checkbox checked={field.value?.includes(technology.id)} />
                          <ListItemText primary={technology.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.technology && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id='demo-multiple-checkbox-label' error={Boolean(errors.test)}>
                  Test
                </InputLabel>
                <Controller
                  name='test'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      multiple
                      {...field}
                      value={field.value || []}
                      onChange={e => field.onChange(e.target.value)}
                      input={<OutlinedInput label='Test' />}
                      renderValue={selected =>
                        testState
                          .filter(t => selected.includes(t.id))
                          .map(t => t.test_name)
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      {testState.map(test => (
                        <MenuItem key={test.id} value={test.id}>
                          <Checkbox checked={field.value?.includes(test.id)} />
                          <ListItemText primary={`${test.test_name} (${test.level || 'No Level'})`} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.test && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose} type='submit'>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddTest
