// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
// import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports

import MCQTestView from '@/features/mcq/view'
type Props = {
  params: { id: string }
}

// Data Imports
// import { getPricingData } from '@/app/server/actions'

const McqViewTab = async ({ params }: Props) => {
  const id = params.id

  // Vars
  //   const data = await getPricingData()

  return <MCQTestView id={id} />
}

export default McqViewTab
