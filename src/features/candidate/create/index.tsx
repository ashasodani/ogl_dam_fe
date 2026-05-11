'use client'

// React Imports
import * as React from 'react'
import { useEffect, useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useDispatch, useSelector } from 'react-redux'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Tooltip, useTheme } from '@mui/material'
import type { ThemeColor } from '@core/types'

import {
  SendRounded as SendRoundedIcon,
  EditRounded as EditRoundedIcon,
  DownloadRounded as DownloadRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon
} from '@mui/icons-material'

import ListItemText from '@mui/material/ListItemText'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
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
import { createCandidateManage } from '@store/slices/candidateSlice'
import LoadingScreen from '@shared/components/LoadingScreen'

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

const UserCreate = (editData: any) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const theme = useTheme()

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      firstName: editData?.firstName || '',
      lastName: editData?.lastName || '',
      email: editData?.email || '',
      password: editData?.password || '',
      dob: editData?.dob || null,
      role: editData?.role || '',
      textarea: editData?.firstName || '',
      radio: editData?.radio || '',
      checkbox: editData?.checkbox || false,
      technology: editData?.technology || [],
      test: editData?.test || [],
      state: editData?.state || '',
      city: editData?.city || '',
      image: editData?.image || null,
      resume: editData?.resume || null
    }
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const [personName, setPersonName] = React.useState<string[]>([])

  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = files.map((file: FileProp) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ))

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const states = useSelector(getStateList)
  const cities = useSelector(getCityList)
  const test = useSelector(getTestList)
  const technologies = useSelector(getTechnologyList)
  const [statesState, setStatesState] = useState<any[]>([])
  const [technologiesState, setTechnologiesState] = useState<any[]>([])
  const [citiesState, setCitiesState] = useState<any[]>([])
  const [testState, setTestState] = useState<any[]>([])

  const roles = useSelector(getRoleList)
  const [rolesState, setRolesState] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedTechnology, setSelectedTechnology] = useState('')
  const [selectedTests, setSelectedTests] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isAdminRole, setIsAdminRole] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await Promise.all([fetchRoles(), fetchStates(), fetchTechnologies()])
      setIsLoading(false)
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    if (roles?.length) {
      setRolesState(roles)
      // Set candidate role as default
      const candidateRole = roles.find(role => role.name?.toLowerCase() === 'candidate')
      if (candidateRole && !editData?.role) {
        reset(prev => ({ ...prev, role: candidateRole.id }))
        handleRoleChange(candidateRole.id)
      }
    }
  }, [roles, reset, editData])
  useEffect(() => {
    if (states?.length) setStatesState(states)
  }, [states])
  useEffect(() => {
    if (technologies?.length) setTechnologiesState(technologies)
  }, [technologies])
  useEffect(() => {
    if (cities?.length) setCitiesState(cities)
  }, [cities])
  useEffect(() => {
    if (test?.length) setTestState(test)
  }, [test])

  const fetchStates = async () => {
    await dispatch(viewState())
  }

  const fetchTechnologies = async () => {
    await dispatch(viewTechnology())
  }

  const fetchRoles = async () => {
    await dispatch(viewRole())
  }

  const handleStateChange = async (value: string) => {
    setSelectedCity('')

    if (value) {
      await dispatch(viewCity(value)) // fetch cities for the state
    }
  }

  const handleTechnologyChange = async (ids: string[]) => {
    setSelectedTechnology(ids.join(',')) // optional
    setSelectedTests('')

    if (ids?.length) {
      await dispatch(viewTest({ technologyIds: ids })) // pass IDs array
    }
  }

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId)
    const selectedRoleData = rolesState.find(role => role.id === roleId)
    setIsAdminRole(selectedRoleData?.name?.toLowerCase() === 'admin')
  }

  const handleCancel = () => {
    // dispatch(clearSelectedRole()); // Clear any previously selected role
    router.push('/apps/candidate/list')
  }

  const onSubmit = async (values: any, { resetForm }: any) => {

    try {
      const post = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        role_id: values.role,
        level: 'medium',
        gender: 'male',
        state_id: values.state,
        city_id: values.city,
        technology_id: values.technology,
        assessment_id: values.test,
        image: values.image, // file
        resume: values.resume // file
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

      // Dispatch
      const response: any = await dispatch(createCandidateManage(form_data))
      if (response?.payload?.success) {
        toast.success(response?.payload?.message)

        router.push('/apps/candidate/list')
        reset()
      } else if (!response?.status) {
        toast.error(response.error.message)
      }
    } catch (error: any) {
      toast.error(error?.message)
    }
  }

  // const onSubmit = () => toast.success('Form Submitted')

  if (isLoading) {
    return <LoadingScreen message='Loading form data...' />
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader title='User' />
        <Box sx={{ mr: 2 }}>
          <Tooltip title='Back to List'>
            <IconButton
              color='secondary'
              onClick={handleCancel}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.secondary.main}`,
                '&:hover': {
                  backgroundColor: 'secondary.light'
                }
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>{' '}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    {...(errors.firstName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    {...(errors.lastName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='johndoe@gmail.com'
                    {...(errors.email && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    placeholder='············'
                    id='form-validation-basic-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='toggle password visibility'
                            >
                              <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                    {...(errors.password && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.role)}>Role</InputLabel>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      label='Role'
                      {...field}
                      error={Boolean(errors.role)}
                      onChange={e => {
                        field.onChange(e.target.value)
                        handleRoleChange(e.target.value as string)
                      }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      {rolesState?.map(role => (
                        <MenuItem key={role.name} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.role && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            {!isAdminRole && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-multiple-checkbox-label' error={Boolean(errors.technology)}>
                    Technology
                  </InputLabel>
                  <Controller
                    name='technology'
                    control={control}
                    rules={{ required: !isAdminRole }}
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
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.state)}>State</InputLabel>
                <Controller
                  name='state'
                  control={control}
                  rules={{ required: !isAdminRole }}
                  render={({ field }) => (
                    <Select
                      label='State'
                      {...field}
                      onChange={async (e: any) => {
                        field.onChange(e.target.value) // ✅ keep RHF value in sync
                        await handleStateChange(e.target.value) // fetch cities
                      }}
                      error={Boolean(errors.state)}
                    >
                      <MenuItem value=''>Select State</MenuItem>
                      {statesState.map(state => (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.state && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            {!isAdminRole && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-multiple-checkbox-label' error={Boolean(errors.test)}>
                    Test
                  </InputLabel>
                  <Controller
                    name='test'
                    control={control}
                    rules={{ required: !isAdminRole }}
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
                            <ListItemText
                              primary={`${test.test_name} (${test.technology || 'No Level'})(${test.level || 'No Level'}) `}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.test && <FormHelperText error>This field is required.</FormHelperText>}
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.city)}>City</InputLabel>
                <Controller
                  name='city'
                  control={control}
                  rules={{ required: !isAdminRole }}
                  render={({ field }) => (
                    <Select label='City' {...field} error={Boolean(errors.city)}>
                      <MenuItem value=''>Select City</MenuItem>
                      {citiesState.map(city => (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.city && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={Boolean(errors.radio)}>
                <FormLabel>Gender</FormLabel>
                <Controller
                  name='radio'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} name='radio-buttons-group'>
                      <FormControlLabel value='female' control={<Radio />} label='Female' />
                      <FormControlLabel value='male' control={<Radio />} label='Male' />
                    </RadioGroup>
                  )}
                />
                {errors.radio && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='image'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Button variant='outlined' component='label' fullWidth color={errors.image ? 'error' : 'primary'}>
                      Upload Profile Image
                      <input
                        hidden
                        type='file'
                        accept='image/*'
                        onChange={e => field.onChange(e.target.files?.[0] || null)}
                      />
                    </Button>

                    {/* Show file name */}
                    {field.value && (
                      <Typography variant='body2' color='text.secondary'>
                        {field.value.name}
                      </Typography>
                    )}

                    {/* Preview section */}
                    {field.value && (
                      <Box display='flex' justifyContent='center'>
                        <Avatar
                          src={URL.createObjectURL(field.value)}
                          alt='Profile Preview'
                          sx={{ width: 80, height: 80 }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              />
              {errors.image && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>
            {!isAdminRole && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl error={Boolean(errors.checkbox)}>
                  <FormLabel>Level</FormLabel>
                  <Controller
                    name='checkbox'
                    control={control}
                    rules={{ required: !isAdminRole }}
                    render={({ field }) => (
                      <RadioGroup row {...field} name='checkbox-buttons-group'>
                        <FormControlLabel control={<Checkbox {...field} />} label='Basic' />
                        <FormControlLabel control={<Checkbox {...field} />} label='Intermediate' />
                        <FormControlLabel control={<Checkbox {...field} />} label='Advanced' />
                      </RadioGroup>
                    )}
                  />
                  {errors.checkbox && <FormHelperText error>This field is required.</FormHelperText>}
                </FormControl>
              </Grid>
            )}
            {!isAdminRole && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='resume'
                  control={control}
                  rules={{ required: !isAdminRole }}
                  render={({ field }) => (
                    <>
                      <Button variant='outlined' component='label' fullWidth color={errors.resume ? 'error' : 'primary'}>
                        Upload Resume (PDF/DOC)
                        <input
                          hidden
                          type='file'
                          accept='.pdf,.doc,.docx'
                          onChange={e => field.onChange(e.target.files?.[0] || null)}
                        />
                      </Button>
                      {field.value && (
                        <Typography variant='body2' color='text.secondary'>
                          {field.value.name}
                        </Typography>
                      )}
                    </>
                  )}
                />
                {errors.resume && <FormHelperText error>This field is required.</FormHelperText>}
                

                    
              </Grid>
            )}

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' type='reset' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserCreate
