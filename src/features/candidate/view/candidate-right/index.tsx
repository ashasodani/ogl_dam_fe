'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { SyntheticEvent } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import {
  DragIndicator as DragIndicatorIcon,
  AddCircleOutlineRounded as AddCircleRoundedIcon,
  DeleteOutlineRounded as DeleteOutlineRoundedIcon,
  SaveRounded as SaveRoundedIcon
} from '@mui/icons-material'
import { Tooltip } from '@mui/material'

import { apiService } from '@shared/services/apiService'

import { toast } from 'react-toastify'

import LoadingScreen from '@shared/components/LoadingScreen'

import type { ThemeColor } from '@core/types'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

import {
  getCandidateManageDetail,
  getCandidateManagesDetail,
  getCandidateManageLoader,
  getButtonsDisabled,
  setTotalAssignedTest,
  getTotalAssignedTest
} from '@store/slices/candidateSlice'
import type { AppDispatch } from '@/store'
import AddTest from '@shared/components/dialogs/add-new-test'
import OpenDialogOnElementClick from '@shared/components/dialogs/OpenDialogOnElementClick'




const userData = {
  firstName: 'Seth',
  lastName: 'Hallam',
  userName: '@shallamb',
  billingEmail: 'shallamb@gmail.com',
  status: 'active',
  role: 'Subscriber',
  taxId: 'Tax-8894',
  contact: '+1 (234) 464-0600',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true
}

const CandidateRight = ({ id }: { id?: string | null }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [candidate_is_email, setEmail] = useState<boolean>(false)
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      dispatch(getCandidateManageDetail(id))
    }
  }, [id, dispatch])

  const candidateDetails = useSelector(getCandidateManagesDetail)
  const candidateLoader = useSelector(getCandidateManageLoader)
  const isButtonsDisabled = useSelector(getButtonsDisabled)
 
  const connectedAccountsArr = candidateDetails?.assigned_assessments || []
  const is_candidate_email = candidateDetails?.is_email || false

  useEffect(() => {
    setAssessments(connectedAccountsArr)
    setEmail(candidateDetails?.is_email)

    if (candidateDetails?.role?.name === 'Admin') {
      setIsAdmin(true)
    }
  }, [connectedAccountsArr])

  useEffect(() => {
    // Update total assigned tests when assessments change
    dispatch(setTotalAssignedTest(assessments.length))
  }, [assessments, dispatch])



  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isButtonsDisabled) {
      setIsDragging(false)
    } else {
      setIsDragging(true)
      setDraggedIndex(index)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setIsDragging(false)

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newAssessments = [...assessments]
    const [draggedItem] = newAssessments.splice(draggedIndex, 1)

    newAssessments.splice(dropIndex, 0, draggedItem)

    setAssessments(newAssessments)
    setDraggedIndex(null)
    setShowSaveButton(true)
  }

  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  const handleDelete = async (assessment_id: number) => {
    setSelectedId(assessment_id)
    setOpenDeleteDialog(true)
  }
  const handleConfirmDelete = async () => {
    if (selectedId) {
      // Filter out the deleted assessment
      const updatedAssessments = assessments.filter(item => item.assessment_id !== selectedId)

      // Update the state with filtered assessments
      setAssessments(updatedAssessments)

      // Create position updates for remaining assessments with new indices
      const positionUpdates = updatedAssessments.map((item, index) => ({
        test_id: item.assessment_id,
        position: index + 1
      }))

      const positionParams = {
        tests: positionUpdates
      }

      try {
        // Delete the assessment
        const params = {
          assessment_id: selectedId
        }
        await apiService.put(`users/delete-assign-test`, id, params, true)

        // Update positions for remaining assessments
        try {
            await apiService.put(`assign-test/position`, id, positionParams, true)
            toast.success('Assessment removed and positions updated')
          } catch (error) {
            toast.error('Failed to update position')
          }
        
        // Update total assigned tests after successful deletion
        dispatch(setTotalAssignedTest(updatedAssessments.length))
        setOpenDeleteDialog(false)
        setSelectedId(null)
      } catch (error) {
        // Revert to original assessments if error
        setAssessments(connectedAccountsArr)
        toast.error('Failed to remove assessment')
      }
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  // Update handleConfirmDelete to call handleDelete
  // const handleConfirmDelete = (assessment_id: string) => {
  //   if (confirm('Are you sure you want to unassign this test?')) {
  //     handleDelete(assessment_id)
  //   }
  // }

  const handleSave = async () => {
    const positionUpdates = assessments.map((item, index) => ({
      test_id: item.assessment_id,
      position: index + 1
    }))

    const positionParams = {
      tests: positionUpdates
    }

    try {
      await apiService.put(`assign-test/position`, id, positionParams, true)
      toast.success('Assessment positions updated')
      setShowSaveButton(false)
    } catch (error) {
      setAssessments(connectedAccountsArr)
      toast.error('Failed to update positions')
    }
  }

  if (candidateLoader) {
    return <LoadingScreen message='Loading candidates...' />
  }

  if (!isAdmin) {
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
            <Card>
              <div className='flex justify-between items-center px-6 py-4'>
                <CardHeader 
                  title='Candidate Test List' 
                  subheader='Display content from assigned test for candidate'
                  sx={{ p: 0 }}
                />
                <div className='flex items-center'>
                  <Tooltip title='Add Test'>
                    <OpenDialogOnElementClick
                      element={IconButton}
                      elementProps={{
                        color: 'primary',
                        disabled: isButtonsDisabled,
                        sx: {
                          p: 2.5,
                          borderRadius: 3,
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark'
                          }
                        },
                        children: <AddCircleRoundedIcon />
                      }}
                      dialog={AddTest}
                      dialogProps={{ data: userData, id: id }}
                    />
                  </Tooltip>
                </div>
              </div>{' '}
              <CardContent>
                <div className='flex flex-col gap-4'>
                  {assessments.map((item, index) => (
                    <div
                      key={item.assessment_id || index}
                      draggable={!candidate_is_email}
                      onDragStart={e => handleDragStart(e, index)}
                      onDragOver={e => (candidate_is_email ? null : e.preventDefault())}
                      onDrop={e => (candidate_is_email ? null : handleDrop(e, index))}
                      className={`flex items-center justify-between p-4 rounded border ${!candidate_is_email ? 'cursor-move' : ''} ${
                        isDragging && draggedIndex === index ? 'opacity-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center gap-4'>
                        <DragIndicatorIcon className='text-gray-400' />
                        <Typography variant='body1' className='font-medium'>
                          {index + 1}.
                        </Typography>
                        <Typography>{item?.test_name}</Typography>
                      </div>

                      <div className='flex items-center gap-4'>
                        <Chip variant='tonal' label={item?.technology_name} color='success' size='small' />
                        <Chip
                          variant='tonal'
                          label={item?.level}
                          color={item?.level === 'medium' ? 'warning' : item?.level === 'hard' ? 'error' : 'success'}
                          size='small'
                        />
                        <Chip variant='tonal' label={item?.duration} color='primary' size='small' />{' '}
                        {!isButtonsDisabled && (
                          <Tooltip title='Delete Assessment'>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleDelete(item.assessment_id)}
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                '&:hover': {
                                  backgroundColor: 'error.light',
                                  color: 'error.contrastText'
                                }
                              }}
                            >
                              <DeleteOutlineRoundedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                  {showSaveButton && (
                    <div className='flex justify-center'>
                      <Tooltip title='Save Changes'>
                        <IconButton
                          color='success'
                          onClick={handleSave}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'success.main',
                            color: 'success.contrastText',
                            '&:hover': {
                              backgroundColor: 'success.dark',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <SaveRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    )
  }
}

export default CandidateRight
