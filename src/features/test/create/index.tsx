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

import { createTestAssessManage, editTestAssessManage } from '@store/slices/testAssesSlice'

import { start } from 'repl'
import { apiService } from '@/shared/services/apiService'
import LoadingScreen from '@/shared/components/LoadingScreen'

type FormValues = {
  testName: string
  duration: string
  textarea: string
  radio: boolean
  checkbox: boolean
  technology: string[]
  test: string[]
  problem_statement: string
  starter_code: string
  testCases: any[]
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
interface TestCase {
  id: number
  input: string
  output: string
}

const TestAssessmentCreate = ({ id, isEdit }: { id?: string | null; isEdit?: boolean }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      testName: '',
      duration: '',
      textarea: '',
      radio: false,
      checkbox: false,
      technology: [],
      problem_statement: '',
      starter_code: ''
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
  const [editData, setEditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await Promise.all([fetchTechnologies(), fetchRoles(), fetchStates()])
      setIsLoading(false)
      if (isEdit && id) {
        fetchTestData()
      }
    }
    loadInitialData()
  }, [])

  const fetchTestData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await apiService.get(`assessments/${id}`, true)

      setEditData(response.data)
      // Populate form with fetched data
    } catch (error) {
      console.error('Error fetching test data:', error)
    }
  }

  useEffect(() => {
    if (roles?.length) setRolesState(roles)
  }, [roles])
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

  useEffect(() => {
    if (editData && isEdit) {
      reset({
        testName: editData.test_name || '',
        duration: editData.duration || '',
        technology: editData.technology_id || [],
        radio: editData.level || false,
        problem_statement: editData.problem_statement || '',
        starter_code: editData.starter_code || '',
        textarea: '',
        checkbox: false,
        test: [],
        testCases: editData.cases || []
      })
      if (editData.cases) {
        setTestCases(
          editData.cases.map((tc: any, index: number) => ({
            id: index + 1,
            input: tc.input || '',
            output: tc.expected_output || ''
          }))
        )
      }
    }
  }, [editData, isEdit, reset])

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

  const handleCancel = () => {
    // dispatch(clearSelectedRole()); // Clear any previously selected role
    router.push('/apps/test/list')
  }
  const [testCases, setTestCases] = useState<TestCase[]>([{ id: 1, input: '', output: '' }])

  const addTestCase = () => {
    setTestCases([...testCases, { id: Date.now(), input: '', output: '' }])
  }

  const removeTestCase = (id: number) => {
    setTestCases(testCases.filter(tc => tc.id !== id))
  }

  const handleChange = (id: number, field: 'input' | 'output', value: string) => {
    setTestCases(testCases.map(tc => (tc.id === id ? { ...tc, [field]: value } : tc)))
  }

  const createTest = () => {
    console.log('Submitting test cases:', testCases)
    // API call here
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const formattedTestCases = testCases.map((tc, index) => ({
        input: tc.input,
        expectedOutput: tc.output,
        isHidden: false,
        order: index
      }))

      const post = {
        test_name: values.testName,
        duration: values.duration,
        level: 'medium',
        technology_id: values.technology,
        problem_statement: values.problem_statement,
        starter_code: values.starter_code,
        testCases: formattedTestCases
      }

      // Loop over post object
      // for (const key in post) {
      //   const value = post[key]

      //   if (value instanceof File) {
      //     // ✅ Append files directly
      //     form_data.append(key, value)
      //   } else if (key === 'testCases') {
      //     // ✅ Handle testCases as JSON string
      //     form_data.append(key, JSON.stringify(value))
      //   } else if (Array.isArray(value)) {
      //     // ✅ Handle arrays (like technology_ids)
      //     value.forEach(v => form_data.append(`${key}[]`, v))
      //   } else if (value !== undefined && value !== null) {
      //     // ✅ Append normal values
      //     form_data.append(key, value.toString())
      //   }
      // }

      // Dispatch
      if (isEdit) {
        const response: any = await dispatch(editTestAssessManage({id,post}))
        if (response?.payload?.success) {
          toast.success(response?.payload?.message)
          router.push('/apps/test/list')
          reset()
        }
      } else {
        const response: any = await dispatch(createTestAssessManage(post))
        if (response?.payload?.success) {
          toast.success(response?.payload?.message)
          router.push('/apps/test/list')
          reset()
        }
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
      <CardHeader title={isEdit ? 'Edit Test' : 'Create Test'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='testName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Test Name'
                    placeholder='Sum Of Two Numbers'
                    {...(errors.testName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='duration'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Duration'
                    placeholder='30 minutes'
                    {...(errors.duration && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.technology)}>Technology</InputLabel>
                <Controller
                  name='technology'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select label='Technology' {...field} error={Boolean(errors.technology)}>
                      <MenuItem value=''>Select Technology</MenuItem>
                      {technologiesState?.map(technology => (
                        <MenuItem key={technology.name} value={technology.id}>
                          {technology.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.technology && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={Boolean(errors.radio)}>
                <FormLabel>Difficulty Level</FormLabel>
                <Controller
                  name='radio'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} name='radio-buttons-group'>
                      <FormControlLabel value='easy' control={<Radio />} label='Easy' />
                      <FormControlLabel value='medium' control={<Radio />} label='Medium' />
                      <FormControlLabel value='hard' control={<Radio />} label='Hard' />
                    </RadioGroup>
                  )}
                />
                {errors.radio && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='problem_statement'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label='Problem Statement'
                    placeholder='Enter the problem statement here...'
                    {...(errors.problem_statement && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='starter_code'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={6}
                    label='Starter Code'
                    placeholder='Enter the starter code here...'
                    {...(errors.starter_code && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Box p={2} sx={{ width: '100%' }}>
              <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h6'>Test Cases</Typography>
                <Button variant='outlined' onClick={addTestCase}>
                  + Add Test Case
                </Button>
              </Box>{' '}
              {testCases.map((tc, index) => (
                <Card key={tc.id} variant='outlined' sx={{ mb: 2, backgroundColor: '#f7f8fa', width: '100%' }}>
                  <CardContent>
                    <Box p={1} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='subtitle1' sx={{ color: 'black' }}>
                        Test Case {index + 1}
                      </Typography>
                      <IconButton size='small' onClick={() => removeTestCase(tc.id)}>
                        <i className='ri-delete-bin-7-line text-textSecondary' />
                      </IconButton>
                    </Box>{' '}
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label='Input'
                          multiline
                          rows={1}
                          placeholder='Enter test case input'
                          value={tc.input}
                          onChange={e => handleChange(tc.id, 'input', e.target.value)}
                          sx={{ backgroundColor: '#ffffff' }}
                        />{' '}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          placeholder='Expected Output (JSON format)'
                          label='Expected Output'
                          multiline
                          rows={1}
                          value={tc.output}
                          sx={{ backgroundColor: '#ffffff' }}
                          onChange={e => handleChange(tc.id, 'output', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='contained' onClick={createTest} type='submit'>
                {isEdit ? 'Update Test' : 'Create Test'}
              </Button>
              <Button variant='outlined' type='reset' onClick={() => reset()}>
                Reset
              </Button>
              <Button variant='outlined' type='reset' onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TestAssessmentCreate
