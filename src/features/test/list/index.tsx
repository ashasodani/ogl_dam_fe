// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@shared/types/apps/userTypes'

// Component Imports
import TestListTable from './TestListTable'

const TestList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TestListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default TestList
