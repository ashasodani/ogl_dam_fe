'use client'

// React Imports
import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector from '@mui/material/StepConnector'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import { Box, Container } from '@mui/material'

import type { AppDispatch } from '@store'

// Component Imports
import CodingTest from './CodingTest'
import StepPropertyDetails from './StepPropertyDetails'
import StepPropertyFeatures from './StepPropertyFeatures'
import StepPropertyArea from './StepPropertyArea'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@shared/components/stepper-dot'
import CodingTest2 from './CodingTest2'
import MCQQuestion from './MCQQuestion'

import { getCodingTestManage, getCodingTestManageList, getCodingTestLoader } from '@store/slices/codingTestSlice'

// Vars
const steps = [
  {
    title: 'MCQ Question',
    subtitle: 'Multiple Choice Questions'
  },
  {
    title: 'Coding Test 1',
    subtitle: 'Logical Reasoning'
  },
  {
    title: 'Coding Test 2',
    subtitle: 'Practical Reasoning'
  }
]

const getStepContent = (step: number, handleNext: () => void, handlePrev: () => void) => {
  switch (step) {
    case 0:
      return <MCQQuestion activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
    case 1:
      return <CodingTest activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
    case 2:
      return <CodingTest activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
    default:
      return null
  }
}

// Styled Components
const ConnectorHeight = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    minHeight: 20
  }
}))

const TestListingWizard = () => {
  // States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [generalData, setGeneralData] = useState<any[]>([])
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>()
  const codingTestManage = useSelector(getCodingTestManageList)

  useEffect(() => {
    fetchData()
  }, [dispatch])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = {}

    await dispatch(getCodingTestManage(params))

    // setLoading(false);
  }

  useEffect(() => {
      setGeneralData(codingTestManage.assessments)
    }, [codingTestManage])

  console.log(codingTestManage)
  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      router.push(`/thankyou`)
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth={false} sx={{ height: '100%' }}>
          <Card className='flex flex-col lg:flex-row' sx={{ minHeight: 'calc(100vh - 32px)' }}>
            <CardContent className='max-lg:border-be lg:border-ie lg:min-is-[300px]'>
              <StepperWrapper className='bs-full'>
                <Stepper activeStep={activeStep} connector={<ConnectorHeight />} orientation='vertical'>
                  {steps?.map((step, index) => {

                    return (
                      <Step key={index} onClick={() => setActiveStep(index)}>
                        <StepLabel
                          className='p-0'
                          slots={{
                            stepIcon: StepperCustomDot
                          }}
                        >
                          <div className='step-label cursor-pointer'>
                            <Typography className='step-number'>{`0${index + 1}`}</Typography>
                            <div>
                              <Typography className='step-title'>{step.title}</Typography>
                              {/* <Typography className='step-subtitle'>{step.subtitle}</Typography> */}
                            </div>
                          </div>
                        </StepLabel>
                      </Step>
                    )
                  })}
                </Stepper>
              </StepperWrapper>
            </CardContent>

            <CardContent className='flex-1 pbs-5'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}

export default TestListingWizard
