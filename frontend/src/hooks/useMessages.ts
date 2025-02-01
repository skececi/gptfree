import { useState } from 'react'
import { IMessage } from '../types'
import { api } from '../api'
import { useThread } from '../state/ThreadContext'

export function useMessages() {
  const { threads, activeThreadId, addMessageToThread, updateThread } = useThread()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentMessages = threads[activeThreadId]?.messages || []

  async function sendMessage(input: string, selectedModel: string) {
    const userMsg: IMessage = { role: 'user', content: input, model: selectedModel }
    addMessageToThread(userMsg)
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await api.sendMessage([...currentMessages, userMsg], selectedModel)
      if (error) throw new Error(error)
      
      if (data) {
        addMessageToThread({
          role: 'assistant',
          content: data.content,
          model: selectedModel
        })
        setIsLoading(false)

        if (threads[activeThreadId].title === "New Chat") {
          const { data: nameData, error: nameError } = await api.nameThread([
            ...currentMessages, 
            userMsg, 
            { role: 'assistant', content: data.content }
          ])
          
          if (nameError) throw new Error(nameError)
          if (nameData) {
            updateThread(activeThreadId, { title: nameData.content.trim() })
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error:', err)
    }
  }

  return {
    isLoading,
    error,
    sendMessage,
    currentMessages
  }
} 