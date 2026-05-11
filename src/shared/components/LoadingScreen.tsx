'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingScreen = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingScreen