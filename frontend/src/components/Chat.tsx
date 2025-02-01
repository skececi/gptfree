import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import remarkGfm from 'remark-gfm';
import { api } from '../api';
import { useMessages } from '../hooks/useMessages';
import { IMessage } from '../types';

interface MessageProps {
  message: IMessage;
}

export function Message({ message }: MessageProps) {
  return (
    <div
      className={`py-6 flex ${
        message.role === 'assistant' ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`
          rounded-3xl px-5 py-2.5 
          ${
            message.role === 'assistant'
              ? 'w-full text-[#0D0D0D] prose max-w-none break-words whitespace-pre-wrap leading-normal [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:whitespace-pre-wrap [&_p]:my-0 [&_p]:leading-normal'
              : 'w-fit bg-[#F3F3F3] text-[#0D0D0D] break-words whitespace-pre-wrap'
          }
        `}
      >
        {message.role === 'assistant' ? (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {message.content}
            </ReactMarkdown>
            <div className="text-xs mt-2 text-[#5D5D5D]">
              {message.model}
            </div>
          </>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

export function Chat() {
  const { isLoading, error, sendMessage, currentMessages } = useMessages();

  const [input, setInput] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  useEffect(() => {
    async function fetchModels() {
      const { data, error } = await api.getModels();
      if (error) {
        console.error('Error fetching models:', error);
        setModels([]);
        return;
      }
      if (data) {
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0]);
      }
    }
    fetchModels();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const message = input;
    setInput('');
    await sendMessage(message, selectedModel);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input !== '' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col">
      <div
        className="flex items-center justify-between text-[#5D5D5D] pt-4 pb-2 px-4"
      >
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="text-base text-[#374151] py-1 pr-6 pl-3 rounded-[6px] border border-[#e5e7eb] cursor-pointer"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <div className="text-base font-semibold">
          <a
            href="https://samkececi.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            💎
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[200px]">
        {currentMessages.map((message, index) => (
          <Message
            key={`${message.role}-${message.content}-${index}`}
            message={message}
          />
        ))}
        {isLoading && (
          <div className="py-6 flex justify-start">
            <div className="px-4 py-3 rounded-[16px] max-w-[80%] w-full text-[#0D0D0D]">
              ...
            </div>
          </div>
        )}
        {error && (
          <div className="py-6 flex">
            <div className="px-4 py-3 rounded-[16px] max-w-[80%] w-full bg-red-50 text-red-700">
              Error: {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white px-[200px] py-6">
        <div className="relative flex w-full items-center justify-center">
          <div className="w-[800px]">
            <div className="flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors bg-[#f4f4f4]">
              <div className="flex min-h-[44px] items-start pl-2">
                <div className="min-w-0 max-w-full flex-1">
                  <input
                    name="message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={"Message " + selectedModel}
                    autoComplete="off"
                    className="block w-full resize-none border-0 bg-transparent px-0 py-2 text-base font-sans font-light text-[#0D0D0D] placeholder:text-[#5D5D5D] focus:outline-none"
                  />
                </div>
                <div className="w-[32px] pt-1" />
              </div>
              
              <div className="flex h-[44px] items-center justify-between">
                <div className="flex gap-x-1" />
                <div className="flex gap-x-1">
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:opacity-70 focus-visible:outline-none disabled:opacity-50 bg-black text-white disabled:bg-[#D7D7D7]"
                    aria-label="Send message"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 