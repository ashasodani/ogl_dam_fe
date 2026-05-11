// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import DirectoryListTable from './DirectoryListTable'

const UserList = ({ companyData }: { companyData?: UsersType[] }) => {
  return (
    <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
      <Grid size={{ xs: 12, md: 10, lg: 9 }}>
        <DirectoryListTable />
      </Grid>
    </Grid>
  )
}

export default UserList
