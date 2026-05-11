// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid2'

import { useEffect, useState, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@store'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { fetchTechnology, getTechnologyList, createTechnology, deleteTechnology } from '@store/slices/technologySlice'
import { toast } from 'react-toastify'
import { TextField } from '@mui/material'

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
  const [open, setOpen] = useState(false)
  const [technologyName, setTechnologyName] = useState('')
  const [error, setError] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [dispatch])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = {}

    await dispatch(fetchTechnology(params))

    // setLoading(false);
  }

  const settingsManage = useSelector(getTechnologyList)

  useEffect(() => {
    if (settingsManage?.length) {
      setSettings(settingsManage)
    }
  }, [settingsManage])

  const handleClickOpen = () => {
    setOpen(true)
    setTechnologyName('')
    setError('')
  }

  /**
   * Close the create technology dialog and reset the state
   */
  const handleClose = () => {
    setOpen(false)
    setTechnologyName('')
    setError('')
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  const handleSave = async () => {
    if (!technologyName.trim()) {
      setError('Technology name is required')
      return
    }

    try {
      setIsLoading(true)
      const response = await dispatch(createTechnology({ name: technologyName }))
       if (response?.payload?.success) {
       toast.success('Technology created successfully')
      }else if (!response?.status) {
       toast.error(response.error.message)
      }
      
      
      handleClose()
      fetchData()
    } catch (error) {
      toast.error('Failed to create technology')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        const res = await dispatch(deleteTechnology(selectedId) as any)

        // if (labelsList.data.length === 1 && page > 1) {
        //   setPage(1);
        // }

        if (res.payload?.status_code === 200) {
          toast.success(res.payload?.message ?? 'Tag Deleted Successfully')
          fetchData()
        } //else if (res.error) {toast.error(res.error?.message ?? "Network response was not ok");

        if(res.error){
           toast.error(res.error?.message ?? "Network response was not ok");
        }
      } finally {
        setOpenDeleteDialog(false)
        setSelectedId(null)
      }
      console.log('Deleting user with ID:', selectedId)
    }
  }

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
     <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-end mb-4'>
          <Button variant='contained' color='primary' onClick={handleClickOpen}>
            Add New Technology
          </Button>
        </div>
        <div className='border rounded overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th className='w-2/4'>Technology</th>
                <th className='w-2/4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((data, index) => (
                <tr key={index}>
                  <td className='text-textPrimary w-3/4'>{data.name}</td>
                  <td className='w-1/4'>
                    <IconButton size='small' onClick={() => handleDeleteClick(data.id)}>
                      <i className='ri-delete-bin-7-line text-red-500' />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        

        <div className='p-4'></div>
      </div>
      </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Technology</DialogTitle>
          <DialogContent>
            <TextField
              label='Technology Name'
              variant='outlined'
              fullWidth
              margin='normal'
              value={technologyName}
              onChange={e => setTechnologyName(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant='contained' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
    </>
  )
}

const TechnologyAdd = () => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <TableCard title='Customer' data={customerData} />
      </CardContent>
    </Card>
  )
}

export default TechnologyAdd
