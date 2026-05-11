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
import {
  SendRounded as SendRoundedIcon,
  EditRounded as EditRoundedIcon,
  DownloadRounded as DownloadRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import Image from 'next/image'

// Local Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OpenDialogOnElementClick from '@shared/components/dialogs/OpenDialogOnElementClick'
import EditUserInfo from '@shared/components/dialogs/edit-candidate-info'
import {
  getCandidateManageDetail,
  getCandidateManagesDetail,
  setButtonsDisabled,
  getButtonsDisabled,
  getTotalAssignedTest
} from '@store/slices/candidateSlice'
import type { AppDispatch } from '@/store'
import { apiService } from '@/shared/services/apiService'
import type { ThemeColor } from '@core/types'
import { title } from 'process'
import { toUpperCase } from 'valibot'

const UserDetails = ({ id }: { id?: string | null }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const candidateDetails = useSelector(getCandidateManagesDetail)
  const isButtonsDisabled = useSelector(getButtonsDisabled)
  const totalAssignedTest = useSelector(getTotalAssignedTest)

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (id) dispatch(getCandidateManageDetail(id))
  }, [id, dispatch])

  useEffect(() => {
    if (candidateDetails?.role?.name === 'Admin') setIsAdmin(true)
  }, [candidateDetails])

  const is_candidate_email = candidateDetails?.is_email || false

  useEffect(() => {
    dispatch(setButtonsDisabled(is_candidate_email))
  }, [is_candidate_email, dispatch])

  const userData = {
    firstName: candidateDetails?.first_name || 'Hallam',
    lastName: candidateDetails?.last_name || 'Hallam',
    billingEmail: candidateDetails?.email || 'shallamb@gmail.com',
    status: candidateDetails?.status?.toUpperCase() || 'Active',
    role: candidateDetails?.role?.name || 'Subscriber',
   
    level:  candidateDetails?.level?.charAt(0).toUpperCase() + candidateDetails?.level?.slice(1) || 'Basic',
    state: candidateDetails?.state?.name || 'France',
    city: candidateDetails?.city?.name || 'Unknown',
    image: candidateDetails?.image || null,
    resume: candidateDetails?.resume || null
  }

  const handleCancel = () => router.push('/apps/candidate/list')

  const handleSendMail = async () => {
    const mailParams = { candidate_id: id }

    try {
      const response = await apiService.post(`/users/send-email`, mailParams, true)
      toast.success(response?.data?.message || 'Email sent successfully')
      dispatch(setButtonsDisabled(true))
    } catch (error) {
      toast.error('Failed to send email')
      dispatch(setButtonsDisabled(false))
    }
  }

  const resumeDownload = async () => {
    try {
      const token = Cookies.get('userAuthToken')
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${BASE_URL}/users/download-resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Resume downloaded successfully')
    } catch (error) {
      toast.error('Failed to download resume')
    }
  }

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Top Bar */}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' fontWeight={600}>
            Candidate Profile
          </Typography>
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

        {/* Profile Header */}
        <Box display='flex' flexDirection='column' alignItems='center' textAlign='center' gap={2}>
          <img
            alt='user-profile'
            src={userData.image ?? '/images/avatars/1.png'}
            className='rounded-full'
            width={120}
            height={120}
            crossOrigin='anonymous'
          />

          <Typography variant='h6'>{`${userData.firstName} ${userData.lastName}`}</Typography>
          <Chip label={userData.role} color='primary' variant='filled' size='small' />
        </Box>

        {/* Stats Section */}
        {!isAdmin && (
          <Box display='flex' justifyContent='space-around' flexWrap='wrap' gap={4} sx={{ mt: 2, mb: 2 }}>
            <Box textAlign='center'>
              <Tooltip title='Result'>
                <CustomAvatar variant='rounded' color='success' skin='light'>
                  <i className='ri-check-line' />
                </CustomAvatar>
              </Tooltip>
              <Typography variant='h6' mt={1}>
                0%
              </Typography>
              <Typography variant='body2'>Result</Typography>
            </Box>
            <Box textAlign='center'>
              <Tooltip title='Total Assessment'>
                <CustomAvatar variant='rounded' color='info' skin='light'>
                  <i className='ri-briefcase-line' />
                </CustomAvatar>
              </Tooltip>
              <Typography variant='h6' mt={1}>
                {totalAssignedTest}
              </Typography>
              <Typography variant='body2'>Total</Typography>
            </Box>
          </Box>
        )}

        {/* Details Section */}
        <Box>
          <Typography variant='subtitle1' fontWeight={600}>
            Candidate Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1.2}>
            <Typography>
              <strong>Email:</strong> {userData.billingEmail}
            </Typography>
            <Typography>
              <strong>Status:</strong> {userData.status}
            </Typography>
            {!isAdmin && (
              <Typography>
                <strong>Level:</strong> {userData.level}
              </Typography>
            )}
            <Typography>
              <strong>Locality:</strong> {userData.state}, {userData.city}
            </Typography>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box display='flex' justifyContent='center' flexWrap='wrap' gap={2} mt={2}>
          {!isAdmin && userData.resume && (
            <Tooltip title='Download Resume'>
              <IconButton
                color='success'
                onClick={resumeDownload}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'success.main',
                  color: 'success.contrastText',
                  '&:hover': {
                    backgroundColor: 'success.dark',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <DownloadRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isButtonsDisabled && (
            <Tooltip title='Send Email to Candidate'>
              <IconButton
                color='primary'
                disabled={isButtonsDisabled}
                onClick={handleSendMail}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.1)'
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabled',
                    color: 'action.disabled'
                  }
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {isButtonsDisabled && (
            <Tooltip title='ReSend Email to Candidate'>
              <IconButton
                color='primary'
                onClick={handleSendMail}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.1)'
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabled',
                    color: 'action.disabled'
                  }
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title='Edit Candidate Info'>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={{
                color: 'warning',
                disabled: isButtonsDisabled,
                title: 'Edit Candidate Info',
                sx: {
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'warning.main',
                  color: 'warning.contrastText',
                  '&:hover': {
                    backgroundColor: 'warning.dark',
                    transform: 'scale(1.1)'
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabled',
                    color: 'action.disabled'
                  }
                },
                children: <EditRoundedIcon />
              }}
              dialog={EditUserInfo}
              dialogProps={{
                data: userData,
                id,
                onSave: () => id && dispatch(getCandidateManageDetail(id))
              }}
            />
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserDetails
