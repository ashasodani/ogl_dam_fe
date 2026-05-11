'use client'

import { Box, Typography, Container } from '@mui/material'

const CandidateFooter = () => {
  return (
    <Box sx={{ bgcolor: 'grey.100', py: 2, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 TrooAssess Pro. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Need help? Contact support@trooassess.com
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default CandidateFooter