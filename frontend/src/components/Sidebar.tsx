import { useThread } from '../state/ThreadContext'

export function Sidebar() {
  const { threads, activeThreadId, createThread, selectThread } = useThread()

  return (
    <div className="w-[260px] bg-[#F9F9F9] border-r border-black/10 flex flex-col h-screen">
      <div className="p-2">
        <button
          onClick={createThread}
          className="w-full p-3 flex items-center gap-2 text-sm text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6]"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {Object.entries(threads).map(([id, thread]) => (
          <div
            key={id}
            onClick={() => selectThread(id)}
            className={`
              p-3 mb-0.5 rounded-lg cursor-pointer 
              text-[#374151] text-sm truncate
              hover:bg-[#f3f4f6] transition-colors
              ${id === activeThreadId ? 'bg-[#e5e7eb]' : ''}
            `}
          >
            {thread.title}
          </div>
        ))}
      </div>
    </div>
  )
} 