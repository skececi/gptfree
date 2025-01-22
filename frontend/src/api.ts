// services/api.ts
import { IMessage } from './types'

const API_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

type ApiResponse<T> = {
  data?: T
  error?: string
}

export const api = {
  async getModels(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${API_BACKEND_URL}/models`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'Failed to fetch models' }
    }
  },

  async sendMessage(messages: IMessage[], model: string): Promise<ApiResponse<IMessage>> {
    try {
      const response = await fetch(`${API_BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, model })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'Failed to send message' }
    }
  },

  async nameThread(messages: IMessage[]): Promise<ApiResponse<{ content: string }>> {
    try {
      const response = await fetch(`${API_BACKEND_URL}/name-thread`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'Failed to name thread' }
    }
  }
}