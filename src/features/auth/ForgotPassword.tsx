'use client'

// Next Imports
import { useState, useEffect } from 'react'

import Link from 'next/link'

import { useParams, useRouter } from 'next/navigation'

import * as yup from 'yup'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { getCookie } from 'cookies-next'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'

// Type Imports
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'

import { toast } from 'react-toastify'

import type { Mode } from '@core/types'
import type { Locale } from '@config/i18n'

// Component Imports
import Form from '@shared/components/Form'
import DirectionalIcon from '@shared/components/DirectionalIcon'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { getLocalizedUrl } from '@shared/utils/i18n'
import { forgotWithEmail } from '@store/slices/userSlice'

type ErrorType = {
  message: string[]
}
type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address'))
})

const ForgotPasswordV1 = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/auth-v1-mask-4-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-4-light.png'
  const [loading, setLoading] = useState(true)

  // const isLoading = useSelector(getuserLoader)
  const [isDisable, setDisable] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

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

  const onSubmit = async (data: { email: string }) => {
    try {
      setDisable(true)
      await dispatch(forgotWithEmail(data))
        .then((response: any) => {
          // if (response?.error)toast.error("The selected email is invalid. Please try again.");
          if (response.payload.success) {
            toast.success('Password reset email sent successfully!')
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
        setDisable(false)
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
          <Typography variant='h4'>Forgot Password 🔒</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>
              Enter your email and we&#39;ll send you instructions to reset your password
            </Typography>

            <Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col gap-5'>
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
              <Button fullWidth variant='contained' type='submit'>
                Send reset link
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
            </Form>
          </div>
        </CardContent>
      </Card>
      <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default ForgotPasswordV1
