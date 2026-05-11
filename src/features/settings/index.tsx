// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import { useEffect, useState, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@store'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { fetchSetting, getSettingList, updateSetting } from '@store/slices/settingSlice'
import { toast } from 'react-toastify'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

type tableData = { type: string; email: boolean; app: boolean }

type CardProps = {
  title: string
  data: tableData[]
}

// Vars
const customerData: tableData[] = [
  { type: 'Javascript', email: true, app: false },
  { type: 'Typescript', email: false, app: true },
  { type: 'SQL', email: false, app: false }
]

const TableCard = (props: CardProps) => {
  // Props
  const { title, data } = props
  const dispatch = useDispatch<AppDispatch>()
  const [settings, setSettings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLevels, setSelectedLevels] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    fetchData()
  }, [dispatch])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = {}

    await dispatch(fetchSetting(params))

    // setLoading(false);
  }

  const settingsManage = useSelector(getSettingList)

  useEffect(() => {
    if (settingsManage?.length) {
      setSettings(settingsManage)
      // Initialize selected levels to first level for each technology
      const initialLevels: { [key: number]: number } = {}
      settingsManage.forEach((_, index) => {
        initialLevels[index] = 0
      })
      setSelectedLevels(initialLevels)
    }
  }, [settingsManage])

  const handleInputChange = (techIndex: number, field: string, value: string) => {
    const levelIndex = selectedLevels[techIndex] || 0
    setSettings(prev =>
      prev.map((item, i) =>
        i === techIndex
          ? {
              ...item,
              levels: item.levels.map((level: any, li: number) =>
                li === levelIndex ? { ...level, [field]: value } : level
              )
            }
          : item
      )
    )
  }

  const handleSelectChange = (techIndex: number, levelName: string) => {
    const tech = settings[techIndex]
    const levelIndex = tech.levels.findIndex((level: any) => (level.name || level) === levelName)
    setSelectedLevels(prev => ({ ...prev, [techIndex]: levelIndex }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await dispatch(updateSetting(settings))

      if (response?.payload?.success) {
        toast.success('Settings updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='border rounded overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className='is-1/4'>Technology</th>
              <th className='is-1/4'>Level</th>
              <th className='is-1/4'>Set of Questions</th>
              <th className='is-1/4'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((data, index) => (
              <tr key={index}>
                <td className='text-textPrimary'>{data.technology}</td>
                <td className='text-textPrimary'>
                  <FormControl variant='filled' sx={{ minWidth: 150 }}>
                    <Select
                      value={
                        data.levels[selectedLevels[index] || 0]?.name || data.levels[selectedLevels[index] || 0] || ''
                      }
                      onChange={e => handleSelectChange(index, e.target.value)}
                    >
                      {data.levels.map((level: any, levelIndex: number) => (
                        <MenuItem key={levelIndex} value={level.name || level}>
                          {level.name.charAt(0).toUpperCase() + level.name.slice(1) || level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
                <td>
                  <input
                    type='text'
                    value={data.levels[selectedLevels[index] || 0]?.set_of_questions || ''}
                    onChange={e => handleInputChange(index, 'set_of_questions', e.target.value)}
                    placeholder='no. of questions'
                    className='w-20 p-1 text-sm border rounded'
                  />
                </td>
                <td>
                  <input
                    type='text'
                    value={data.levels[selectedLevels[index] || 0]?.duration || ''}
                    onChange={e => handleInputChange(index, 'duration', e.target.value)}
                    placeholder='Duration'
                    className='w-20 p-1 text-sm border rounded'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='p-3 flex justify-end'>
        <Button variant='contained' color='primary' onClick={handleSave} disabled={isLoading}>
          Submit
        </Button>
      </div>
    </div>
  )
}

const SettingsUpdate = () => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <TableCard title='Customer' data={customerData} />
      </CardContent>
    </Card>
  )
}

export default SettingsUpdate
