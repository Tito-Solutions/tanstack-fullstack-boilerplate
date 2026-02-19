import axios, { AxiosInstance } from 'axios'
import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'

interface UseAxiosReturn {
  $http: AxiosInstance
  fetchData: <T>(url: string, params?: object) => Promise<T>
}

export const useAxios = (): UseAxiosReturn => {
  const navigate = useNavigate()
  const authStore = useAuthenticationStore()

  const $http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  // Add a request interceptor
  $http.interceptors.request.use(
    function (config) {
      const token = authStore.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  $http.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error && error.response && error.response.status === 401) {
        authStore.logout()
        navigate({ to: '/auth/signin' })
      }
      return Promise.reject(error)
    }
  )

  const fetchData = useCallback(<T,>(url: string, params?: object): Promise<T> => {
    return new Promise((resolve, reject) => {
      $http
        .get(url, {
          params
        })
        .then((data) => {
          if (data.data && data.data.data) {
            resolve(data.data.data)
          } else {
            resolve(data.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }, [$http])

  return {
    $http,
    fetchData
  }
}

