import { useThread } from '../state/ThreadContext'

export function Sidebar() {
  const { threads, activeThreadId, createThread, selectThread, deleteThread } = useThread()

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
              group p-3 mb-0.5 rounded-lg cursor-pointer 
              text-[#374151] text-sm 
              hover:bg-[#f3f4f6] transition-colors
              flex items-center justify-between
              ${id === activeThreadId ? 'bg-[#e5e7eb]' : ''}
            `}
          >
            <span className="flex-1 truncate pr-2">{thread.title}</span>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteThread(id)
              }}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 ml-2 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 