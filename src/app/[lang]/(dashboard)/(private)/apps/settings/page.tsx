'use client'

// Component Imports

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import SettingsUpdate from '@/features/settings'
import TechnologyList from '@/features/technology'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

const SettingsApp = () => {
   const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (

    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='icon tabs example'>
        <Tab value='1' label='Configration' icon={<i className='ri-ai-generate' />} />
        <Tab value='2' label='Technology' icon={<i className='ri-add-line' />} />
      
      </TabList>
      <TabPanel value='1'>
        <SettingsUpdate isEdit={false} />
      </TabPanel>
      <TabPanel value='2'>
        <Typography>
          <TechnologyList isEdit={false} />
        </Typography>
      </TabPanel>
      
    </TabContext>
  )
 
}

export default SettingsApp