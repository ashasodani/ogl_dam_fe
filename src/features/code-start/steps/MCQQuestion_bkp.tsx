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
  CheckCircleRounded as CheckIcon,
  CancelRounded as WrongIcon,
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
  const [showResults, setShowResults] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)

      return () => clearTimeout(timer)
    }
    setTestData(mcqData?.assessment)
  }, [timeRemaining, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...testData.mcqs]
    updatedQuestions[questionIndex].selectedAnswer = answerIndex
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

  const handleSubmit = () => {
    setShowResults(true)
  }

  const getOptionIcon = (questionIndex: number, optionIndex: number) => {
    const question = testData.mcqs[questionIndex]
    if (!showResults) return null

    if (optionIndex === question.correctAnswer) return <CheckIcon color='success' />
    if (optionIndex === question.selectedAnswer && optionIndex !== question.correctAnswer)
      return <WrongIcon color='error' />

    return null
  }

  const calculateScore = () => {
    const correct = testData.mcqs.filter(q => q.selectedAnswer === q.correctAnswer).length

    return Math.round((correct / testData.mcqs.length) * 100)
  }

  const progress = ((currentQuestion + 1) / testData.mcqs.length) * 100

  return (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12 }} className='pbs-6'>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white'
          }}
        >
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box display='flex' alignItems='center' gap={2}>
              <QuizIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant='h5' fontWeight={700}>
                  {testData.title}
                </Typography>
                <Box display='flex' gap={2} mt={1}>
                  <Chip
                    label={testData.technology.name}
                    size='small'
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>
            </Box>

            <Box textAlign='right'>
              <Box display='flex' alignItems='center' gap={1} mb={1}>
                <TimeIcon />
                <Typography
                  variant='h6'
                  fontWeight={600}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', opacity: 0.9 }}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <Typography
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', opacity: 0.9 }}
                variant='body2'
              >
                Duration: {testData.duration}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
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
              <RadioGroup
                value={testData.mcqs[currentQuestion].selectedAnswer ?? ''}
                onChange={e => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
              >
                <Stack spacing={2}>
                  {testData.mcqs[currentQuestion].options.map((option, index) => (
                    <Paper
                      key={index}
                      elevation={showResults && index === testData.mcqs[currentQuestion].correctAnswer ? 2 : 1}
                      onClick={() => !showResults && handleAnswerSelect(currentQuestion, index)}
                      sx={{
                        p: 2,
                        cursor: showResults ? 'default' : 'pointer',
                        border: `2px solid ${
                          showResults
                            ? index === testData.mcqs[currentQuestion].correctAnswer
                              ? theme.palette.success.main
                              : index === testData.mcqs[currentQuestion].selectedAnswer &&
                                  index !== testData.mcqs[currentQuestion].correctAnswer
                                ? theme.palette.error.main
                                : theme.palette.divider
                            : theme.palette.divider
                        }`,
                        backgroundColor: showResults
                          ? index === testData.mcqs[currentQuestion].correctAnswer
                            ? theme.palette.success.light + '20'
                            : index === testData.mcqs[currentQuestion].selectedAnswer &&
                                index !== testData.mcqs[currentQuestion].correctAnswer
                              ? theme.palette.error.light + '20'
                              : 'transparent'
                          : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': !showResults
                          ? {
                              borderColor: theme.palette.primary.main,
                              backgroundColor: theme.palette.action.hover
                            }
                          : {}
                      }}
                    >
                      <FormControlLabel
                        value={index}
                        control={
                          <Radio
                            disabled={showResults}
                            checked={testData.mcqs[currentQuestion].is_correct === index}
                            onChange={() => !showResults && handleAnswerSelect(currentQuestion, index)}
                          />
                        }
                        label={
                          <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                            <Typography variant='body1' sx={{ flex: 1, pr: 2 }}>
                              {option.option_text}
                            </Typography>
                            {getOptionIcon(currentQuestion, index)}
                          </Box>
                        }
                        sx={{
                          margin: 0,
                          width: '100%',
                          '& .MuiFormControlLabel-label': { width: '100%' },
                          pointerEvents: showResults ? 'none' : 'auto'
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>{' '}
              </RadioGroup>
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

        {showResults && (
          <Paper sx={{ p: 2, backgroundColor: theme.palette.success.light + '20' }}>
            <Typography variant='h6' color='success.main' textAlign='center'>
              Your Score: {calculateScore()}%
            </Typography>
          </Paper>
        )}

        <Box display='flex' gap={2}>
          {currentQuestion === testData.mcqs.length - 1 && !showResults ? (
          
             <Button
                variant='contained'
                disabled={true}
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
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
          ) : (
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
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>

              {/* <IconButton
                onClick={handleNexts}
                disabled={currentQuestion === testData.mcqs.length - 1}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { backgroundColor: theme.palette.primary.dark }
                }}
              >
                <NextIcon />
              </IconButton> */}
            </Tooltip>
          )}
        </Box>
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
