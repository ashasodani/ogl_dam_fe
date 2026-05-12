'use client'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios'
import axios from 'axios'
import { deleteCookie, getCookie } from 'cookies-next'
import { toast } from 'react-toastify'

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || ''

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  message_code: string
  status: boolean
  status_code: number
  errors?: any
  success?: boolean
  error_code?: number
}

export interface ApiService {
  get<T>(url: string, useAuth?: boolean, params?: any): Promise<ApiResponse<T>>
  post<T>(url: string, data: any, useAuth?: boolean): Promise<ApiResponse<T>>

  put<T>(url: string, id: any, data: any, useAuth?: boolean): Promise<ApiResponse<T>>
  patch<T>(url: string, id: any, data: any, useAuth?: boolean): Promise<ApiResponse<T>>
  delete<T>(url: string, id: any, useAuth?: boolean): Promise<ApiResponse<T>>
}
class AxiosApiService implements ApiService {
  private axiosInstance: AxiosInstance
  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl
    })

    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const headers = config.headers as AxiosHeaders

      if (headers.get('Use-Auth') === 'true') {
        const authHeader = this.getAuthHeader()

        headers.set('Authorization', authHeader.Authorization)
      }

      headers.delete('Use-Auth')

      return config
    })

    this.axiosInstance.interceptors.response.use(response => response, this.handleErrorResponse)
  }
  private getAuthHeader(): { Authorization: string } {
    const token = getCookie('userAuthToken')

    return { Authorization: token ? `Bearer ${token}` : '' }
  }
  async get<T>(url: string, useAuth: boolean = false, params?: any): Promise<ApiResponse<T>> {
    // const requestUrl = id ? `${url}/${id}` : url;
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, {
      params,
      headers: { 'Use-Auth': useAuth?.toString() ?? '' }
    })

    return this.handleSuccessResponse(response)
  }
  async post<T>(url: string, data: any, useAuth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, {
      headers: { 'Use-Auth': useAuth.toString() }

      // headers:{'Authorization', 'Basic ' + zendeskPass}
    })

    return this.handleSuccessResponse(response)
  }

  async put<T>(url: string, id: any, data: any, useAuth: boolean = false): Promise<ApiResponse<T>> {
    // const { id, ...body } = data; // remove id from payload
    const requestUrl = id ? `${url}/${id}` : url

    const response = await this.axiosInstance.put<ApiResponse<T>>(requestUrl, data, {
      headers: { 'Use-Auth': useAuth.toString() }
    })

    return this.handleSuccessResponse(response)
  }

  async patch<T>(url: string, id: any, data: any, useAuth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(`${url}${!id ? '' : '/' + id}`, data, {
      headers: { 'Use-Auth': useAuth.toString() }
    })

    return this.handleSuccessResponse(response)
  }

  async delete<T>(url: string, id: any, useAuth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(`${url}/${id}`, {
      headers: { 'Use-Auth': useAuth.toString() }
    })

    return this.handleSuccessResponse(response)
  }
  private handleSuccessResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    // if (response.config.baseURL == WS_S3_BUCKET_BASE_URL) {return response.data;}
    const { code, message, data, message_code, status, status_code, errors, success } = response.data

    // You can add any global success handling here if needed
    // For example, you might want to show a success toast for certain status codes
    // if (code === 200 || code === 201) { toast.success(message, { toastId: message }); }

    return {
      code,
      message,
      data,
      message_code,
      status,
      status_code,
      errors,
      success
    }
  }
  private handleErrorResponse(error: any): Promise<never> {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response

      const { code, message, data, errors, success, error_code, status_code } = error.response.data as ApiResponse<any>

      // ✅ STEP 1: Check if it's a PUBLIC page using current pathname
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

      const publicPaths = ['/portal'] // Add more if needed

      const isPublicPage = publicPaths.some(path => currentPath.startsWith(path))

      // ✅ STEP 2: Show error toast normally
      let errorMessage = ''

      if (typeof errors === 'string') {
        errorMessage = errors
      } else if (errors && typeof errors === 'object') {
        const messages = Object.values(errors).flat()

        errorMessage = messages.join(', ')
      } else if (typeof data === 'string' && data) {
        errorMessage = data
      } else if (message) {
        errorMessage = message
      }

      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error(error.response?.statusText || 'Network response was not ok')
      }

      // ✅ STEP 3: Handle 401/403 redirect ONLY if NOT a public page
      if ([401, 403].includes(error_code ?? status_code) && !isPublicPage) {
        const userAuthorized = getCookie('isUserAuthenticated')

        if (!!userAuthorized) {
          deleteCookie('userRole')
          deleteCookie('userAuthToken')
          deleteCookie('isUserAuthenticated')
          localStorage.removeItem('loginTime')
          localStorage.removeItem('customerDetails')
          window.location.href = '/login'
        }

        return Promise.reject({ code, message, data, errors, success })
      }

      if ([401, 403, 405].includes(status)) {
        deleteCookie('userRole')
        deleteCookie('userAuthToken')
        deleteCookie('isUserAuthenticated')
        localStorage.removeItem('loginTime')
        localStorage.removeItem('customerDetails')

        window.location.href = '/login'

        return Promise.reject(error)
      }

      // ✅ STEP 4: Normal rejection for public page or other status
      if (status === 422) {
        return Promise.reject({ code, message, data, errors, success })
      }

      return Promise.reject({ code, message, data, errors, success })
    }

    // Fallback for unexpected errors
    return Promise.reject({
      code: 500,
      message: 'An unexpected error occurred',
      data: error
    })
  }
}
export const apiService: ApiService = new AxiosApiService(BASE_URL)
