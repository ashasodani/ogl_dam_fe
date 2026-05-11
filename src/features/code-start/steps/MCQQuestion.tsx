// MUI Imports
import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

import Duration from "@/features/ide/components/Duration";

// Component Imports

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Container,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material'
import {
  QuizRounded as QuizIcon,
  NavigateNextRounded as NextIcon,
  NavigateBeforeRounded as PrevIcon,
  AccessTimeRounded as TimeIcon
} from '@mui/icons-material'

import DirectionalIcon from '@shared/components/DirectionalIcon'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
  mcqData?: Record<string, any>
}

const mockTestData = {
  id: 1,
  testName: 'React Fundamentals Assessment',
  technology: 'React',
  level: 'medium',
  duration: '45 min',
  totalQuestions: 10,
  questions: [
    {
      id: 1,
      question: 'What is the correct way to create a functional component in React?',
      options: [
        'function MyComponent() { return <div>Hello</div>; }',
        'const MyComponent = () => { return <div>Hello</div>; }',
        'class MyComponent extends Component { render() { return <div>Hello</div>; } }',
        'Both A and B are correct'
      ],
      correctAnswer: 3, // Index of correct option (0-based)
      selectedAnswer: null
    },
    {
      id: 2,
      question: 'Which hook is used to manage state in functional components?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1,
      selectedAnswer: null
    },
    {
      id: 3,
      question: 'What is JSX in React?',
      options: [
        'A JavaScript library',
        'A syntax extension for JavaScript',
        'A CSS framework',
        'A database query language'
      ],
      correctAnswer: 1,
      selectedAnswer: null
    },
    {
      id: 4,
      question: 'What is JSX in React next?',
      options: [
        'A JavaScript library',
        'A syntax extension for JavaScript',
        'A CSS framework',
        'A database query language'
      ],
      correctAnswer: 1,
      selectedAnswer: null
    },
    {
      id: 5,
      question: 'What is JSX in next?',
      options: ['A JavaScript library', 'A syntax extension for Next', 'A CSS framework', 'A database query language'],
      correctAnswer: 1,
      selectedAnswer: null
    }
  ]
}

const MCQQuestion = ({ activeStep, handleNext, handlePrev, steps, mcqData }: Props) => {
  console.log('mcqData', mcqData)
  const theme = useTheme()
  const [testData, setTestData] = useState(mcqData?.assessment)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(mcqData?.assessment.duration * 60) // 45 minutes in seconds

  // Update testData when mcqData changes
  useEffect(() => {
    if (mcqData?.assessment) {
      setTestData(mcqData.assessment)
      setCurrentQuestion(0)
      setTimeRemaining(mcqData.assessment.duration * 60)
    }
  }, [mcqData])

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = testData.mcqs.map((question, qIndex) => {
      if (qIndex !== questionIndex) return question

      const updatedOptions = question.options.map((option, oIndex) => {
        if (question.format === 'multiple') {
          // For multiple choice, toggle the selected option
          if (oIndex === answerIndex) {
            return { ...option, is_selected: !option.is_selected }
          }
          return option
        } else {
          // For single choice (radio), clear all and select one
          return { ...option, is_selected: oIndex === answerIndex }
        }
      })

      return { ...question, options: updatedOptions }
    })

    setTestData({ ...testData, mcqs: updatedQuestions })
  }

  const handleNexts = () => {
    if (currentQuestion < testData.mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / testData.mcqs.length) * 100

  return (
    <Grid container spacing={5}>
      <Duration testData={testData} timeRemaining={timeRemaining}/>
     
      <Grid size={{ xs: 12 }} className='pbs-1'>
        {/* Progress Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ pb: 2 }}>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Typography variant='h6'>
                Question {currentQuestion + 1} of {testData.mcqs.length}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Progress: {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress variant='determinate' value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }} className='pbs-1'>
        {/* Question Card */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant='h6' gutterBottom sx={{ mb: 3, lineHeight: 1.6 }}>
              {testData.mcqs[currentQuestion].title}
            </Typography>

            <FormControl component='fieldset' sx={{ width: '100%' }}>
              {testData.mcqs[currentQuestion].format === 'multiple' ? (
                <Stack spacing={2}>
                  {testData.mcqs[currentQuestion].options.map((option, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: `2px solid ${theme.palette.divider}`,
                        backgroundColor: 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={option.is_selected || false}
                            onChange={() => handleAnswerSelect(currentQuestion, index)}
                          />
                        }
                        label={
                          <Typography variant='body1' sx={{ flex: 1, pr: 2 }}>
                            {option.option_text}
                          </Typography>
                        }
                        sx={{
                          margin: 0,
                          width: '100%',
                          '& .MuiFormControlLabel-label': { width: '100%' }
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <RadioGroup
                  value={testData.mcqs[currentQuestion].options.findIndex(opt => opt.is_selected)}
                  onChange={e => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
                >
                  <Stack spacing={2}>
                    {testData.mcqs[currentQuestion].options.map((option, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        onClick={() => handleAnswerSelect(currentQuestion, index)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: `2px solid ${theme.palette.divider}`,
                          backgroundColor: 'transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <FormControlLabel
                          value={index}
                          control={
                            option.option_format === 'multiple' ? (
                              <Checkbox
                                checked={option.is_selected || false}
                                onChange={() => handleAnswerSelect(currentQuestion, index)}
                              />
                            ) : (
                              <Radio
                                checked={option.is_selected || false}
                                onChange={() => handleAnswerSelect(currentQuestion, index)}
                              />
                            )
                          }
                          label={
                            <Typography variant='body1' sx={{ flex: 1, pr: 2 }}>
                              {option.option_text}
                            </Typography>
                          }
                          sx={{
                            margin: 0,
                            width: '100%',
                            '& .MuiFormControlLabel-label': { width: '100%' }
                          }}
                        />
                      </Paper>
                    ))}
                  </Stack>
                </RadioGroup>
              )}
            </FormControl>
          </CardContent>
        </Card>
      </Grid>

      {/* Navigation & Submit */}
      <Box display='flex' justifyContent='space-between' alignItems='center' gap={4}>
        <Tooltip title='Previous Question'>
          <Button
            variant='outlined'
            color='secondary'
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Previous
          </Button>
        </Tooltip>
        {/* <IconButton
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          sx={{
            p: 2,
            backgroundColor: theme.palette.action.hover,
            '&:hover': { backgroundColor: theme.palette.action.selected }
          }}
        >
          <PrevIcon />
        </IconButton> */}

        <Tooltip title='Next Question'>
          <Button
            variant='contained'
            disabled={currentQuestion === testData.mcqs.length - 1}
            onClick={handleNexts}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='ri-check-line' />
              ) : (
                <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
              )
            }
            sx={{ marginLeft: 'auto' }}
          >
            Next
          </Button>
        </Tooltip>
      </Box>

      <Grid size={{ xs: 12 }} className='pbs-6'>
        <div className='flex items-center justify-between'>
          {/* <Button
            variant='outlined'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Previous
          </Button> */}
          <Button
            variant='contained'
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='ri-check-line' />
              ) : (
                <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
              )
            }
            sx={{ marginLeft: 'auto' }}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Save & Next'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default MCQQuestion
