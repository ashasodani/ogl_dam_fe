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
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import type { InferInput } from 'valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { getCookie } from 'cookies-next'
import { useSelector, useDispatch } from 'react-redux'

import type { AppDispatch } from '@/store'
import { toast } from 'react-toastify'

// Type Imports
import type { Mode } from '@core/types'
import type { Locale } from '@config/i18n'
import { getuserLoader, login, loginPayload, setLoaderOff } from '@store/slices/loginSlice'

// Component Imports

// Config Imports
import themeConfig from '@config/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { getLocalizedUrl } from '@shared/utils/i18n'

type ErrorType = {
  message: string[]
}
type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const LoginV1 = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-1-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-1-light.png'

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const userLoader = useSelector(getuserLoader)
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   const userAuthorized = getCookie('isUserAuthenticated')

  //   if (!userAuthorized) setLoading(false)
  //   else if (userAuthorized) {
  //     const redirectURL = searchParams.get('redirectTo') ?? '/'

  //     router.replace(getLocalizedUrl(redirectURL, locale as Locale))
  //   }
  // }, [userLoader])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema)

    // defaultValues: {
    //   email: 'admin@materialize.com',
    //   password: 'admin'
    // }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true)
    
    dispatch(login(data))
      .then((response: any) => {
        if (response?.payload?.success) {
          const user = JSON.stringify({ user: { name: '', email: '', image: '' }, expires: '' })
          
          sessionStorage.setItem('user', user)
          const redirectURL = '/apps/candidate/list'
          
          router.replace(getLocalizedUrl(redirectURL, locale as Locale))
        } else {
          toast.error(response?.error?.message)
          setIsLoading(false)
        }
      })
      .catch((error: any) => {
        setIsLoading(false)

        try {
           debugger;
          error = JSON.parse(error)
        } catch {
           debugger;
          error = { message: [error] }
        }
         debugger;
        setErrorState(error)
      })

    // const res = await signIn('credentials', {
    //   email: data.email,
    //   password: data.password,
    //   redirect: false
    // })

    //console.log('🚀 ~ onSubmit ~ res:', res)

    // if (res && res.ok && res.error === null) {
    //   // Vars
    //   const redirectURL = searchParams.get('redirectTo') ?? '/'

    //   router.replace(getLocalizedUrl(redirectURL, locale as Locale))
    // } else {
    //   // ...existing code...
    //   if (res?.error) {
    //     let error: ErrorType

    //     try {
    //       error = JSON.parse(res.error)
    //     } catch {
    //       error = { message: [res.error] }
    //     }

    //     setErrorState(error)
    //   }

    //   // ...existing code...
    // }
  }

  return (
    <div className='flex justify-center items-center min-bs-[100dvh] is-full relative p-6'>
      <Card className='flex flex-col sm:is-[460px]'>
        <CardContent className='p-6 sm:!p-12'>
          {/* <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link> */}
          <div className='flex flex-col gap-5'>
            <div>{/* <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography> */}</div>
            <form
              noValidate
              autoComplete='off'
              action={() => {}}
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
            >
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Email'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.email || errorState !== null) && {
                      error: true,
                      helperText: errors?.email?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    id='outlined-adornment-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
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
                    {...(errors.password && { error: true, helperText: errors.password.message })}
                  />
                )}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography
                  className='text-end'
                  color='primary.main'
                  component={Link}
                  href={getLocalizedUrl('/forgot-password', locale as Locale)}
                >
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Log In'}
              </Button>
              {/* <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography
                  component={Link}
                  href={getLocalizedUrl('/pages/auth/register-v1', locale as Locale)}
                  color='primary.main'
                >
                  Create an account
                </Typography>
              </div> */}
              {/* <Divider className='gap-3 text-textPrimary'>or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-textPrimary'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div> */}
            </form>
          </div>
        </CardContent>
      </Card>
      <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default LoginV1
