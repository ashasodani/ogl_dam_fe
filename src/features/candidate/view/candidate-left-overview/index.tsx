// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserDetails from './UserDetails'



const UserLeftOverview = ({ id }: { id?: string | null }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails id={id} />
      </Grid>
      
    </Grid>
  )
}

export default UserLeftOverview
