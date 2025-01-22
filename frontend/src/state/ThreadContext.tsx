import { createContext, useContext, ReactNode } from 'react';
import { useThreadState } from '../hooks/useThreadState';
import { IThread, IMessage } from '../types';


interface ThreadContextType {
  threads: Record<string, IThread>;
  activeThreadId: string;
  createThread: () => void;
  selectThread: (id: string) => void;
  addMessageToThread: (message: IMessage) => void;
  updateThread: (id: string, updates: Partial<IThread>) => void;
  deleteThread: (id: string) => void;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const threadState = useThreadState();
  
  return (
    <ThreadContext.Provider value={threadState}>
      {children}
    </ThreadContext.Provider>
  );
}

export function useThread() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider');
  }
  return context;
} 