// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CompanyListTable from './CompanyListTable'

const UserList = ({ companyData }: { companyData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CompanyListTable tableData={companyData} />
      </Grid>
    </Grid>
  )
}

export default UserList
