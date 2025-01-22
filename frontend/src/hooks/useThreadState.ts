import { useState, useEffect } from 'react';
import { IMessage, IThread } from '../types';

const STORAGE_KEY = 'chatThreads';

function getInitialThreads(): Record<string, IThread> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialThread = createNewThread();
    return { [initialThread.id]: initialThread };
  }
  return JSON.parse(stored);
}

function createNewThread(): IThread {
  return {
    messages: [],
    title: 'New Chat',
    id: 'thread-' + Date.now()
  };
}

export function useThreadState() {
  const [threads, setThreads] = useState<Record<string, IThread>>(getInitialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(Object.keys(getInitialThreads())[0]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  const createThread = () => {
    const newThread = createNewThread();
    setThreads(prev => ({ [newThread.id]: newThread, ...prev }));
    setActiveThreadId(newThread.id);
  };

  const selectThread = (id: string) => {
    setActiveThreadId(id);
  };

  const addMessageToThread = (message: IMessage) => {
    setThreads(prev => ({
      ...prev,
      [activeThreadId]: {
        ...prev[activeThreadId],
        messages: [...prev[activeThreadId].messages, message]
      }
    }));
  };

  const updateThread = (id: string, updates: Partial<IThread>) => {
    setThreads(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
  };

  const deleteThread = (id: string) => {
    setThreads(prev => {
      const newThreads = { ...prev };
      delete newThreads[id];
      
      // If we're deleting the active thread, switch to another thread
      if (id === activeThreadId) {
        const remainingIds = Object.keys(newThreads);
        if (remainingIds.length > 0) {
          setActiveThreadId(remainingIds[0]);
        } else {
          // If no threads left, create a new one
          const newThread = createNewThread();
          newThreads[newThread.id] = newThread;
          setActiveThreadId(newThread.id);
        }
      }
      
      return newThreads;
    });
  };

  return {
    threads,
    activeThreadId,
    createThread,
    selectThread,
    addMessageToThread,
    updateThread,
    deleteThread,
  };
} 