'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { getCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Type Imports
import { valibotResolver } from '@hookform/resolvers/valibot'

import type { InferInput } from 'valibot'

import { object, string, pipe, nonEmpty, minLength, forward, check } from 'valibot'

import type { Mode } from '@core/types'
import type { Locale } from '@config/i18n'

// Component Imports
import Logo from '@shared/components/layout/shared/Logo'
import DirectionalIcon from '@shared/components/DirectionalIcon'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { getLocalizedUrl } from '@shared/utils/i18n'
import { resetPassword } from '@store/slices/userSlice'

type ErrorType = {
  message: string[]
}
type FormData = InferInput<typeof schema>

const schema = pipe(
  object({
    password: pipe(
      string(),
      nonEmpty('This field is required'),
      minLength(8, 'Password must be at least 8 characters long')
    ),
    confirmPassword: pipe(
      string(),
      nonEmpty('This field is required'),
      minLength(8, 'Password must be at least 8 characters long')
    )
  }),
  forward(check(input => input.password === input.confirmPassword, 'Passwords do not match.'))
)

const ResetPasswordV1 = ({ mode }: { mode: Mode }) => {
  // States
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokens = searchParams.get('token')
  const email = searchParams.get('email')
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(true)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [token, setToken] = useState('')
  const [cpasswordVisible, setCPasswordVisible] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  useEffect(() => {
   setToken(tokens ?? '')
  }, [tokens])

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-3-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-3-light.png'

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  const onSubmit = async (data: {
    password: string
    confirmPassword: string
    email: string
    token: string
    c_password: string
  }) => {

    try {
    
      data.email = email
      data.token = tokens
      data.c_password = data.confirmPassword
      await dispatch(resetPassword(data))
        .then((response: any) => {
          // if (response?.error)toast.error("The selected email is invalid. Please try again.");
          if (response?.payload?.success) {
             toast.success('Password reset successfully!')
             router.push(getLocalizedUrl('/login', locale as Locale))
          }else{
            toast.error(response?.error?.message)
          }
        })
        .catch(error => {
          try {
            error = JSON.parse(error)
          } catch {
            error = { message: [error] }
          }

          setErrorState(error)
        })
    } catch (error) {
      try {
        error = JSON.parse(error)
      } catch {
        error = { message: [error] }
      }

      setErrorState(error)
    } finally {
      setTimeout(() => {
        //  setDisable(false)
      }, 5000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
      <Card className='flex flex-col sm:is-[460px]'>
        <CardContent className='p-6 sm:!p-12'>
          {/* <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link> */}
          <Typography variant='h4'>Reset Password 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              Your new password must be different from previously used passwords
            </Typography>
            <form
              noValidate
              action={() => {}}
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
            >
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Password'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.password || errorState !== null) && {
                      error: true,
                      helperText: errors?.password?.message || errorState?.message[0]
                    })}
                    type={isPasswordShown ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowPassword}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
              <Controller
                name='confirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Confirm Password'
                    type={isConfirmPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.confirmPassword || errorState !== null) && {
                      error: true,
                      helperText: errors?.confirmPassword?.message || errorState?.message[0]
                    })}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={e => e.preventDefault()}
                            >
                              <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
              <Button fullWidth variant='contained' type='submit'>
                Set New Password
              </Button>
              <Typography className='flex justify-center items-center' color='primary.main'>
                <Link href={getLocalizedUrl('/login', locale as Locale)} className='flex items-center gap-1.5'>
                  <DirectionalIcon
                    ltrIconClass='ri-arrow-left-s-line'
                    rtlIconClass='ri-arrow-right-s-line'
                    className='text-xl'
                  />
                  <span>Back to Login</span>
                </Link>
              </Typography>
            </form>
          </div>
        </CardContent>
      </Card>
      <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default ResetPasswordV1
