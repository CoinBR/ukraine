import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ServiceResponse, AccessRequest, AccessResponse, SanitizedService } from '@/types'
import { ENV } from '@/env'

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchServices = async (): Promise<SanitizedService[]> => {
  try {
    const response: AxiosResponse<ServiceResponse> = await apiClient.get('/api/services')
    return response.data.services
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export const accessService = async (serviceName: string, code: string | null = null): Promise<AccessResponse> => {
  try {
    const payload: AccessRequest = { serviceName, code }
    const response = await apiClient.post('/api/access-service', payload)
    return response.data
  } catch (error: any) {
    console.error('Error accessing service:', error)

    if (error?.response?.data?.message) {
        return error.response.data
    }

    if (typeof error.response.data === 'string') {
      return {
        success: false,
        message: error.response.data
      }
    }

    return {
      success: false,
      message: 'Failed to connect to the server'
    }
  }
}

