'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const DonutChart = () => {
  return (
    <Card className='bs-full'>
      <CardContent className='pbe-0'>
        <div className='flex flex-wrap items-center gap-1'>
          <Typography variant='h5'>$27.9k</Typography>
          <Typography color='success.main'>+16%</Typography>
        </div>
        <Typography variant='subtitle1'>Total Growth</Typography>
        <Box className='flex items-center justify-center h-32'>
          <Typography variant='body2' color='text.secondary'>
            Chart placeholder - ApexCharts removed
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default DonutChart