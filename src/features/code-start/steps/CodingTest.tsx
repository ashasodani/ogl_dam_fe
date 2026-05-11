// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useDispatch, useSelector } from 'react-redux'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import DirectionalIcon from '@shared/components/DirectionalIcon'

import ProblemStatement from '@/features/ide/components/ProblemStatement'
import CodeEditor from '@/features/ide/components/CodeEditor'
import XTerminal from '@/features/ide/components/Terminal'
import LangSelector from '@/features/ide/components/LangSelector'
import Duration from '@/features/ide/components/Duration'
import {
  authenticateJDoodle,
  getJDoodleOutput,
  getJDoodleLoading,
  executeJDoodleCode
} from '@/store/slices/jdoodleSlice'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
  codeData?: Record<string, any>
}

// Vars
const data: CustomInputVerticalData[] = [
  {
    title: 'I am the Builder',
    value: 'builder',
    content: 'List property as Builder, list your project and get highest reach.',
    asset: 'ri-home-6-line',
    isSelected: true
  },
  {
    title: 'I am the Owner',
    value: 'owner',
    content: 'Submit property as an Individual. Lease, Rent or Sell at the best price.',
    asset: 'ri-user-3-line'
  },
  {
    title: 'I am the broker',
    value: 'broker',
    content: 'Earn highest commission by listing your clients properties at the best price.',
    asset: 'ri-money-dollar-circle-line'
  }
]

const CodingTest = ({ activeStep, handleNext, handlePrev, steps, codeData }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const output = useSelector(getJDoodleOutput)
  const loading = useSelector(getJDoodleLoading)
  const [timeRemaining, setTimeRemaining] = useState(codeData?.assessment.duration * 60)
  const [testData, setTestData] = useState(codeData?.assessment)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // const output = {
  //     "output": "The sum is: 15",
  //     "error": null,
  //     "statusCode": 200,
  //     "memory": "22716",
  //     "cpuTime": "0.07",
  //     "compilationStatus": null,
  //     "projectKey": null,
  //     "isExecutionSuccess": true,
  //     "isCompiled": true
  // }
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// write your code here')
  useEffect(() => {
    setCode(codeData?.assessment.starter_code)
    setLanguage(codeData?.assessment?.technology.name.toLowerCase() || 'javascript')
  }, [codeData])

  // Vars
  const initialSelectedOption: string = data.filter(item => item.isSelected)[
    data.filter(item => item.isSelected).length - 1
  ].value

  // States
  const [selectedOption, setSelectedOption] = useState<string>(initialSelectedOption)
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleOptionChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectedOption(prop)
    } else {
      setSelectedOption((prop.target as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    if (codeData?.assessment) {
      setTestData(codeData.assessment)
      setTimeRemaining(codeData.assessment.duration * 60)
    }
  }, [codeData, activeStep])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining])

  return (
    <Grid container spacing={1}>
      <Duration testData={testData} timeRemaining={timeRemaining} />
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={2}>
          <div className='flex h-[calc(100vh-100px)]'>
            {/* Left Problem Statement */}
            <ProblemStatement
              className={'w-[400px] p-5 overflow-y-auto'}
              title={codeData?.assessment.test_name}
              desc={codeData?.assessment.problem_statement}
              examples={
                codeData?.assessment.cases || [
                  {
                    input: 's = "abcabcbb"',
                    output: '3',
                    explanation:
                      'The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.',
                    textColor: 'text-black'
                  },
                  {
                    input: 's = "bbbbb"',
                    output: '1',
                    explanation: 'The answer is "b", with the length of 1.',
                    textColor: 'text-black'
                  },
                  {
                    input: 's = "pwwkew"',
                    output: '3',
                    explanation:
                      'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
                    textColor: 'text-black'
                  }
                ]
              }
            />

            {/* Right IDE */}
            <div className='flex-1 flex flex-col p-5 border-black border-l-4 border-double gap-4'>
              <div className='flex gap-3 mb-2 justify-between'>
                <LangSelector value={language} onChange={setLanguage} />
                <Button
                  variant='contained'
                  className='h-8'
                  // onClick={() => dispatch(authenticateJDoodle())}
                  onClick={() => {
                    const payload = {
                      script: code,
                      language: language,
                      stdin: ''
                    }
                    dispatch(executeJDoodleCode(payload))
                  }}
                  disabled={loading}
                >
                  {loading ? 'Running...' : 'Run'}
                </Button>
              </div>

              <div className='w-full h-[calc(100vh-500px)]'>
                <CodeEditor language={language} code={code} onChange={setCode} />
              </div>
              <XTerminal output={output} />
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
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

export default CodingTest
  