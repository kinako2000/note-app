import { useState, FormEvent } from 'react'
import {  BadgeCheckIcon, ShieldCheckIcon } from '@heroicons/react/solid'
import { useMutateAuth } from '../hooks/useMutateAuth'
import type { NextPage } from 'next'
import Layout from '../components/Layout'

const Auth: NextPage = () => {
  const [isLogin, setLogin] = useState(true)
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      await loginMutation.mutateAsync()
    } else {
      await registerMutation.mutateAsync()
    }
  }
  return(
    <Layout title='Auth'>
      <ShieldCheckIcon className='w-12 h-12 mb-6 text-pink-500'/>
      <form onSubmit={ handleSubmit }>
        <div>
          <input type="text"
                required
                className='my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none'
                placeholder='Email'
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
          />
        </div>
        <div>
          <input type="password"
                required
                className='my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none'
                placeholder='Password'
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
          />
        </div>
        <div>
          <span
            onClick={() => setLogin(!isLogin) }
            className='font-medium cursor-pointer hover:text-indigo-500'
          >
              change mode?
          </span>
          <button
              type='submit'
              className='group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none ' >
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <BadgeCheckIcon className='w-5 h-5 '/>
                </span>
              { isLogin ? 'Login' : 'Register' }
          </button>
        </div>
      </form>
    </Layout>
  )
}
export default Auth