'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const ChartPlaceholder = () => {
  return (
    <Card className='bs-full'>
      <CardContent>
        <Typography variant='h6' className='mbe-2'>Chart Component</Typography>
        <Box className='flex items-center justify-center h-32'>
          <Typography variant='body2' color='text.secondary'>
            Chart placeholder - ApexCharts removed
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ChartPlaceholder
