'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

// Store Imports
import { createRole, getPermissionGroup } from '@/store/slices/roleSlice'
import type { AppDispatch } from '@/store'

type Permission = {
  id: number
  name: string
}

type PermissionGroup = {
  module: string
  permissions: Permission[]
}

const CreateRole = () => {
  // Hooks
  const router = useRouter()
  const { lang: locale } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  // Selectors
  const { roleDetail: permissionsData, loading: storeLoading } = useSelector((state: any) => state.role)

  // States
  const [roleName, setRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch permissions on mount
  useEffect(() => {
    dispatch(getPermissionGroup())
  }, [dispatch])

  // Handlers
  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleGroupChange = (group: PermissionGroup) => {
    const groupPermissionIds = group.permissions.map(p => p.id)
    const allSelected = groupPermissionIds.every(id => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !groupPermissionIds.includes(id)))
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...groupPermissionIds])])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roleName.trim()) {
      toast.error('Please enter a role name')
      return
    }

    if (selectedPermissions.length === 0) {
      toast.error('Please select at least one permission')
      return
    }

    setLoading(true)

    try {
      const response = await dispatch(
        createRole({
          name: roleName,
          permissions: selectedPermissions
        })
      ).unwrap()

      if (response.status) {
        toast.success('Role created successfully')
        setRoleName('')
        setSelectedPermissions([])
        router.push(`/${locale}/apps/roles`)
      } else {
        toast.error(response.message || 'Failed to create role')
      }
    } catch (error: any) {
      console.error('Error creating role:', error)
      toast.error(error.message || 'An error occurred while creating the role')
    } finally {
      setLoading(false)
    }
  }

  if (storeLoading && permissionsData.length === 0) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Typography variant='h4'>Create Role</Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label='Role Name*'
                  placeholder='Enter Role Name'
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                />
              </Grid>

              {permissionsData.map((group: PermissionGroup, index: number) => (
                <Grid size={{ xs: 12 }} key={group.module}>
                  {index !== 0 && <Divider className='mbe-6' />}
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={group.permissions.every(p => selectedPermissions.includes(p.id))}
                            indeterminate={
                              group.permissions.some(p => selectedPermissions.includes(p.id)) &&
                              !group.permissions.every(p => selectedPermissions.includes(p.id))
                            }
                            onChange={() => handleGroupChange(group)}
                          />
                        }
                        label={
                          <Typography variant='h5' className='font-medium'>
                            {group.module}
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Grid container spacing={2}>
                        {group.permissions.map(permission => (
                          <Grid size={{ xs: 12, sm: 6 }} key={permission.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedPermissions.includes(permission.id)}
                                  onChange={() => handlePermissionChange(permission.id)}
                                />
                              }
                              label={permission.name}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
                <Button
                  variant='outlined'
                  color='secondary'
                  type='reset'
                  onClick={() => {
                    setRoleName('')
                    setSelectedPermissions([])
                  }}
                >
                  Reset
                </Button>
                <Button variant='contained' type='submit' disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRole
