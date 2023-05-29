'use client'

import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'

import Input from '@/app/components/inputs/Input'
import Button from '@/app/components/Button'
import AuthSocialButton from './AuthSocialButton'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'

type AuthFormProps = {}

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm: React.FC<AuthFormProps> = ({}) => {
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .catch(() => toast.error('Something went wrong'))
        .finally(() => {
          setIsLoading(false)
        })
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials')
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Logged in')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials')
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })

    signIn()
  }

  return (
    <div>
      <div
        className='
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        '
      >
        <div
          className='
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
            '
        >
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {variant === 'REGISTER' && (
              <Input
                id='name'
                errors={errors}
                label='Name'
                register={register}
                disabled={isLoading}
              />
            )}
            <Input
              id='email'
              errors={errors}
              label='Email Address'
              type='email'
              register={register}
              disabled={isLoading}
            />

            <Input
              id='password'
              type='password'
              errors={errors}
              label='Password'
              register={register}
              disabled={isLoading}
            />
            <div>
              <Button disabled={isLoading} fullWidth type='submit'>
                {variant === 'LOGIN' ? 'Sign in' : 'Register'}
              </Button>
            </div>
          </form>
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>
            <div className='mt-6 flex gap-2'>
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => {
                  socialAction('github')
                }}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => {
                  socialAction('github')
                }}
              />
            </div>
            <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
              <div>
                {variant === 'LOGIN'
                  ? 'New to Messenger?'
                  : 'Already have an account?'}
              </div>
              <div onClick={toggleVariant} className='underline cursor-pointer'>
                {variant === 'LOGIN' ? 'Create an account' : 'Login'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
