import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useAxios } from './useAxios'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'
import { AuthTokens } from '~/api-services/types'

interface LoginForm {
  email: string | null
  password: string | null
  // token: string
}

interface SignUpForm {
  firstName: string | null
  lastName: string | null
  email: string | null
  password: string | null
}

interface LoginResponse {
  tokens: AuthTokens
  user: any
}

interface SignUpResponse {
  tokens: AuthTokens
  user: any
}

interface UseAuthReturn {
  login: () => Promise<LoginResponse>
  loginForm: LoginForm
  
  loginFormError: Record<string, any>
  loading: boolean
  logout: () => Promise<void>
  setLoginForm: React.Dispatch<React.SetStateAction<LoginForm>>
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const { authenticate, logout: authLogout } = useAuthenticationStore()

  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: null,
    password: null,
    // token: 'web_token'
  })
  const [loginFormError, setLoginFormError] = useState<Record<string, any>>({})
  const { $http } = useAxios()

  const login = useCallback(async (): Promise<LoginResponse> => {
    setLoading(true)
    try {
      const { data } = await $http.post('/auth/login', loginForm)

      if(data.mfaRequired){
        navigate({ to: '/auth/verify-mfa', search: { data: data } })

        return data
      }

      authenticate(data.data.tokens, data.data.user)
      navigate({ to: '/dashboard' })
      return data
    } catch (error: any) {
      if (error?.response && error?.response.status === 422) {
        setLoginFormError(error.response.data.errors)
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [loginForm])

  // const signUp = useCallback(async (): Promise<SignUpResponse> => {
  //   setLoading(true)
  //   try {
  //     const { data } = await $http.post('/auth/register', signUpForm)
  //     return data
  //   } catch (error: any) {
  //     throw error
  //   }
  // }, [signUpForm])

  const logout = useCallback(async () => {
    authLogout()
    Cookies.remove('active_role')
    navigate({ to: '/' })
  }, [authLogout, navigate])

  return {
    login,
    loginForm,
    loginFormError,
    loading,
    logout,
    setLoginForm
  }
}

