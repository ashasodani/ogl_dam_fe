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

import Select from '@mui/material/Select'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'

import { getTechnologyList, viewTechnology } from '@store/slices/resourceSlice'

import { apiService } from '@/shared/services/apiService'
import { createMcqManage } from '@/store/slices/mcqAssesSlice'
import { diff } from 'util'
import LoadingScreen from '@shared/components/LoadingScreen'
import { description } from 'valibot'

type FormValues = {
  title: string
  technology_id: string
  difficulty: string
  duration: number
  technology: string
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

interface Option {
  id: number
  text: string,
  isCorrect: boolean
}

interface Question {
  id: number
  questionText: string,
  questionDescription: string,
  answerType: 'text' | 'radial' | 'multiple'
  options: Option[]
}

const McqAssessmentCreate = ({ id, isEdit }: { id?: string | null; isEdit?: boolean }) => {
  // States

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: ''
    }
  })

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const technologies = useSelector(getTechnologyList)

  const [technologiesState, setTechnologiesState] = useState<any[]>([])

  const [editData, setEditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleCancel = () => {
    // dispatch(clearSelectedRole()); // Clear any previously selected role
    router.push('/apps/mcqtest/list')
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await Promise.all([fetchTechnologies()])
      setIsLoading(false)
      if (isEdit && id) {
        fetchMcqData()
      }
    }
    loadInitialData()
  }, [])

  const fetchMcqData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await apiService.get(`mcq-questions/${id}`, true)

      setEditData(response.data)
      // Populate form with fetched data
    } catch (error) {
      console.error('Error fetching MCQ data:', error)
    }
  }

  useEffect(() => {
    if (technologies?.length) setTechnologiesState(technologies)
  }, [technologies])

  const fetchTechnologies = async () => {
    await dispatch(viewTechnology())
  }

  useEffect(() => {
    if (editData && isEdit) {
      reset({
        title: editData.title || '',
        description: editData.description || '',
        technology: editData.technology_id || '',
        difficulty: editData.difficulty || ''
      })

      if (editData.options) {
        // setOptions(
        //   editData.options.map((tc: any, index: number) => ({
        //     id: index + 1,
        //     option_format: tc.option_format || '',
        //     option_text: tc.option_text || '',
        //     is_correct: tc.is_correct || false
        //   }))
        // )
      }
    }
  }, [editData, isEdit, reset])

  // const [options, setOptions] = useState<Option[]>([
  //   { id: 1, text: '', isCorrect: false }
  // ])

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      questionText: '',
      questionDescription: '',
      answerType: 'text',
      options: [{ id: 1, text: '', isCorrect: false }]
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        questionText: '',
        questionDescription: '',
        answerType: 'text',
        options: [{ id: 1, text: '', isCorrect: false }]
      }
    ])
  }

  const removeQuestion = (questionId: number) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const updateQuestion = (questionId: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const updated = { ...q, [field]: value }
          if (field === 'answerType') {
            updated.options = [{ id: 1, text: '', isCorrect: false }]
          }
          return updated
        }
        return q
      })
    )
  }

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options.length < 5) {
          return {
            ...q,
            options: [...q.options, { id: q.options.length + 1, text: '', isCorrect: false }]
          }
        }
        return q
      })
    )
  }

  const removeOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter(opt => opt.id !== optionId)
          }
        }
        return q
      })
    )
  }

  const updateOption = (questionId: number, optionId: number, field: keyof Option, value: any) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => {
              if (opt.id === optionId) {
                if (field === 'isCorrect' && q.answerType === 'radial') {
                  return { ...opt, [field]: value }
                }

                return { ...opt, [field]: value }
              }

              if (field === 'isCorrect' && q.answerType === 'radial' && value) {
                return { ...opt, isCorrect: false }
              }
              return opt
            })
          }
        }
        return q
      })
    )
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const formattedQuestions = questions.map(q => ({
        title: q.questionText,
        description: q.questionDescription,
        technology_id: values.technology,
        difficulty: values.difficulty,

        options: q.options.map(opt => ({
          option_text: opt.text,
          is_correct: opt.isCorrect,
          option_format: q.answerType,
          order: q.options.indexOf(opt) + 1
        }))
      }))

      const post = {
        questions: formattedQuestions
      }

      console.log('Submitting MCQ:', post)
      const response: any = await dispatch(createMcqManage(post))

      if (response?.payload?.success) {
        toast.success(response?.payload?.message)
        router.push('/apps/mcqtest/list')
        reset()
      } else if (!response?.status) {
        toast.error(response.error.message)
      }

      // if (response?.payload?.success) {
      //   toast.success(response?.payload?.message)
      //   router.push('/apps/mcqtest/list')
      //   reset()
      // }
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
      <CardHeader title={isEdit ? 'Edit MCQ Question' : 'Create MCQ Question'} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
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
              <FormControl error={Boolean(errors.difficulty)}>
                <FormLabel>Difficulty Level</FormLabel>
                <Controller
                  name='difficulty'
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
                {errors.difficulty && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Box p={3} sx={{ width: '100%' }}>
              <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h6'>MCQ Questions</Typography>
                <Fab color='primary' onClick={addQuestion} aria-label='add' size='medium' sx={{ mr: 2 }}>
                  <i className='ri-add-line' />
                </Fab>
              </Box>

              {questions.map((question, qIndex) => (
                <Card key={question.id} variant='outlined' sx={{ mb: 3, backgroundColor: '#f7f8fa' }}>
                  <CardContent>
                    <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                      <Typography variant='subtitle1' sx={{ color: 'black' }}>
                        Question {qIndex + 1}
                      </Typography>
                      {questions.length > 1 && (
                        <Button size='small' color='error' onClick={() => removeQuestion(question.id)}>
                          Remove
                        </Button>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 7 }}>
                        <TextField
                          fullWidth
                          label='Question Text'
                          multiline
                          minRows={1}
                          maxRows={5}
                          placeholder='Enter your question here...'
                          value={question.questionText}
                          onChange={e => updateQuestion(question.id, 'questionText', e.target.value)}
                          sx={{ backgroundColor: '#ffffff' }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <FormControl fullWidth>
                          <InputLabel>Answer Type</InputLabel>
                          <Select
                            value={question.answerType}
                            onChange={e => updateQuestion(question.id, 'answerType', e.target.value)}
                            label='Answer Type'
                          >
                            <MenuItem value='text'> Select Option Format</MenuItem>
                            <MenuItem value='radial'>Single Choice</MenuItem>
                            <MenuItem value='multiple'>Multiple Choice</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                       <Grid size={{ xs: 12, sm: 12  }}>
                        <TextField
                          fullWidth
                          label='Question Description'
                          multiline
                          minRows={3}
                          maxRows={10}
                          placeholder='Enter your question description...'
                          value={question.questionDescription}
                          onChange={e => updateQuestion(question.id, 'questionDescription', e.target.value)}
                          sx={{ backgroundColor: '#ffffff' }}
                        />
                      </Grid>
                    </Grid>

                    {question.answerType !== 'text' && (
                      <Box mt={3}>
                        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                          <Typography variant='subtitle2'>Options</Typography>
                          <Fab
                            color='primary'
                            onClick={() => addOption(question.id)}
                            disabled={question.options.length >= 5}
                            aria-label='add'
                            size='small'
                            sx={{ mr: 2 }}
                          >
                            <i className='ri-add-line' />
                          </Fab>
                        </Box>

                        {question.options.map((option, oIndex) => (
                          <Box key={option.id} display='flex' alignItems='center' gap={1} mb={2}>
                            {question.answerType === 'radial' ? (
                              <Radio
                                checked={option.isCorrect}
                                onChange={() => updateOption(question.id, option.id, 'isCorrect', !option.isCorrect)}
                              />
                            ) : (
                              <Checkbox
                                checked={option.isCorrect}
                                onChange={() => updateOption(question.id, option.id, 'isCorrect', !option.isCorrect)}
                              />
                            )}
                            <TextField
                              fullWidth
                              size='small'
                              placeholder={`Option ${oIndex + 1}`}
                              value={option.text}
                              onChange={e => updateOption(question.id, option.id, 'text', e.target.value)}
                            />

                            {question.options.length > 1 && (
                              <Button size='small' color='error' onClick={() => removeOption(question.id, option.id)}>
                                ×
                              </Button>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='contained' type='submit'>
                {isEdit ? 'Update' : 'Create'}
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

export default McqAssessmentCreate
