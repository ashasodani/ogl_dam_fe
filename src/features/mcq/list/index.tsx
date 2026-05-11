// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@shared/types/apps/userTypes'

// Component Imports
import McqListTable from './McqListTable'

const TestList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <McqListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default TestList
