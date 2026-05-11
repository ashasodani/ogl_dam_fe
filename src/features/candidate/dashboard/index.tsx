'use client'

import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'


import { Box, Container, Typography, Card, CardContent, Grid, Button, Avatar, Chip } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'



import type { AppDispatch } from '@store'

import {
  getCandidateDashboardManage,
  getCandidateDashboardManageList,
  getCandidateDashboardManageLoader,
  getCandidateDashboardUserList,
  deleteCandidateDashboardManage
} from '@store/slices/candidateDashboardSlice'

import { toast } from 'react-toastify'
import CustomAvatar from '@/core/components/mui/Avatar'
import { login } from '@/store/slices/loginSlice'
import { deleteCookie, setCookie } from 'cookies-next'

const CandidateDashboard = ({ token }: { token: string }) => {
  const [userData, setUserData] = useState<any>(null)
  const [loginToken, setLoginToken] = useState<any>(null)
  const [candidateDashboardManageList, setCandidate] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const candidateDashboardManage = useSelector(getCandidateDashboardManageList)
  const candidateDashboardUser = useSelector(getCandidateDashboardUserList)

  const candidateDashboardLoader = useSelector(getCandidateDashboardManageLoader)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage on client-side only
    if(token) {
      deleteCookie('userAuthToken')
      setCookie('userAuthToken', token || '')
    }
   
    
    // Remove token from URL query string
    // if (token) {
    //   router.replace('/en/candidate-dashboard', undefined, { shallow: true })
    // }
   
    const user = localStorage.getItem('user')
    setUserData(user ? JSON.parse(user) : null)
    fetchData()
  }, [dispatch, token, router])

  const fetchData = async (page = 1, perPage = 10) => {
    // setLoading(true);
    const params = { sort_by: 'position', sort_order: 'asc', page, per_page: perPage}

    await dispatch(getCandidateDashboardManage(params))

    // setLoading(false);
  }

  useEffect(() => {
    setFilteredData(candidateDashboardManage || [])
  }, [candidateDashboardManage])

   useEffect(() => {
    if (candidateDashboardUser) {
      setUserData(candidateDashboardUser)
      localStorage.setItem('user', JSON.stringify(candidateDashboardUser))
    }
  }, [candidateDashboardUser])
  console.log('candidateDashboardUser',candidateDashboardUser);
  
  // Add hook to get and store user data
  // const useLoggedInUser = () => {
  //   const [user, setUser] = useState(null)

  //   useEffect(() => {
  //     const loggedInUser = getLoggedInUser()

  //     setUser(loggedInUser)
  //   }, [])

  //   return user
  // }

  const candidateData = {
    name: userData?.first_name || 'John Doe',
    email: userData?.email || 'john.doe@example.com',
    completedTests: 0,
    pendingTests: 2,
    totalScore: 85
  }

  const [tests] = useState([
    { id: 1, name: 'JavaScript Basics', status: 'completed', score: 90, duration: '30 min' },
    { id: 2, name: 'React Fundamentals', status: 'completed', score: 85, duration: '45 min' },
    { id: 3, name: 'Node.js Advanced', status: 'pending', score: null, duration: '60 min' },
    { id: 4, name: 'Database Design', status: 'pending', score: null, duration: '40 min' }
  ])

   

  const handleStartTest = () => {
    // Enter fullscreen mode
    //  const doc = document
    // const docEl = document.documentElement

    // if (!doc.fullscreenElement) {
    //   docEl.requestFullscreen().catch(err => {
    //     console.error(`Error attempting fullscreen: ${err.message}`)
    //   })
    // } else {
    //   doc.exitFullscreen()
    // }
    
    router.push(`/coding-test`)
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth='lg'>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' component='h1' gutterBottom>
            Candidate Dashboard
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Welcome, {candidateData.name}
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <CustomAvatar sx={{ width: 50, height: 50 }} color='primary'>
                {candidateData.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </CustomAvatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant='h5'>{candidateData.name}</Typography>
                <Typography color='text.secondary'>{candidateData.email}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
               <Button  onClick={() => handleStartTest()} variant='contained' sx={{ mt: 1, float: 'right' }}>
                        Start Test
                      </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h3' color='success.main'>
                  {candidateData.completedTests}
                </Typography>
                <Typography variant='h6'>Completed Tests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h3' color='warning.main'>
                 {candidateDashboardManage.length}
                </Typography>
                <Typography variant='h6'>Pending Tests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h3' color='info.main'>
                  {candidateDashboardManage.length}
                </Typography>
                <Typography variant='h6'>Total Assigned</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant='h5' gutterBottom>
              Your Tests
            </Typography>
            <Grid container spacing={3}>
              {candidateDashboardManage?.map(test => (
                <Grid item xs={12} md={12} key={test.assessment.id}>
                  <Card variant='outlined'>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant='h6'>{test.assessment.test_name}</Typography>
                         <Typography color='text.secondary' gutterBottom>
                        Duration: {test.assessment.duration}
                      </Typography>
                        {/* <Chip
                          label={test.status} 
                          color={test.status === 'completed' ? 'success' : 'warning'}
                          size='small'
                        /> */}
                      </Box>
                     
                      {test.score && (
                        <Typography variant='h6' color='primary' gutterBottom>
                          Score: {test.score}%
                        </Typography>
                      )}

                      <Chip label={test.assessment.technology.name} color='primary' size='small' />
                      {/* <Chip
                        variant='tonal'
                        label={test.assessment.level}
                        color={
                          test.assessment.level === 'medium'
                            ? 'warning'
                            : test.assessment.level === 'hard'
                              ? 'error'
                              : 'success'
                        }
                        size='small'
                      /> */}
                      {/* <Button onClick={() => handleStartTest(test.assessment.id)} variant={test.status === 'pending' ? 'contained' : 'outlined'} sx={{ mt: 1, float: 'right' }}>
                        {test.status === 'pending' ? 'Start Test' : 'View Results'}
                      </Button> */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default CandidateDashboard
