'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
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

// Mock data - replace with actual API data
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
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
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
    }
  ]
}

const MCQTestView = () => {
  const theme = useTheme()
  const [testData, setTestData] = useState(mockTestData)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(2700) // 45 minutes in seconds
  const [showResults, setShowResults] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...testData.questions]
    updatedQuestions[questionIndex].selectedAnswer = answerIndex
    setTestData({ ...testData, questions: updatedQuestions })
  }

  const handleNexts = () => {
    if (currentQuestion < testData.questions.length - 1) {
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
    const question = testData.questions[questionIndex]
    if (!showResults) return null
    
    if (optionIndex === question.correctAnswer) return <CheckIcon color="success" />
    if (optionIndex === question.selectedAnswer && optionIndex !== question.correctAnswer) return <WrongIcon color="error" />
    return null
  }

  const calculateScore = () => {
    const correct = testData.questions.filter(q => q.selectedAnswer === q.correctAnswer).length
    return Math.round((correct / testData.questions.length) * 100)
  }

  const progress = ((currentQuestion + 1) / testData.questions.length) * 100

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <QuizIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {testData.testName}
              </Typography>
              <Box display="flex" gap={2} mt={1}>
                <Chip 
                  label={testData.technology} 
                  size="small" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  label={testData.level.toUpperCase()} 
                  size="small"
                  color={testData.level === 'hard' ? 'error' : testData.level === 'medium' ? 'warning' : 'success'}
                />
              </Box>
            </Box>
          </Box>
          
          <Box textAlign="right">
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TimeIcon />
              <Typography variant="h6" fontWeight={600}>
                {formatTime(timeRemaining)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Duration: {testData.duration}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Progress Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Question {currentQuestion + 1} of {testData.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress: {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, lineHeight: 1.6 }}>
            {testData.questions[currentQuestion].question}
          </Typography>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={testData.questions[currentQuestion].selectedAnswer ?? ''}
              onChange={(e) => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
            >
              <Stack spacing={2}>
                {testData.questions[currentQuestion].options.map((option, index) => (
                  <Paper
                    key={index}
                    elevation={showResults && index === testData.questions[currentQuestion].correctAnswer ? 2 : 1}
                    sx={{
                      p: 2,
                      border: `2px solid ${
                        showResults 
                          ? index === testData.questions[currentQuestion].correctAnswer 
                            ? theme.palette.success.main
                            : index === testData.questions[currentQuestion].selectedAnswer && index !== testData.questions[currentQuestion].correctAnswer
                              ? theme.palette.error.main
                              : theme.palette.divider
                          : theme.palette.divider
                      }`,
                      backgroundColor: showResults 
                        ? index === testData.questions[currentQuestion].correctAnswer 
                          ? theme.palette.success.light + '20'
                          : index === testData.questions[currentQuestion].selectedAnswer && index !== testData.questions[currentQuestion].correctAnswer
                            ? theme.palette.error.light + '20'
                            : 'transparent'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': !showResults ? {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover
                      } : {}
                    }}
                  >
                    <FormControlLabel
                      value={index}
                      control={<Radio disabled={showResults} />}
                      label={
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                          <Typography variant="body1" sx={{ flex: 1, pr: 2 }}>
                            {option}
                          </Typography>
                          {getOptionIcon(currentQuestion, index)}
                        </Box>
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
          </FormControl>
        </CardContent>
      </Card>

      {/* Navigation & Submit */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tooltip title="Previous Question">
          <IconButton 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            sx={{ 
              p: 2,
              backgroundColor: theme.palette.action.hover,
              '&:hover': { backgroundColor: theme.palette.action.selected }
            }}
          >
            <PrevIcon />
          </IconButton>
        </Tooltip>

        {showResults && (
          <Paper sx={{ p: 2, backgroundColor: theme.palette.success.light + '20' }}>
            <Typography variant="h6" color="success.main" textAlign="center">
              Your Score: {calculateScore()}%
            </Typography>
          </Paper>
        )}

        <Box display="flex" gap={2}>
          {currentQuestion === testData.questions.length - 1 && !showResults ? (
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleSubmit}
              size="large"
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Submit Test
            </Button>
          ) : (
            <Tooltip title="Next Question">
              <IconButton 
                onClick={handleNexts} 
                disabled={currentQuestion === testData.questions.length - 1}
                sx={{ 
                  p: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { backgroundColor: theme.palette.primary.dark }
                }}
              >
                <NextIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default MCQTestView