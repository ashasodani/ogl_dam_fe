'use client'

import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material'

const CandidateHeader = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TrooAssess Pro
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit">My Tests</Button>
          <Button color="inherit">Results</Button>
          <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
          <Button color="inherit">Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default CandidateHeader