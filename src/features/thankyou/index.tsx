'use client'

import { useState, useEffect } from 'react'

import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, Typography, Button, Container, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const ThankUser: React.FC = () => {
  const theme = useTheme()
  const router = useRouter()
  const thankRedirect = () => {
    document.removeEventListener('contextmenu', e => e.preventDefault())
    document.removeEventListener('copy', e => e.preventDefault())
    document.removeEventListener('cut', e => e.preventDefault())
    document.removeEventListener('paste', e => e.preventDefault())
    document.removeEventListener('selectstart', e => e.preventDefault())
    router.push('/candidate-dashboard')
  }

  useEffect(() => {
    const disableDevTools = () => {
      // Disable right-click context menu
      document.removeEventListener('contextmenu', e => e.preventDefault())
      document.removeEventListener('copy', e => e.preventDefault())
      document.removeEventListener('cut', e => e.preventDefault())
      document.removeEventListener('paste', e => e.preventDefault())
      document.removeEventListener('selectstart', e => e.preventDefault())
    }
    disableDevTools()
  }, [])

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 64,
              color: theme.palette.success.main,
              mb: 2
            }}
          />
          <Typography variant='h4' component='h1' gutterBottom>
            Thank You!
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            Your test has been successfully submitted. We appreciate your time and effort.
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Our team will review your submission and get back to you soon.
          </Typography>
          <Button variant='contained' color='primary' onClick={() => thankRedirect()} sx={{ mt: 2 }}>
            Return to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default ThankUser
