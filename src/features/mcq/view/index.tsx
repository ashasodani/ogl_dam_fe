'use client'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
  Box,
  Avatar,
  Stack,
  Tooltip,
  useTheme
} from '@mui/material'
import Button from '@mui/material/Button'
import {
  SendRounded as SendRoundedIcon,
  EditRounded as EditRoundedIcon,
  DownloadRounded as DownloadRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import Image from 'next/image'

import { getMcqAssessManageDetail, getMcqAssessManagesDetail } from '@/store/slices/mcqAssesSlice'

import { apiService } from '@/shared/services/apiService'

// Local Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@shared/components/dialogs/OpenDialogOnElementClick'
import EditUserInfo from '@shared/components/dialogs/edit-candidate-info'

import type { AppDispatch } from '@/store'

import type { ThemeColor } from '@core/types'
import { title } from 'process'

const McqOverview = ({ id }: { id?: string | null }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const mcqDetails = useSelector(getMcqAssessManageDetail)

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (id) dispatch(getMcqAssessManagesDetail(id))
  }, [id, dispatch])
  console.log('mcqDetails', mcqDetails)

  // useEffect(() => {
  //   if (candidateDetails?.role?.name === 'Admin') setIsAdmin(true)
  // }, [candidateDetails])

  // const is_candidate_email = candidateDetails?.is_email || false

  // useEffect(() => {
  //   dispatch(setButtonsDisabled(is_candidate_email))
  // }, [is_candidate_email, dispatch])

  const userData = {
    question: mcqDetails?.title || 'Hallam',
    description: mcqDetails?.description || '',
    options: mcqDetails?.options || []
  }

  const handleCancel = () => router.push('/apps/mcqtest/list')

  return (
    <Card>
      <CardContent>
        {/* Top Bar */}
        {/* MCQ Questions Section */}

        <Box mt={4}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' fontWeight={600} gutterBottom>
              {mcqDetails?.title || 'Untitled Test'}
            </Typography>
            <Box display='flex' gap={1} ml='auto'>
             
              <Chip label={ mcqDetails?.difficulty?.charAt(0).toUpperCase() + mcqDetails?.difficulty?.slice(1)} color='warning' size='small' sx={{ fontSize: '0.7rem' }} />
              <Chip label={mcqDetails?.technology?.name} color='primary' size='small' sx={{ fontSize: '0.7rem' }} />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Card
              variant='outlined'
              sx={{
                borderRadius: 3,
                p: 3,
                boxShadow: 1,
                width: '100%',
                '&:hover': { boxShadow: 3, borderColor: theme.palette.primary.light }
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                {userData.description || ''}
              </Typography>

              <Stack spacing={1}>
                {userData.options?.map((option: any, optIndex: number) => {
                  const isCorrect = option.is_correct || option.correct

                  return (
                    <Box
                      key={optIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography variant='body2'>
                        {String.fromCharCode(65 + optIndex)}. {option.option_text || option.text}
                      </Typography>
                      {isCorrect && (
                        <Chip label='Correct' color='success' size='small' sx={{ ml: 'auto', fontSize: '0.7rem' }} />
                      )}
                    </Box>
                  )
                })}
              </Stack>
            </Card>
          </Stack>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box display='flex' justifyContent='flex-end' gap={1}>
          <Tooltip title='Back to List'>
            <Button variant='contained' onClick={handleCancel} className='max-sm:is-full'>
             Back
            </Button>
          </Tooltip>
        </Box>

        {/* Action Buttons */}
      </CardContent>
    </Card>
  )
}

export default McqOverview
