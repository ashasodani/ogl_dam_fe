"use client";

import Grid from '@mui/material/Grid2'


import {
  Box,
  Typography,
  Chip,
  Paper,
  useTheme
} from '@mui/material'
import {
  QuizRounded as QuizIcon,
  NavigateNextRounded as NextIcon,
  NavigateBeforeRounded as PrevIcon,
  AccessTimeRounded as TimeIcon
} from '@mui/icons-material'

import DirectionalIcon from '@shared/components/DirectionalIcon'



export default function Duration({ testData, timeRemaining}: any) {
     const theme = useTheme()

      const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

    return (<>
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
                  sx={{ color: 'white', opacity: 0.9 }}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <Typography
                sx={{ color: 'white', opacity: 0.9 }}
                variant='body2'
              >
                Duration: {testData.duration}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>);
}
