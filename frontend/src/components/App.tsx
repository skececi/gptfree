import { Sidebar } from './Sidebar'
import { Chat } from './Chat'
import { ThreadProvider } from '../state/ThreadContext'

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Chat />
    </div>
  )
}

export default function AppWrapper() {
  return (
    <ThreadProvider>
      <App />
    </ThreadProvider>
  )
}
