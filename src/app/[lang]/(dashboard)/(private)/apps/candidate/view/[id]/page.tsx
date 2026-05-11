// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
// import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports

import CandidateLeftOverview from '@/features/candidate/view/candidate-left-overview'

import CandidateRight from '@/features/candidate/view/candidate-right'
type Props = {
  params: { id: string }
}

// Data Imports
// import { getPricingData } from '@/app/server/actions'





const UserViewTab = async ({ params }: Props) => {
   const id =  params.id
   
  
  // Vars
//   const data = await getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 5, md: 5 }}>
        <CandidateLeftOverview id={id} />
      </Grid>
      <Grid size={{ xs: 12, lg: 7, md: 7 }}>
        <CandidateRight id={id}/>
      </Grid>
    </Grid>
  )
}

export default UserViewTab
